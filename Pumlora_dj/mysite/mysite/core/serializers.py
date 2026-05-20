from rest_framework import serializers
from .models import (
    PatientProfile,
    XRayTest,
    AIDiagnosis,
    MedicalReport
)

class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ['full_name', 'age', 'gender', 'phone', 'smoking_status', 'known_conditions']

class XRayTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = XRayTest
        fields = "__all__"

class AIDiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIDiagnosis
        fields = "__all__"

class MedicalReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalReport
        fields = "__all__"
