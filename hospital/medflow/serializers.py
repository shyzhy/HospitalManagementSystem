from rest_framework import serializers
from .models import Patient, Doctor, Visit, Consultation, Prescription, Treatment, MedicalRecord
from django.contrib.auth.models import User


# ----------------- PATIENT -----------------
class PatientSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField()  # Combines first_name + last_name
    class Meta:
        model = Patient
        fields = '__all__'


# ----------------- DOCTOR -----------------
class DoctorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True, required=False)
    first_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False)

    user_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Doctor
        fields = [
            'id', 'username', 'first_name', 'last_name', 'password',
            'specialization', 'license_number', 'is_available', 'user_details'
        ]

    def get_user_details(self, obj):
        return {
            "username": obj.user.username,
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name
        }

    def create(self, validated_data):
        username = validated_data.pop('username', '')
        password = validated_data.pop('password', None)
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')

        user = User(username=username, first_name=first_name, last_name=last_name)
        if password:
            user.set_password(password)
        user.save()
        doctor = Doctor.objects.create(user=user, **validated_data)
        return doctor

    def update(self, instance, validated_data):
        user = instance.user
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)

        if username:
            user.username = username
        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name
        if password:
            user.set_password(password)
        user.save()

        return super().update(instance, validated_data)


# ----------------- PRESCRIPTION -----------------
class PrescriptionSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Prescription
        fields = [
            'id', 'patient', 'patient_name', 'doctor', 'doctor_name',
            'medication', 'dosage', 'frequency', 'duration', 'date_prescribed'
        ]

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_doctor_name(self, obj):
        if obj.doctor and obj.doctor.user:
            return f"Dr. {obj.doctor.user.first_name} {obj.doctor.user.last_name}"
        return "Unknown Doctor"


# ----------------- VISIT -----------------
class VisitSerializer(serializers.ModelSerializer):
    prescriptions = PrescriptionSerializer(many=True, read_only=True)
    patient_details = PatientSerializer(source='patient', read_only=True)

    class Meta:
        model = Visit
        fields = ['id', 'patient', 'patient_details', 'doctor', 'visit_date', 'reason_for_visit', 'prescriptions']


# ----------------- CONSULTATION -----------------
class ConsultationSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Consultation
        fields = '__all__'

    def get_doctor_name(self, obj):
        if obj.doctor and obj.doctor.user:
            return f"Dr. {obj.doctor.user.first_name} {obj.doctor.user.last_name}"
        return "Unknown Doctor"


# ----------------- TREATMENT -----------------
class TreatmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Treatment
        fields = ['id', 'patient', 'patient_name', 'doctor', 'doctor_name',
                  'treatment_name', 'description', 'treatment_date']

    def get_doctor_name(self, obj):
        if obj.doctor and obj.doctor.user:
            return f"Dr. {obj.doctor.user.first_name} {obj.doctor.user.last_name}"
        return "Unknown Doctor"


# ----------------- MEDICAL RECORD -----------------
class MedicalRecordSerializer(serializers.ModelSerializer):
    patient_details = serializers.SerializerMethodField()
    prescriptions = serializers.SerializerMethodField()
    treatments = serializers.SerializerMethodField()

    class Meta:
        model = MedicalRecord
        fields = [
            'id', 'patient', 'patient_details',
            'blood_type', 'allergies', 'chronic_conditions', 'medical_history',
            'emergency_contact_name', 'emergency_contact_phone', 'attachment',
            'prescriptions', 'treatments',
            'created_at', 'updated_at'
        ]

    def get_patient_details(self, obj):
        return {
            "id": obj.patient.id,
            "patient_id": obj.patient.patient_id,
            "name": f"{obj.patient.first_name} {obj.patient.last_name}",
            "dob": obj.patient.dob,
            "gender": obj.patient.gender,
        }

    def get_prescriptions(self, obj):
        # Only prescriptions linked to this MedicalRecord
        prescriptions = obj.prescriptions.all()
        return PrescriptionSerializer(prescriptions, many=True).data

    def get_treatments(self, obj):
        # Only treatments linked to this MedicalRecord
        treatments = obj.treatments.all()
        return TreatmentSerializer(treatments, many=True).data