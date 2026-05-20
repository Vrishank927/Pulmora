from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import (
    test_api,
    register_user,
    create_patient_profile,
    PatientProfileView,
    XRayUploadView,
    PredictionView,
        ReportView,
        ListReportsView,
    #XRayPredictionAPI

)

urlpatterns = [
    path("test/", test_api),
    path("register/", register_user),
    path("api-token-auth/", obtain_auth_token), 
    path("patient/create/", create_patient_profile),
    path("patient/profile/", PatientProfileView.as_view()),
    path("xray/upload/", XRayUploadView.as_view()),
    path("prediction/<int:xray_id>/", PredictionView.as_view()),
    path("report/<int:xray_id>/", ReportView.as_view()),
    path("reports/", ListReportsView.as_view()),
     #path("predict-xray/", XRayPredictionAPI.as_view()),
]
