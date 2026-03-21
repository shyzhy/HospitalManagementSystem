from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import Patient, Doctor, Visit, Consultation, Prescription, Treatment, MedicalRecord
from .serializers import (
    PatientSerializer, 
    DoctorSerializer, 
    VisitSerializer, 
    ConsultationSerializer, 
    PrescriptionSerializer,
    TreatmentSerializer,
    MedicalRecordSerializer
)


# ----------------- PATIENT -----------------
class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


# ----------------- DOCTOR -----------------
class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer


# ----------------- VISIT -----------------
class VisitViewSet(viewsets.ModelViewSet):
    queryset = Visit.objects.all()
    serializer_class = VisitSerializer


# ----------------- CONSULTATION -----------------
class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer


# ----------------- PRESCRIPTION -----------------
class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer


# ----------------- TREATMENT -----------------
class TreatmentViewSet(viewsets.ModelViewSet):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer


# ----------------- MEDICAL RECORD -----------------
class MedicalRecordViewSet(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer

    def get_queryset(self):
        """
        Optionally filter MedicalRecords by patient ID using ?patient=<id>
        """
        queryset = MedicalRecord.objects.all()
        patient_id = self.request.query_params.get('patient')
        if patient_id:
            queryset = queryset.filter(patient__id=patient_id)
        return queryset

    def perform_create(self, serializer):
        """
        When creating a MedicalRecord:
        - Save the record
        - Automatically link all existing Treatments & Prescriptions of that patient
        """
        medical_record = serializer.save()

        # Link existing Treatments
        Treatment.objects.filter(
            patient=medical_record.patient,
            medical_record__isnull=True
        ).update(medical_record=medical_record)

        # Link existing Prescriptions
        Prescription.objects.filter(
            patient=medical_record.patient,
            medical_record__isnull=True
        ).update(medical_record=medical_record)

        return medical_record