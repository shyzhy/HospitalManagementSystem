from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
# pyrefly: ignore [missing-import]
from rest_framework.views import APIView
# pyrefly: ignore [missing-import]
from rest_framework import permissions, status
# pyrefly: ignore [missing-import]
from rest_framework.response import Response
# pyrefly: ignore [missing-import]
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth.models import User
from django.db import models
# pyrefly: ignore [missing-import]
from .models import Patient, Doctor, Consultation, Prescription, Treatment, MedicalRecord, Notification
# pyrefly: ignore [missing-import]
from .serializers import (
    PatientSerializer, DoctorSerializer, ConsultationSerializer,
    PrescriptionSerializer, TreatmentSerializer, MedicalRecordSerializer,
    NotificationSerializer
)

# pyrefly: ignore [missing-import]
from .emails import CustomActivationEmail


# ==========================================
# PATIENT SELF-REGISTRATION (PUBLIC)
# ==========================================
class PatientRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        re_password = data.get('re_password', '').strip()
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        dob = data.get('dob', '')
        gender = data.get('gender', 'M')
        phone = data.get('phone', '').strip()
        address = data.get('address', '').strip()

        # Validation
        if not all([email, password, re_password, first_name, last_name, dob]):
            return Response({'error': 'All required fields must be filled.'}, status=status.HTTP_400_BAD_REQUEST)

        if password != re_password:
            return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=email).exists():
            return Response({'error': 'An account with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create INACTIVE User + Patient (requires email activation)
        user = User.objects.create_user(
            username=email, email=email, password=password,
            first_name=first_name, last_name=last_name,
            is_active=False
        )
        Patient.objects.create(
            user=user,
            first_name=first_name,
            last_name=last_name,
            dob=dob,
            gender=gender,
            phone=phone,
            address=address,
        )

        # Send activation email
        context = {'user': user}
        CustomActivationEmail(request, context).send([email])

        return Response({'message': 'Account created! Please check your email to activate your account.'}, status=status.HTTP_201_CREATED)

# ==========================================
# PAITENT VIEWS
# ==========================================
class PatientListCreateView(ListCreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Patient.objects.filter(is_deleted=False)
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            # Doctors can view all patients for directory searching, 
            # OR restricted list based on query param
            consulted_only = self.request.query_params.get('consulted_only') == 'true'
            if consulted_only:
                return Patient.objects.filter(
                    models.Q(is_deleted=False) & (
                        models.Q(consultations__doctor=doctor) | 
                        models.Q(treatments__doctor=doctor) | 
                        models.Q(prescriptions__doctor=doctor)
                    )
                ).distinct()
            return Patient.objects.filter(is_deleted=False)
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(user=user)
            
        return self.queryset.none()

    def perform_create(self, serializer):
        email = serializer.validated_data.pop('email', None)
        password = serializer.validated_data.pop('password', None)
        
        user = None
        if email:
            user = User.objects.create(username=email, email=email)
            if password:
                user.set_password(password)
            user.save()
            
        serializer.save(user=user)

    def perform_destroy(self, instance):
        instance.soft_delete()

class PatientRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Patient.objects.filter(is_deleted=False)
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            # Doctors can access any active patient record for clinical continuity
            return Patient.objects.filter(is_deleted=False)
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(user=user)
            
        return self.queryset.none()

    def perform_update(self, serializer):
        email = serializer.validated_data.pop('email', None)
        password = serializer.validated_data.pop('password', None)
        
        instance = serializer.save()
        if instance.user:
            if email:
                instance.user.username = email
                instance.user.email = email
            if password:
                instance.user.set_password(password)
            instance.user.save()

    def perform_destroy(self, instance):
        instance.soft_delete()

class PatientUploadPictureView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            patient = Patient.objects.get(pk=pk)
            # Ensure the user owns this patient profile or is staff
            if patient.user != request.user and not request.user.is_staff:
                return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
            
            if 'profile_picture' not in request.data:
                return Response({'error': 'No picture provided.'}, status=status.HTTP_400_BAD_REQUEST)
            
            patient.profile_picture = request.data['profile_picture']
            patient.save()
            return Response({'message': 'Profile picture updated.', 'url': patient.profile_picture.url}, status=status.HTTP_200_OK)
        except Patient.DoesNotExist:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)


# ==========================================
# DOCTOR VIEWS
# ==========================================
class DoctorListCreateView(ListCreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return Doctor.objects.filter(is_deleted=False)

    def perform_create(self, serializer):
        email = serializer.validated_data.pop('email', None)
        password = serializer.validated_data.pop('password', None)
        
        user = None
        if email:
            user = User.objects.create(username=email, email=email)
            if password:
                user.set_password(password)
            user.save()
            
        serializer.save(user=user)

    def perform_destroy(self, instance):
        instance.soft_delete()

class DoctorRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_update(self, serializer):
        email = serializer.validated_data.pop('email', None)
        password = serializer.validated_data.pop('password', None)
        
        instance = serializer.save()
        if instance.user:
            if email:
                instance.user.username = email
                instance.user.email = email
            if password:
                instance.user.set_password(password)
            instance.user.save()

    def perform_destroy(self, instance):
        instance.soft_delete()

class DoctorUploadPictureView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            doctor = Doctor.objects.get(pk=pk)
            # Ensure the user owns this doctor profile or is staff
            if doctor.user != request.user and not request.user.is_staff:
                return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
            
            if 'profile_picture' not in request.data:
                return Response({'error': 'No picture provided.'}, status=status.HTTP_400_BAD_REQUEST)
            
            doctor.profile_picture = request.data['profile_picture']
            doctor.save()
            return Response({'message': 'Profile picture updated.', 'url': doctor.profile_picture.url}, status=status.HTTP_200_OK)
        except Doctor.DoesNotExist:
            return Response({'error': 'Doctor not found.'}, status=status.HTTP_404_NOT_FOUND)


# ==========================================
# CONSULTATION VIEWS
# ==========================================
class ConsultationListCreateView(ListCreateAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Consultation.objects.all()
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            # Doctors can view all consultations for complete patient history
            return Consultation.objects.all()
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(patient=patient)
            
        return self.queryset.none()

class ConsultationRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Consultation.objects.all()
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            # Doctors can access any consultation record
            return Consultation.objects.all()
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(patient=patient)
            
        return self.queryset.none()

    def perform_update(self, serializer):
        old_instance = self.get_object()
        instance = serializer.save()
        
        # If diagnosis was empty and now it's not, notify patient
        if not old_instance.diagnosis and instance.diagnosis:
            Notification.objects.create(
                patient=instance.patient,
                title="New Diagnosis Added",
                message=f"{instance.doctor.first_name} {instance.doctor.last_name} added a diagnosis to your consultation.",
                notification_type='consultation',
                related_id=instance.id
            )

# ==========================================
# PRESCRIPTION VIEWS
# ==========================================
class PrescriptionListCreateView(ListCreateAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Prescription.objects.all()
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            return Prescription.objects.all()
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(patient=patient)
            
        return self.queryset.none()

    def perform_create(self, serializer):
        instance = serializer.save()
        Notification.objects.create(
            patient=instance.patient,
            title="Prescription Issued",
            message=f"{instance.doctor.first_name} {instance.doctor.last_name} has issued you a new prescription.",
            notification_type='prescription',
            related_id=instance.id
        )

class PrescriptionRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Prescription.objects.all()
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            # Doctors can access any prescription
            return Prescription.objects.all()
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(patient=patient)
            
        return self.queryset.none()


# ==========================================
# TREATMENT VIEWS
# ==========================================
class TreatmentListCreateView(ListCreateAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Treatment.objects.all()
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            # Doctors can view all treatments
            return Treatment.objects.all()
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(patient=patient)
            
        return self.queryset.none()

class TreatmentRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Treatment.objects.all()
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            # Doctors can access any treatment record
            return Treatment.objects.all()
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(patient=patient)
            
        return self.queryset.none()


# ==========================================
# MEDICAL RECORD VIEWS
# ==========================================
class MedicalRecordListCreateView(ListCreateAPIView):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return MedicalRecord.objects.all()
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            # Doctors can view all medical records for clinical transparency
            return MedicalRecord.objects.all()
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(patient=patient)
            
        return self.queryset.none()

class MedicalRecordRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return MedicalRecord.objects.all()
        
        doctor = getattr(user, 'doctor_profile', None)
        if doctor:
            # Doctors can access any medical record for comprehensive patient care
            return MedicalRecord.objects.all()
        
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return self.queryset.filter(patient=patient)
            
        return self.queryset.none()

class NotificationListView(ListCreateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user = self.request.user
        patient = getattr(user, 'patient_profile', None)
        if patient:
            return Notification.objects.filter(patient=patient).order_by('-created_at')
        return Notification.objects.none()

class NotificationUpdateView(RetrieveUpdateDestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(patient__user=self.request.user)