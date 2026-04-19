from django.urls import path
from . import views

urlpatterns = [
    # Patients
    path('patients/', views.PatientListCreateView.as_view(), name='patient-list'),
    path('patients/<int:pk>/', views.PatientRetrieveUpdateDestroyView.as_view(), name='patient-detail'),

    # Doctors
    path('doctors/', views.DoctorListCreateView.as_view(), name='doctor-list'),
    path('doctors/<int:pk>/', views.DoctorRetrieveUpdateDestroyView.as_view(), name='doctor-detail'),

    # Consultations
    path('consultations/', views.ConsultationListCreateView.as_view(), name='consultation-list'),
    path('consultations/<int:pk>/', views.ConsultationRetrieveUpdateDestroyView.as_view(), name='consultation-detail'),

    # Prescriptions
    path('prescriptions/', views.PrescriptionListCreateView.as_view(), name='prescription-list'),
    path('prescriptions/<int:pk>/', views.PrescriptionRetrieveUpdateDestroyView.as_view(), name='prescription-detail'),

    # Treatments
    path('treatments/', views.TreatmentListCreateView.as_view(), name='treatment-list'),
    path('treatments/<int:pk>/', views.TreatmentRetrieveUpdateDestroyView.as_view(), name='treatment-detail'),

    # Medical Records
    path('medical-records/', views.MedicalRecordListCreateView.as_view(), name='medical-records-list'),
    path('medical-records/<int:pk>/', views.MedicalRecordRetrieveUpdateDestroyView.as_view(), name='medical-records-detail'),
]