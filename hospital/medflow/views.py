from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db import models
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

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Patient.objects.filter(is_deleted=False)
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            return self.queryset.filter(
                models.Q(treatments__doctor=doctor) | 
                models.Q(consultations__doctor=doctor) |
                models.Q(prescriptions__doctor=doctor)
            ).distinct()
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(user=user)
            
        return self.queryset.none()

    def perform_create(self, serializer):
        username = serializer.validated_data.pop('username', None)
        password = serializer.validated_data.pop('password', None)
        
        user = None
        if username:
            user = User.objects.create(username=username)
            if password:
                user.set_password(password)
            user.save()
            
        serializer.save(user=user)

    def perform_destroy(self, instance):
        instance.soft_delete()

class PatientRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Patient.objects.filter(is_deleted=False)
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            return self.queryset.filter(
                models.Q(treatments__doctor=doctor) | 
                models.Q(consultations__doctor=doctor) |
                models.Q(prescriptions__doctor=doctor)
            ).distinct()
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(user=user)
            
        return self.queryset.none()

    def perform_update(self, serializer):
        username = serializer.validated_data.pop('username', None)
        password = serializer.validated_data.pop('password', None)
        
        instance = serializer.save()
        if instance.user:
            if username:
                instance.user.username = username
            if password:
                instance.user.set_password(password)
            instance.user.save()

    def perform_destroy(self, instance):
        instance.soft_delete()


# ==========================================
# DOCTOR VIEWS
# ==========================================
class DoctorListCreateView(ListCreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

    def get_queryset(self):
        return Doctor.objects.filter(is_deleted=False)

    def perform_create(self, serializer):
        username = serializer.validated_data.pop('username', None)
        password = serializer.validated_data.pop('password', None)
        
        user = None
        if username:
            user = User.objects.create(username=username)
            if password:
                user.set_password(password)
            user.save()
            
        serializer.save(user=user)

    def perform_destroy(self, instance):
        instance.soft_delete()

class DoctorRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

    def perform_update(self, serializer):
        username = serializer.validated_data.pop('username', None)
        password = serializer.validated_data.pop('password', None)
        
        instance = serializer.save()
        if instance.user:
            if username:
                instance.user.username = username
            if password:
                instance.user.set_password(password)
            instance.user.save()

    def perform_destroy(self, instance):
        instance.soft_delete()


# ==========================================
# CONSULTATION VIEWS
# ==========================================
class ConsultationListCreateView(ListCreateAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Consultation.objects.all()
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            return self.queryset.filter(doctor=doctor)
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(patient=patient)
            
        return self.queryset.none()

class ConsultationRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Consultation.objects.all()
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            return self.queryset.filter(doctor=doctor)
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(patient=patient)
            
        return self.queryset.none()


# ==========================================
# PRESCRIPTION VIEWS
# ==========================================
class PrescriptionListCreateView(ListCreateAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Prescription.objects.all()
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            return self.queryset.filter(doctor=doctor)
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(patient=patient)
            
        return self.queryset.none()

class PrescriptionRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Prescription.objects.all()
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            return self.queryset.filter(doctor=doctor)
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(patient=patient)
            
        return self.queryset.none()


# ==========================================
# TREATMENT VIEWS
# ==========================================
class TreatmentListCreateView(ListCreateAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Treatment.objects.all()
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            return self.queryset.filter(doctor=doctor)
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(patient=patient)
            
        return self.queryset.none()

class TreatmentRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Treatment.objects.all()
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            return self.queryset.filter(doctor=doctor)
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(patient=patient)
            
        return self.queryset.none()


# ==========================================
# MEDICAL RECORD VIEWS
# ==========================================
class MedicalRecordListCreateView(ListCreateAPIView):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return MedicalRecord.objects.all()
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            # Show records for patients this doctor has consulted, treated, or prescribed to
            return self.queryset.filter(
                models.Q(patient__treatments__doctor=doctor) | 
                models.Q(patient__consultations__doctor=doctor) |
                models.Q(patient__prescriptions__doctor=doctor)
            ).distinct()
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(patient=patient)
            
        return self.queryset.none()

class MedicalRecordRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return MedicalRecord.objects.all()
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            # Show records for patients this doctor has consulted, treated, or prescribed to
            return self.queryset.filter(
                models.Q(patient__treatments__doctor=doctor) | 
                models.Q(patient__consultations__doctor=doctor) |
                models.Q(patient__prescriptions__doctor=doctor)
            ).distinct()
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(patient=patient)
            
        return self.queryset.none()