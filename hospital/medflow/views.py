from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Patient, Doctor, Consultation, Prescription, Treatment, MedicalRecord
from .serializers import (
    PatientSerializer, DoctorSerializer, ConsultationSerializer,
    PrescriptionSerializer, TreatmentSerializer, MedicalRecordSerializer
)


# --- PATIENT VIEWSET ---
class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer

    def perform_create(self, serializer):
        """Create a linked User account when registering a new Patient."""
        username = self.request.data.get('username', '').strip()
        password = self.request.data.get('password', '').strip()
        user = User.objects.create_user(username=username, password=password) if username else None
        serializer.save(user=user)

    def perform_update(self, serializer):
        """Update linked user credentials if provided."""
        instance = serializer.save()
        username = self.request.data.get('username', '').strip()
        password = self.request.data.get('password', '').strip()

        if username and not instance.user:
           user = User.objects.create_user(username=username, password=password)
           instance.user = user
           instance.save()
        elif instance.user:
            if username:
                instance.user.username = username
            if password:
                instance.user.set_password(password)
            instance.user.save()

    def perform_destroy(self, instance):
        """Clean up the linked User account when a Patient is deleted."""
        if instance.user:
            instance.user.delete()
        instance.delete()

    def get_queryset(self):
        user = self.request.user
        # Admins and Doctors can see all patients
        if user.is_staff or Doctor.objects.filter(user=user).exists():
            return Patient.objects.all()

        # Patients can only see their own profile
        patient = Patient.objects.filter(user=user).first()
        if patient:
            return Patient.objects.filter(id=patient.id)
        return Patient.objects.none()


# --- DOCTOR VIEWSET ---
class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

    def perform_create(self, serializer):
        """Create a linked User account when registering a new Doctor."""
        username = self.request.data.get('username', '').strip()
        password = self.request.data.get('password', '').strip()
        user = User.objects.create_user(username=username, password=password) if username else None
        serializer.save(user=user)
        
    def perform_update(self, serializer):
        """Update linked user credentials if provided."""
        instance = serializer.save()
        username = self.request.data.get('username', '').strip()
        password = self.request.data.get('password', '').strip()

        if username and not instance.user:
           user = User.objects.create_user(username=username, password=password)
           instance.user = user
           instance.save()
        elif instance.user:
            if username:
                instance.user.username = username
            if password:
                instance.user.set_password(password)
            instance.user.save()

    def perform_destroy(self, instance):
        """Clean up the linked User account when a Doctor is deleted."""
        if instance.user:
            instance.user.delete()
        instance.delete()


# --- CONSULTATION VIEWSET ---
class ConsultationViewSet(viewsets.ModelViewSet):
    serializer_class = ConsultationSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Consultation.objects.all()

        doctor = Doctor.objects.filter(user=user).first()
        if doctor:
            return Consultation.objects.filter(doctor=doctor)

        patient = Patient.objects.filter(user=user).first()
        if patient:
            return Consultation.objects.filter(patient=patient)

        return Consultation.objects.none()


# --- PRESCRIPTION VIEWSET ---
class PrescriptionViewSet(viewsets.ModelViewSet):
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Prescription.objects.all()

        doctor = Doctor.objects.filter(user=user).first()
        if doctor:
            return Prescription.objects.filter(doctor=doctor)

        patient = Patient.objects.filter(user=user).first()
        if patient:
            return Prescription.objects.filter(patient=patient)

        return Prescription.objects.none()


# --- TREATMENT VIEWSET ---
class TreatmentViewSet(viewsets.ModelViewSet):
    serializer_class = TreatmentSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Treatment.objects.all()

        doctor = Doctor.objects.filter(user=user).first()
        if doctor:
            return Treatment.objects.filter(doctor=doctor)

        patient = Patient.objects.filter(user=user).first()
        if patient:
            return Treatment.objects.filter(patient=patient)

        return Treatment.objects.none()


# --- MEDICAL RECORD VIEWSET ---
class MedicalRecordViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalRecordSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or Doctor.objects.filter(user=user).exists():
            queryset = MedicalRecord.objects.all()
            patient_id = self.request.query_params.get('patient')
            if patient_id:
                queryset = queryset.filter(patient__id=patient_id)
            return queryset
        return MedicalRecord.objects.none()

    def perform_create(self, serializer):
        # 1. Save the record
        medical_record = serializer.save()

        # 2. Sync floating data (No 'return' needed here)
        Treatment.objects.filter(
            patient=medical_record.patient,
            medical_record__isnull=True
        ).update(medical_record=medical_record)

        Prescription.objects.filter(
            patient=medical_record.patient,
            medical_record__isnull=True
        ).update(medical_record=medical_record)