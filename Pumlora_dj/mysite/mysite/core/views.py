

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .models import PatientProfile, XRayTest, AIDiagnosis
from .serializers import (
    PatientProfileSerializer,
    XRayTestSerializer,
    AIDiagnosisSerializer
)

from .ml.predictor import predict_xray

@api_view(["GET"])
def test_api(request):
    return Response({"message": "Pulmora API is working"})

@api_view(["POST"])
def register_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email", "")
    
    if not username or not password:
        return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, password=password, email=email)
    
    return Response({
        "message": "User created successfully",
        "user_id": user.id,
        "username": user.username
    }, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_patient_profile(request):
    serializer = PatientProfileSerializer(data=request.data)
    if serializer.is_valid():
        profile, created = PatientProfile.objects.get_or_create(user=request.user, defaults=serializer.validated_data)
        if not created:
            # Update existing profile
            update_serializer = PatientProfileSerializer(profile, data=serializer.validated_data, partial=True)
            if update_serializer.is_valid():
                update_serializer.save()
                return Response(update_serializer.data, status=status.HTTP_200_OK)
            return Response(update_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            # New profile, return the saved instance data
            return Response(PatientProfileSerializer(profile).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PatientProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        profile = get_object_or_404(PatientProfile, user=request.user)
        serializer = PatientProfileSerializer(profile)
        return Response(serializer.data)

class XRayUploadView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        profile = get_object_or_404(PatientProfile, user=request.user)
        data = request.data.copy()
        data["patient"] = profile.id
        serializer = XRayTestSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PredictionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, xray_id):
        try:
            xray = get_object_or_404(XRayTest, id=xray_id)

            # Check if xray belongs to the user
            if xray.patient.user != request.user:
                return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

            # FIXED: Correct field name is xray_image
            result = predict_xray(xray.xray_image.path)

            # SAVE TO DATABASE with updated keys
            diagnosis, created = AIDiagnosis.objects.get_or_create(
                xray_test=xray,
                defaults={
                    "prediction": result["diagnosis"],
                    "severity_level": result["severity_label"],
                    "confidence_score": round(result["pneumonia_probability"], 2),
                    "ai_summary": result["message"],
                    "model_version": "Pulmora-v1.0"
                }
            )

            serializer = AIDiagnosisSerializer(diagnosis)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, xray_id):
        xray = get_object_or_404(XRayTest, id=xray_id)
        diagnosis = get_object_or_404(AIDiagnosis, xray_test=xray)
        patient = xray.patient

        return Response({
            "patient_name": patient.full_name,
            "age": patient.age,
            "gender": patient.gender,
            "prediction": diagnosis.prediction,
            "severity": diagnosis.severity_level,
            "confidence": diagnosis.confidence_score,
            "summary": diagnosis.ai_summary,
            "model_version": diagnosis.model_version,
            "date": diagnosis.created_at
        })

class ListReportsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_object_or_404(PatientProfile, user=request.user)
        diagnoses = AIDiagnosis.objects.filter(xray_test__patient=profile)
        serializer = AIDiagnosisSerializer(diagnoses, many=True)
        return Response(serializer.data)
