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
    username = serializers.CharField(write_only=True, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    user_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Patient
        fields = '__all__'

    def get_user_details(self, obj):
        return {"username": obj.user.username} if hasattr(obj, 'user') and obj.user else None

    def create(self, validated_data):
        username = validated_data.pop('username', '').strip()
        password = validated_data.pop('password', '').strip()
        user = None
        
        if username:
            user = User.objects.create_user(username=username, password=password)
            user.first_name = validated_data.get('first_name', '')
            user.last_name = validated_data.get('last_name', '')
            user.save()
            
        return Patient.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        username = validated_data.pop('username', '').strip()
        password = validated_data.pop('password', '').strip()
        
        if not instance.user and username:
            instance.user = User.objects.create_user(username=username, password=password)
            instance.save() 
            
        if instance.user:
            if username: instance.user.username = username
            if password: instance.user.set_password(password)
            instance.user.save()
            
        return super().update(instance, validated_data)

# --- DOCTOR SERIALIZER ---
class DoctorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)
    user_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Doctor
        fields = '__all__'
        read_only_fields = ['user'] 

    def get_user_details(self, obj):
        if obj.user:
            return {
                "username": obj.user.username, 
                "first_name": obj.user.first_name, 
                "last_name": obj.user.last_name
            }
        return None

    def create(self, validated_data):
        username = validated_data.pop('username', '').strip()
        password = validated_data.pop('password', '').strip()
        fname = validated_data.pop('first_name', '').strip()
        lname = validated_data.pop('last_name', '').strip()

        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "This username is already taken."})

        user = User.objects.create_user(username=username, password=password, first_name=fname, last_name=lname)
        return Doctor.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)
        fname = validated_data.pop('first_name', None)
        lname = validated_data.pop('last_name', None)

        if not instance.user and username:
            instance.user = User.objects.create_user(username=username, password=password)
            instance.save()

        if instance.user:
            if username: instance.user.username = username
            if password: instance.user.set_password(password)
            if fname is not None: instance.user.first_name = fname
            if lname is not None: instance.user.last_name = lname
            instance.user.save()

        return super().update(instance, validated_data)

# --- BASE RECORD SERIALIZER ---
class BaseRecordSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.__str__', read_only=True)
    doctor_name = serializers.SerializerMethodField(read_only=True)

    def get_doctor_name(self, obj):
        if hasattr(obj, 'doctor') and obj.doctor and obj.doctor.user:
            return f"Dr. {obj.doctor.user.first_name} {obj.doctor.user.last_name}".strip()
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