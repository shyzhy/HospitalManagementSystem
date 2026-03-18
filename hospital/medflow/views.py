from rest_framework import generics, permissions
from .models import Patient, Doctor, Visit, MedicalRecord, Prescription, Treatment
from .serializers import (
    PatientSerializer, DoctorSerializer, VisitSerializer, 
    MedicalRecordSerializer, PrescriptionSerializer, TreatmentSerializer
)

# --- Patient Views ---
class PatientListCreateView(generics.ListCreateAPIView):
    queryset = Patient.objects.all().order_by('-created_at')
    serializer_class = PatientSerializer

class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class DoctorListCreateView(generics.ListCreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class DoctorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    
# --- Visit Views (Consultations) ---
class VisitListCreateView(generics.ListCreateAPIView):
    queryset = Visit.objects.all().order_by('-visit_date')
    serializer_class = VisitSerializer

class VisitDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Visit.objects.all()
    serializer_class = VisitSerializer

# --- Medical Record Views ---
class MedicalRecordDetailView(generics.RetrieveUpdateAPIView):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer

# --- Prescription Views ---
class PrescriptionCreateView(generics.CreateAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

class PrescriptionByVisitView(generics.ListAPIView):
    serializer_class = PrescriptionSerializer
    
    def get_queryset(self):
        visit_id = self.kwargs['visit_id']
        return Prescription.objects.filter(visit_id=visit_id)

# --- Treatment Views ---
class TreatmentUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer