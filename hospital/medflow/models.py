from django.db import models
from django.contrib.auth.models import User

class Patient(models.Model):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female'), ('O', 'Other')]
    
    patient_id = models.CharField(max_length=20, unique=True, help_text="Hospital ID")
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    dob = models.DateField(verbose_name="Date of Birth")
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.patient_id})"

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, unique=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"Dr. {self.user.last_name} - {self.specialization}"

class Visit(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='visits')
    # This related_name='consultations' was the source of your error. 
    # It's okay to keep it as long as the Consultation model below uses something else.
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, related_name='consultations')
    visit_date = models.DateTimeField(auto_now_add=True)
    reason_for_visit = models.TextField()
    vitals = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"Visit: {self.patient.last_name} | {self.visit_date.strftime('%Y-%m-%d')}"

# YOUR NEW MODEL (RECORD CONSULTATION)
class Consultation(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='patient_records')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='doctor_records')
    consultation_date = models.DateField(auto_now_add=True)
    symptoms = models.TextField()
    diagnosis = models.TextField()
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Consultation for {self.patient.last_name} on {self.consultation_date}"

class MedicalRecord(models.Model):
    visit = models.OneToOneField(Visit, on_delete=models.CASCADE, related_name='medical_record')
    symptoms = models.TextField()
    diagnosis = models.TextField()
    treatment_plan = models.TextField()
    physician_notes = models.TextField(blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"MR for {self.visit.patient.last_name}"

class Prescription(models.Model):
    visit = models.ForeignKey(Visit, on_delete=models.CASCADE, related_name='prescriptions')
    medication_name = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100, help_text="e.g. Twice a day")
    duration = models.CharField(max_length=100, help_text="e.g. 7 days")
    instructions = models.TextField(blank=True)

    def __str__(self):
        return f"{self.medication_name} - {self.visit.patient.last_name}"

class Treatment(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Ongoing', 'Ongoing'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    visit = models.ForeignKey(Visit, on_delete=models.CASCADE, related_name='treatments')
    name = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    performed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.status})"