from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# This automatically creates the 'patients/', 'doctors/', and 'consultations/' doors
router = DefaultRouter()
router.register(r'patients', views.PatientViewSet, basename='patient')
router.register(r'doctors', views.DoctorViewSet, basename='doctor')
router.register(r'consultations', views.ConsultationViewSet, basename='consultation')

urlpatterns = [
    path('', include(router.urls)),
    # These are your extra custom views
    path('visits/', views.VisitListCreateView.as_view(), name='visit-list'),
    path('prescriptions/visit/<int:visit_id>/', views.PrescriptionByVisitView.as_view(), name='prescription-by-visit'),
]