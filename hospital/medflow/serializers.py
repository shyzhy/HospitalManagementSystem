from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Patient, Doctor, Visit, MedicalRecord, Prescription, Treatment

# --- User & Doctor Serializers ---
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Doctor
        fields = ['id', 'user', 'specialization', 'license_number', 'is_available']

# --- Patient Serializer ---
class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

# --- Sub-serializers for Nested Visit Data ---
class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'

class TreatmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Treatment
        fields = '__all__'

class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = ['id', 'visit', 'symptoms', 'diagnosis', 'treatment_plan', 'physician_notes', 'last_updated']

# --- The "Main" Visit Serializer ---
class VisitSerializer(serializers.ModelSerializer):
    # These read_only fields allow the React frontend to see full details 
    # instead of just ID numbers when fetching visits.
    patient_details = PatientSerializer(source='patient', read_only=True)
    doctor_details = DoctorSerializer(source='doctor', read_only=True)
    
    # Nested medical data for the "History" view
    medical_record = MedicalRecordSerializer(read_only=True)
    prescriptions = PrescriptionSerializer(many=True, read_only=True)
    treatments = TreatmentSerializer(many=True, read_only=True)

    class Meta:
        model = Visit
        fields = [
            'id', 'patient', 'doctor', 'patient_details', 'doctor_details', 
            'visit_date', 'reason_for_visit', 'vitals', 
            'medical_record', 'prescriptions', 'treatments'
        ]