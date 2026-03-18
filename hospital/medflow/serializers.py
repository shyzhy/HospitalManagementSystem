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
    
    # FIX: Added required=False so updates don't fail without these fields
    username = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(write_only=True, required=False)

    class Meta:
        model = Doctor
        fields = [
            'id', 'user', 'specialization', 'license_number', 'is_available',
            'username', 'password', 'first_name', 'last_name', 'email'
        ]

    def create(self, validated_data):
        # Username and password are required for new users
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        email = validated_data.pop('email', '')

        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email
        )
        return Doctor.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        # 1. Update the linked User object first
        user = instance.user
        
        # We use .get() to see if the frontend sent new values
        user.first_name = validated_data.pop('first_name', user.first_name)
        user.last_name = validated_data.pop('last_name', user.last_name)
        user.email = validated_data.pop('email', user.email)
        
        # Only update password if it's actually provided
        password = validated_data.pop('password', None)
        if password:
            user.set_password(password)
        
        user.save()

        # 2. Update the Doctor fields (specialization, license, etc.)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

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
    patient_details = PatientSerializer(source='patient', read_only=True)
    doctor_details = DoctorSerializer(source='doctor', read_only=True)
    
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