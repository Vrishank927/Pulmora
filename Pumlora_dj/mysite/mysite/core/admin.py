
# Register your models here.
from django.contrib import admin
from .models import PatientProfile, XRayTest, AIDiagnosis, MedicalReport

admin.site.register(PatientProfile)
admin.site.register(XRayTest)
admin.site.register(AIDiagnosis)
admin.site.register(MedicalReport)


