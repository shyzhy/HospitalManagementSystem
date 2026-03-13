from django.urls import path
from . import views

urlpatterns = [
    # Patients
    path('patients/', views.PatientListCreateView.as_view(), name='patient-list'),
    path('patients/<int:pk>/', views.PatientDetailView.as_view(), name='patient-detail'),

    # Visits
    path('visits/', views.VisitListCreateView.as_view(), name='visit-list'),
    path('visits/<int:pk>/', views.VisitDetailView.as_view(), name='visit-detail'),

    # Medical Records
    path('records/<int:pk>/', views.MedicalRecordDetailView.as_view(), name='record-detail'),

    # Prescriptions
    path('prescriptions/', views.PrescriptionCreateView.as_view(), name='prescription-create'),
    path('visits/<int:visit_id>/prescriptions/', views.PrescriptionByVisitView.as_view(), name='visit-prescriptions'),

    # Treatments
    path('treatments/<int:pk>/', views.TreatmentUpdateView.as_view(), name='treatment-update'),
]