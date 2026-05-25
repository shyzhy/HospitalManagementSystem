from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='patient_profile')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    dob = models.DateField()
    gender = models.CharField(max_length=10)
    phone = models.CharField(max_length=20, blank=True, default='')
    address = models.TextField(blank=True, default='')
    profile_picture = models.ImageField(upload_to='patients/profiles/', null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def soft_delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        user = self.user
        if user:
            self.user = None
        self.save()
        if user:
            user.delete()
        
        # Delete all consultations, prescriptions, treatments, and notifications connected to the patient
        self.consultations.all().delete()
        self.prescriptions.all().delete()
        self.treatments.all().delete()
        self.notifications.all().delete()

        # Also delete the patient's medical record
        if hasattr(self, 'medical_record'):
            self.medical_record.delete()
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='doctor_profile')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, unique=True)
    profile_picture = models.ImageField(upload_to='doctors/profiles/', null=True, blank=True)
    is_available = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def soft_delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        user = self.user
        if user:
            self.user = None
        self.save()
        if user:
            user.delete()

    def __str__(self):
        return f"Dr. {self.first_name} {self.last_name} - {self.specialization}"

class MedicalRecord(models.Model):
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, related_name='medical_record')
    blood_type = models.CharField(max_length=5, blank=True)
    allergies = models.TextField(blank=True)
    chronic_conditions = models.TextField(blank=True)
    medical_history = models.TextField(blank=True)
    emergency_contact_name = models.CharField(max_length=200, blank=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True)
    attachment = models.FileField(upload_to='medical_records/', null=True, blank=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Medical Record - {self.patient}"


class Consultation(models.Model):
    STATUS_CHOICES = [ ('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected'),]
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='consultations')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='consultations')
    consultation_date = models.DateField(default=timezone.now)
    appointment_status = models.CharField(max_length=20,choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True)
    diagnosis = models.TextField(blank=True)
    symptoms = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Consultation: {self.patient} with Dr. {self.doctor.first_name} {self.doctor.last_name}"


class Treatment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='treatments')
    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name='treatments', null=True, blank=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='treatments_given', null=True, blank=True)
    treatment_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    treatment_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.treatment_name} - {self.patient}"

class Prescription(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='prescriptions')
    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name='prescriptions', null=True, blank=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='prescriptions_issued', null=True, blank=True)
    medication = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100, blank=True)
    frequency = models.CharField(max_length=100, blank=True)
    duration = models.CharField(max_length=100, blank=True)
    date_prescribed = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.medication} - {self.patient}"

class Notification(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=[
        ('consultation', 'Consultation'),
        ('prescription', 'Prescription'),
        ('general', 'General')
    ], default='general')
    related_id = models.IntegerField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.patient}: {self.title}"

class KnowledgeBase(models.Model):
    title = models.CharField(max_length=255)
    text_content = models.TextField(blank=True, null=True)
    pdf_file = models.FileField(upload_to='pdfs/', null=True, blank=True)
    website_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ChatMessage(models.Model):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('assistant', 'Assistant'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.get_role_display()}: {self.message[:50]}...'
