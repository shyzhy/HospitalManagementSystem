from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Patient, Doctor, Consultation, Prescription, Treatment, MedicalRecord
from .serializers import (
    PatientSerializer, DoctorSerializer, ConsultationSerializer,
    PrescriptionSerializer, TreatmentSerializer, MedicalRecordSerializer
)


# ==========================================
# PAITENT VIEWS
# ==========================================
class PatientListCreateView(ListCreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def perform_destroy(self, instance):
        instance.soft_delete()

class PatientRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def perform_destroy(self, instance):
        instance.soft_delete()


# ==========================================
# DOCTOR VIEWS
# ==========================================
class DoctorListCreateView(ListCreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

    def perform_destroy(self, instance):
        instance.soft_delete()

class DoctorRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

    def perform_destroy(self, instance):
        instance.soft_delete()


# ==========================================
# CONSULTATION VIEWS
# ==========================================
class ConsultationListCreateView(ListCreateAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

class ConsultationRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer


# ==========================================
# PRESCRIPTION VIEWS
# ==========================================
class PrescriptionListCreateView(ListCreateAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

class PrescriptionRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer


# ==========================================
# TREATMENT VIEWS
# ==========================================
class TreatmentListCreateView(ListCreateAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer

class TreatmentRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer


# ==========================================
# MEDICAL RECORD VIEWS
# ==========================================
class MedicalRecordListCreateView(ListCreateAPIView):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer

class MedicalRecordRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer