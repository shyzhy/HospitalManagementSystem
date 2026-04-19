from djoser.serializers import UserSerializer as DjoserUserSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Patient, Doctor, Consultation, Prescription, Treatment, MedicalRecord


# --- USER SERIALIZER ---
class CustomUserSerializer(DjoserUserSerializer):
    is_doctor = serializers.SerializerMethodField()
    doctor_id = serializers.SerializerMethodField()
    is_patient = serializers.SerializerMethodField()
    patient_id = serializers.SerializerMethodField()

    class Meta(DjoserUserSerializer.Meta):
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_staff', 'is_superuser', 'is_doctor', 'doctor_id', 'is_patient', 'patient_id'
        )

    def get_is_doctor(self, obj):
        return Doctor.objects.filter(user=obj).exists()

    def get_doctor_id(self, obj):
        doctor = Doctor.objects.filter(user=obj).first()
        return doctor.id if doctor else None

    def get_is_patient(self, obj):
        return Patient.objects.filter(user=obj).exists()

    def get_patient_id(self, obj):
        patient = Patient.objects.filter(user=obj).first()
        return patient.id if patient else None


# --- PATIENT SERIALIZER ---
class PatientSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Patient
        fields = '__all__'

    def get_user_details(self, obj):
        return {'username': obj.user.username} if hasattr(obj, 'user') and obj.user else None


# --- DOCTOR SERIALIZER ---
class DoctorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Doctor
        fields = ['id', 'first_name', 'last_name', 'username',
                  'specialization', 'license_number', 'is_available']


# --- BASE RECORD SERIALIZER ---
class BaseRecordSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.__str__', read_only=True)
    patient_first_name = serializers.CharField(source='patient.first_name', read_only=True)
    patient_last_name = serializers.CharField(source='patient.last_name', read_only=True)
    doctor_name = serializers.SerializerMethodField(read_only=True)

    def get_doctor_name(self, obj):
        if hasattr(obj, 'doctor') and obj.doctor:
            return f"Dr. {obj.doctor.first_name} {obj.doctor.last_name}".strip()
        return "N/A"


# --- SPECIFIC RECORD SERIALIZERS ---
class ConsultationSerializer(BaseRecordSerializer):
    consultation_date = serializers.DateField(format="%Y-%m-%d", input_formats=['%Y-%m-%d', 'iso-8601'])

    class Meta:
        model = Consultation
        fields = '__all__'


class PrescriptionSerializer(BaseRecordSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'


class TreatmentSerializer(BaseRecordSerializer):
    class Meta:
        model = Treatment
        fields = '__all__'


# --- MEDICAL RECORD SERIALIZER ---
class MedicalRecordSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.__str__', read_only=True)

    class Meta:
        model = MedicalRecord
        fields = '__all__'

    # THE 500 ERROR FIX: This prevents crashes if a patient already has a record!
    def validate_patient(self, value):
        if not self.instance and MedicalRecord.objects.filter(patient=value).exists():
            raise serializers.ValidationError("This patient already has a medical record. Please EDIT the existing one instead.")
        return value