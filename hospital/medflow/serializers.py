from rest_framework import serializers
from .models import Patient, Doctor, Visit, Consultation, Prescription

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    # Use the related_name from your model
    username = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Doctor
        fields = ['id', 'username', 'specialization', 'license_number']

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        # medication_name is now included to match the model and frontend
        fields = [
            'id', 'visit', 'consultation', 'medication_name', 
            'dosage', 'frequency', 'duration', 'instructions'
        ]

class VisitSerializer(serializers.ModelSerializer):
    # Nesting prescriptions allows the frontend to see them inside a visit
    prescriptions = PrescriptionSerializer(many=True, read_only=True)
    patient_details = PatientSerializer(source='patient', read_only=True)

    class Meta:
        model = Visit
        fields = ['id', 'patient', 'patient_details', 'doctor', 'visit_date', 'reason_for_visit', 'prescriptions']

class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = '__all__'