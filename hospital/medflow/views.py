from rest_framework import viewsets, generics
from .models import Patient, Doctor, Visit, MedicalRecord, Prescription, Treatment, Consultation
from .serializers import (
    PatientSerializer, DoctorSerializer, VisitSerializer, 
    MedicalRecordSerializer, PrescriptionSerializer, TreatmentSerializer, ConsultationSerializer
)

# --- ViewSets (Matches your urls.py) ---

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all().order_by('-created_at')
    serializer_class = PatientSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all().order_by('-consultation_date')
    serializer_class = ConsultationSerializer

# --- Additional API Views ---

class VisitListCreateView(generics.ListCreateAPIView):
    queryset = Visit.objects.all().order_by('-visit_date')
    serializer_class = VisitSerializer

class MedicalRecordDetailView(generics.RetrieveUpdateAPIView):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer

class PrescriptionByVisitView(generics.ListAPIView):
    serializer_class = PrescriptionSerializer
    def get_queryset(self):
        visit_id = self.kwargs['visit_id']
        return Prescription.objects.filter(visit_id=visit_id)

class TreatmentUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer