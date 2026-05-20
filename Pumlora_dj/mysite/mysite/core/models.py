from django.db import models
from django.contrib.auth.models import User


# =========================
# 1. PATIENT PROFILE
# =========================
class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    full_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)

    phone = models.CharField(max_length=15, blank=True, null=True)

    SMOKING_CHOICES = [
        ('Never', 'Never'),
        ('Former', 'Former'),
        ('Current', 'Current'),
    ]
    smoking_status = models.CharField(
        max_length=10,
        choices=SMOKING_CHOICES,
        blank=True,
        null=True
    )

    known_conditions = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name


# =========================
# 2. XRAY TEST
# =========================
class XRayTest(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE)

    xray_image = models.ImageField(upload_to='xrays/')

    IMAGE_TYPE_CHOICES = [
        ('PA', 'Posteroanterior'),
        ('AP', 'Anteroposterior'),
    ]
    image_type = models.CharField(max_length=2, choices=IMAGE_TYPE_CHOICES)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"XRay {self.id} - {self.patient.full_name}"


# =========================
# 3. AI DIAGNOSIS
# =========================
class AIDiagnosis(models.Model):
    xray_test = models.OneToOneField(XRayTest, on_delete=models.CASCADE)

    prediction = models.CharField(max_length=20)
    severity_level = models.CharField(max_length=20)

    confidence_score = models.FloatField()
    ai_summary = models.TextField()

    model_version = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.prediction} - {self.severity_level}"


# =========================
# 4. MEDICAL REPORT
# =========================
class MedicalReport(models.Model):
    diagnosis = models.OneToOneField(AIDiagnosis, on_delete=models.CASCADE)

    report_file = models.FileField(upload_to='reports/')
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report for {self.diagnosis.xray_test.patient.full_name}"
