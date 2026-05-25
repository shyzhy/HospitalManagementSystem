from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth.models import User
from django.db import models
import os
import requests
from django.db.models import Q
from .models import Patient, Doctor, Consultation, Prescription, Treatment, MedicalRecord, Notification, ChatMessage, KnowledgeBase
from .serializers import (
    PatientSerializer, DoctorSerializer, ConsultationSerializer,
    PrescriptionSerializer, TreatmentSerializer, MedicalRecordSerializer,
    NotificationSerializer, ChatMessageSerializer, KnowledgeBaseSerializer
)


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
            # Doctors can ONLY view patients who have appointed to them (consultations)
            return Patient.objects.filter(
                is_deleted=False,
                consultations__doctor=doctor
            ).distinct()
        
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
            # Doctors can only access patients who have appointed to them
            return Patient.objects.filter(
                is_deleted=False,
                consultations__doctor=doctor
            ).distinct()
        
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
        queryset = Doctor.objects.filter(is_deleted=False)

        available = self.request.query_params.get('available')

        if available == 'true':
            queryset = queryset.filter(is_available=True)

        return queryset

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
            return Consultation.objects.filter(doctor=doctor)
        
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
            return Consultation.objects.filter(doctor=doctor)
        
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
class ConsultationStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            consultation = Consultation.objects.select_related(
                'patient',
                'doctor'
            ).get(pk=pk)
        except Consultation.DoesNotExist:
            return Response(
                {'error': 'Consultation not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        user = request.user
        doctor = getattr(user, 'doctor_profile', None)

        # Only assigned doctor, staff, or superuser can approve/reject
        if not user.is_staff and not user.is_superuser:
            if not doctor or consultation.doctor != doctor:
                return Response(
                    {'error': 'You are not allowed to update this appointment.'},
                    status=status.HTTP_403_FORBIDDEN
                )

        appointment_status = request.data.get('appointment_status')
        rejection_reason = request.data.get('rejection_reason', '')

        if appointment_status not in ['approved', 'rejected']:
            return Response(
                {'error': 'appointment_status must be approved or rejected.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        consultation.appointment_status = appointment_status

        if appointment_status == 'rejected':
            consultation.rejection_reason = rejection_reason
        else:
            consultation.rejection_reason = ''

        consultation.save()

        if appointment_status == 'approved':
            Notification.objects.create(
                patient=consultation.patient,
                title='Appointment Approved',
                message=f'Dr. {consultation.doctor.first_name} {consultation.doctor.last_name} approved your appointment.',
                notification_type='consultation',
                related_id=consultation.id
            )

        if appointment_status == 'rejected':
            Notification.objects.create(
                patient=consultation.patient,
                title='Appointment Rejected',
                message=f'Dr. {consultation.doctor.first_name} {consultation.doctor.last_name} rejected your appointment. Reason: {rejection_reason or "No reason provided."}',
                notification_type='consultation',
                related_id=consultation.id
            )

        serializer = ConsultationSerializer(consultation)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
            return Prescription.objects.filter(doctor=doctor)
        
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
            return Prescription.objects.filter(doctor=doctor)
        
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
            return Treatment.objects.filter(doctor=doctor)
        
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
            return Treatment.objects.filter(doctor=doctor)
        
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
            return MedicalRecord.objects.filter(
                patient__consultations__doctor=doctor
            ).distinct()
        
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
            return MedicalRecord.objects.filter(
                patient__consultations__doctor=doctor
            ).distinct()
        
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

class ChatbotView(ListCreateAPIView):
    queryset = ChatMessage.objects.all().order_by("created_at")
    serializer_class = ChatMessageSerializer

    def create(self, request, *args, **kwargs):
        user_message = request.data.get("message", "").strip()

        if not user_message:
            return Response(
                {"error": "Message is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user_chat = ChatMessage.objects.create(
            role="user",
            message=user_message
        )

        message_lower = user_message.lower()

        # ---------------- DETECT CURRENT DOCTOR ----------------
        current_doctor = None

        if request.user and request.user.is_authenticated:
            current_doctor = Doctor.objects.filter(user=request.user).first()

        doctor_filter = {}
        if current_doctor:
            doctor_filter = {"doctor": current_doctor}

        # ---------------- HELPER FUNCTIONS ----------------
        def consultation_status_value(consultation):
            return getattr(consultation, "appointment_status", "pending") or "pending"

        def format_consultation(consultation):
            return (
                f"Consultation ID: {consultation.id}\n"
                f"Patient: {consultation.patient.first_name} {consultation.patient.last_name}\n"
                f"Doctor: Dr. {consultation.doctor.first_name} {consultation.doctor.last_name}\n"
                f"Date: {consultation.consultation_date}\n"
                f"Symptoms: {consultation.symptoms or 'None'}\n"
                f"Notes: {consultation.notes or 'None'}\n"
                f"Appointment Status: {consultation_status_value(consultation).title()}\n"
                f"Diagnosis: {consultation.diagnosis or 'Pending Diagnosis'}"
            )

        def save_and_return_ai_response(ai_response):
            ai_chat = ChatMessage.objects.create(
                role="assistant",
                message=ai_response
            )

            return Response({
                "user": ChatMessageSerializer(user_chat).data,
                "assistant": ChatMessageSerializer(ai_chat).data
            })

        # ======================================================
        # DIRECT ANSWERS FOR COMMON SYSTEM QUESTIONS
        # ======================================================

        # -------- Pending appointments / pending consultations --------
        if "pending" in message_lower and ("consultation" in message_lower or "appointment" in message_lower):
            pending_consultations = Consultation.objects.filter(
                appointment_status="pending",
                **doctor_filter
            ).select_related("patient", "doctor").order_by("-consultation_date")

            if not pending_consultations.exists():
                return save_and_return_ai_response("No pending consultations found.")

            response_text = "Pending consultations:\n\n"

            for consultation in pending_consultations:
                response_text += format_consultation(consultation) + "\n\n"

            return save_and_return_ai_response(response_text.strip())

        # -------- Approved appointments / approved consultations --------
        if "approved" in message_lower and ("consultation" in message_lower or "appointment" in message_lower):
            approved_consultations = Consultation.objects.filter(
                appointment_status="approved",
                **doctor_filter
            ).select_related("patient", "doctor").order_by("-consultation_date")

            if not approved_consultations.exists():
                return save_and_return_ai_response("No approved consultations found.")

            response_text = "Approved consultations:\n\n"

            for consultation in approved_consultations:
                response_text += format_consultation(consultation) + "\n\n"

            return save_and_return_ai_response(response_text.strip())

        # -------- Rejected appointments / rejected consultations --------
        if "rejected" in message_lower and ("consultation" in message_lower or "appointment" in message_lower):
            rejected_consultations = Consultation.objects.filter(
                appointment_status="rejected",
                **doctor_filter
            ).select_related("patient", "doctor").order_by("-consultation_date")

            if not rejected_consultations.exists():
                return save_and_return_ai_response("No rejected consultations found.")

            response_text = "Rejected consultations:\n\n"

            for consultation in rejected_consultations:
                response_text += (
                    format_consultation(consultation)
                    + f"\nRejection Reason: {getattr(consultation, 'rejection_reason', '') or 'No reason provided.'}"
                    + "\n\n"
                )

            return save_and_return_ai_response(response_text.strip())

        # -------- List patients consulted --------
        if (
            "patient" in message_lower
            and (
                "consulted" in message_lower
                or "consultation" in message_lower
                or "list" in message_lower
                or "patients" in message_lower
            )
        ):
            consulted_patient_ids = Consultation.objects.filter(
                **doctor_filter
            ).values_list("patient_id", flat=True).distinct()

            consulted_patients = Patient.objects.filter(
                id__in=consulted_patient_ids,
                is_deleted=False
            ).order_by("last_name", "first_name")

            if not consulted_patients.exists():
                return save_and_return_ai_response("No consulted patients found.")

            response_text = "Patients who consulted you:\n\n"

            for patient in consulted_patients:
                consultation_count = Consultation.objects.filter(
                    patient=patient,
                    **doctor_filter
                ).count()

                response_text += (
                    f"Patient ID: {patient.id}\n"
                    f"Name: {patient.first_name} {patient.last_name}\n"
                    f"Gender: {patient.gender}\n"
                    f"Date of Birth: {patient.dob}\n"
                    f"Phone: {patient.phone or 'None'}\n"
                    f"Address: {patient.address or 'None'}\n"
                    f"Total Consultations: {consultation_count}\n\n"
                )

            return save_and_return_ai_response(response_text.strip())

        # -------- Completed diagnoses --------
        if (
            "completed" in message_lower
            or "diagnosed" in message_lower
            or "diagnosis" in message_lower
        ) and "pending" not in message_lower:
            completed_consultations = Consultation.objects.filter(
                diagnosis__isnull=False,
                **doctor_filter
            ).exclude(
                diagnosis__exact=""
            ).select_related("patient", "doctor").order_by("-consultation_date")

            if not completed_consultations.exists():
                return save_and_return_ai_response("No completed diagnoses found.")

            response_text = "Completed diagnoses:\n\n"

            for consultation in completed_consultations:
                response_text += format_consultation(consultation) + "\n\n"

            return save_and_return_ai_response(response_text.strip())

        # ======================================================
        # OLLAMA FALLBACK FOR GENERAL QUESTIONS
        # ======================================================

        knowledge_context = ""

        knowledge = KnowledgeBase.objects.all()
        for item in knowledge:
            if item.text_content:
                knowledge_context += f"Title: {item.title}\n"
                knowledge_context += f"{item.text_content}\n\n"

        system_context = ""

        all_consultations = Consultation.objects.filter(
            **doctor_filter
        ).select_related("patient", "doctor").order_by("-consultation_date")

        system_context += "=== CONSULTATION RECORDS ===\n"

        if all_consultations.exists():
            for consultation in all_consultations:
                system_context += (
                    f"- Consultation ID: {consultation.id}\n"
                    f"  Patient: {consultation.patient.first_name} {consultation.patient.last_name}\n"
                    f"  Doctor: Dr. {consultation.doctor.first_name} {consultation.doctor.last_name}\n"
                    f"  Date: {consultation.consultation_date}\n"
                    f"  Symptoms: {consultation.symptoms or 'None'}\n"
                    f"  Notes: {consultation.notes or 'None'}\n"
                    f"  Appointment Status: {consultation_status_value(consultation)}\n"
                    f"  Rejection Reason: {getattr(consultation, 'rejection_reason', '') or 'None'}\n"
                    f"  Diagnosis: {consultation.diagnosis or 'Pending Diagnosis'}\n\n"
                )
        else:
            system_context += "No consultation records found.\n\n"

        treatments = Treatment.objects.filter(
            **doctor_filter
        ).select_related("patient", "doctor", "medical_record").order_by("-treatment_date")

        system_context += "=== TREATMENTS ===\n"

        if treatments.exists():
            for treatment in treatments:
                doctor_name = (
                    f"Dr. {treatment.doctor.first_name} {treatment.doctor.last_name}"
                    if treatment.doctor
                    else "No doctor assigned"
                )

                system_context += (
                    f"- Treatment ID: {treatment.id}\n"
                    f"  Patient: {treatment.patient.first_name} {treatment.patient.last_name}\n"
                    f"  Doctor: {doctor_name}\n"
                    f"  Treatment Name: {treatment.treatment_name}\n"
                    f"  Description: {treatment.description or 'None'}\n"
                    f"  Treatment Date: {treatment.treatment_date}\n\n"
                )
        else:
            system_context += "No treatments found.\n\n"

        prescriptions = Prescription.objects.filter(
            **doctor_filter
        ).select_related("patient", "doctor", "medical_record").order_by("-date_prescribed")

        system_context += "=== PRESCRIPTIONS ===\n"

        if prescriptions.exists():
            for prescription in prescriptions:
                doctor_name = (
                    f"Dr. {prescription.doctor.first_name} {prescription.doctor.last_name}"
                    if prescription.doctor
                    else "No doctor assigned"
                )

                system_context += (
                    f"- Prescription ID: {prescription.id}\n"
                    f"  Patient: {prescription.patient.first_name} {prescription.patient.last_name}\n"
                    f"  Doctor: {doctor_name}\n"
                    f"  Medication: {prescription.medication}\n"
                    f"  Dosage: {prescription.dosage or 'None'}\n"
                    f"  Frequency: {prescription.frequency or 'None'}\n"
                    f"  Duration: {prescription.duration or 'None'}\n"
                    f"  Date Prescribed: {prescription.date_prescribed}\n\n"
                )
        else:
            system_context += "No prescriptions found.\n\n"

        medical_records = MedicalRecord.objects.select_related("patient").filter(
            patient__is_deleted=False
        )

        system_context += "=== MEDICAL RECORDS ===\n"

        if medical_records.exists():
            for record in medical_records:
                system_context += (
                    f"- Medical Record ID: {record.id}\n"
                    f"  Patient: {record.patient.first_name} {record.patient.last_name}\n"
                    f"  Blood Type: {record.blood_type or 'None'}\n"
                    f"  Allergies: {record.allergies or 'None'}\n"
                    f"  Chronic Conditions: {record.chronic_conditions or 'None'}\n"
                    f"  Medical History: {record.medical_history or 'None'}\n"
                    f"  Emergency Contact Name: {record.emergency_contact_name or 'None'}\n"
                    f"  Emergency Contact Phone: {record.emergency_contact_phone or 'None'}\n"
                    f"  Last Updated: {record.updated_at}\n\n"
                )
        else:
            system_context += "No medical records found.\n\n"

        prompt = f"""
You are the AI assistant for the MedFlow hospital management system.

You are assisting a doctor.

Important:
- Answer only using the System Data and Knowledge Base below.
- Do not invent patient data.
- If the record is not found, say no matching record was found.
- Keep the answer short and direct.

Knowledge Base:
{knowledge_context}

System Data:
{system_context}

Doctor Question:
{user_message}

Answer:
"""

        ollama_url = os.environ.get(
            "OLLAMA_URL",
            "http://localhost:11434/api/generate"
        )

        ollama_model = os.environ.get(
            "OLLAMA_MODEL",
            "qwen2.5:0.5b"
        )

        try:
            response = requests.post(
                ollama_url,
                json={
                    "model": ollama_model,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=120
            )

            response.raise_for_status()
            data = response.json()

            ai_response = data.get(
                "response",
                "Sorry, I could not generate a response."
            )

        except requests.exceptions.RequestException as e:
            ai_response = f"Ollama error: {str(e)}"

        return save_and_return_ai_response(ai_response)

class KnowledgeBaseView(ListCreateAPIView):
    queryset = KnowledgeBase.objects.all()
    serializer_class = KnowledgeBaseSerializer