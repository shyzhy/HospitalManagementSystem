from rest_framework import serializers
from .models import Patient, Doctor, Visit, Consultation, Prescription, Treatment
from django.contrib.auth.models import User

class PatientSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField() # This makes 'name' available to React
    class Meta:
        model = Patient
        fields = '__all__'


class DoctorSerializer(serializers.ModelSerializer):
    # 1. Use flat write_only fields so React can send standard JSON without crashing
    username = serializers.CharField(write_only=True, required=False)
    first_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False)
    
    # 2. Add a read-only field to easily fetch the user data back to React
    user_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Doctor
        # Added 'is_available' and 'user_details' to the fields list
        fields = ['id', 'username', 'first_name', 'last_name', 'password', 
                  'specialization', 'license_number', 'is_available', 'user_details']

    def get_user_details(self, obj):
        # This sends the actual name and username back to the React list
        return {
            "username": obj.user.username,
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name
        }

    def create(self, validated_data):
        # Pop the flat data directly out of the validated_data
        username = validated_data.pop('username', '')
        password = validated_data.pop('password', None)
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        
        # Create the User first
        user = User(
            username=username,
            first_name=first_name,
            last_name=last_name
        )
        if password:
            user.set_password(password)
        user.save()
        
        # Then create the Doctor linked to that User
        doctor = Doctor.objects.create(user=user, **validated_data)
        return doctor

    def update(self, instance, validated_data):
        # Pop the flat data for updating
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)
        
        user = instance.user
        if username:
            user.username = username
        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name
        if password:
            user.set_password(password)
        user.save()
        
        # Update the standard Doctor fields (specialization, license, etc.)
        return super().update(instance, validated_data)


class PrescriptionSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Prescription
        fields = ['id', 'patient', 'patient_name', 'doctor', 'doctor_name', 
                  'medication', 'dosage', 'frequency', 'duration']

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.user.first_name} {obj.doctor.user.last_name}"
class VisitSerializer(serializers.ModelSerializer):
    # Nesting prescriptions allows the frontend to see them inside a visit
    prescriptions = PrescriptionSerializer(many=True, read_only=True)
    patient_details = PatientSerializer(source='patient', read_only=True)

    class Meta:
        model = Visit
        fields = ['id', 'patient', 'patient_details', 'doctor', 'visit_date', 'reason_for_visit', 'prescriptions']

class ConsultationSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.first_name', read_only=True)
    # This pulls the doctor's user first and last name
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Consultation
        fields = '__all__'

    def get_doctor_name(self, obj):
        if obj.doctor and obj.doctor.user:
            return f"{obj.doctor.user.first_name} {obj.doctor.user.last_name}"
        return "Unknown"

# --- TREATMENT SERIALIZER ---
class TreatmentSerializer(serializers.ModelSerializer):
    # Pull names directly from the related models
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    # If your Patient model uses first/last name, use this instead:
    # patient_name = serializers.SerializerMethodField()
    
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Treatment
        fields = ['id', 'patient', 'patient_name', 'doctor', 'doctor_name', 
                  'treatment_name', 'description', 'treatment_date']

    def get_doctor_name(self, obj):
        if obj.doctor and obj.doctor.user:
            return f"Dr. {obj.doctor.user.first_name} {obj.doctor.user.last_name}"
        return "Unknown Doctor"

    # Optional: If Patient name needs combining
    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"