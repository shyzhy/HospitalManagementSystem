from django.urls import path
from . import views

urlpatterns = [
    # Public Registration
    path('register/', views.PatientRegisterView.as_view(), name='patient-register'),

    # Patients
    path('patients/', views.PatientListCreateView.as_view(), name='patient-list'),
    path('patients/<int:pk>/', views.PatientRetrieveUpdateDestroyView.as_view(), name='patient-detail'),
    path('patients/<int:pk>/upload_picture/', views.PatientUploadPictureView.as_view(), name='patient-upload-picture'),

    # Doctors
    path('doctors/', views.DoctorListCreateView.as_view(), name='doctor-list'),
    path('doctors/<int:pk>/', views.DoctorRetrieveUpdateDestroyView.as_view(), name='doctor-detail'),
    path('doctors/<int:pk>/upload_picture/', views.DoctorUploadPictureView.as_view(), name='doctor-upload-picture'),

    # Consultations
    path('consultations/', views.ConsultationListCreateView.as_view(), name='consultation-list'),
    path('consultations/<int:pk>/', views.ConsultationRetrieveUpdateDestroyView.as_view(), name='consultation-detail'),
    path('consultations/<int:pk>/status/', views.ConsultationStatusUpdateView.as_view(), name='consultation-status-update'),
    # Prescriptions
    path('prescriptions/', views.PrescriptionListCreateView.as_view(), name='prescription-list'),
    path('prescriptions/<int:pk>/', views.PrescriptionRetrieveUpdateDestroyView.as_view(), name='prescription-detail'),

    # Treatments
    path('treatments/', views.TreatmentListCreateView.as_view(), name='treatment-list'),
    path('treatments/<int:pk>/', views.TreatmentRetrieveUpdateDestroyView.as_view(), name='treatment-detail'),

    # Medical Records
    path('medical-records/', views.MedicalRecordListCreateView.as_view(), name='medical-records-list'),
    path('medical-records/<int:pk>/', views.MedicalRecordRetrieveUpdateDestroyView.as_view(), name='medical-records-detail'),

    # Notifications
    path('notifications/', views.NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/', views.NotificationUpdateView.as_view(), name='notification-detail'),

    # Chatbot
    path('chat/', views.ChatbotView.as_view(), name='chat'),   
    
    # Knowledge Base
    path('knowledge-base/', views.KnowledgeBaseView.as_view(), name='knowledge-base'),
]