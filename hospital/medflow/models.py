from django.db import models
from django.contrib.auth.models import User


class Patient(models.Model):
    patient_id = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    dob = models.DateField()
    gender = models.CharField(
        max_length=1,
        choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')]
    )
    phone = models.CharField(max_length=15)
    address = models.TextField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Doctor(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='doctor_profile'
    )
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, unique=True)

    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"Dr. {self.user.last_name} - {self.specialization}"


class MedicalRecord(models.Model):
    patient = models.OneToOneField(
        Patient,
        on_delete=models.CASCADE,
        related_name='medical_record'
    )

    blood_type = models.CharField(max_length=5, blank=True)
    allergies = models.TextField(blank=True)
    chronic_conditions = models.TextField(blank=True)
    medical_history = models.TextField(blank=True)

    emergency_contact_name = models.CharField(max_length=200, blank=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True)

    attachment = models.FileField(
        upload_to='medical_records/',
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Medical Record - {self.patient}"


class Visit(models.Model):
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name='visits'
    )
    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.SET_NULL,
        null=True
    )
    visit_date = models.DateTimeField(auto_now_add=True)
    reason_for_visit = models.TextField()

    def __str__(self):
        return f"Visit - {self.patient} ({self.visit_date})"


class Consultation(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)

    consultation_date = models.DateField(auto_now_add=True)
    diagnosis = models.TextField()
    symptoms = models.TextField(blank=True)

    def __str__(self):
        return f"Consultation - {self.patient}"


# 🔥 KEY CHANGE: link to MedicalRecord
class Treatment(models.Model):
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name='treatments'
    )
    medical_record = models.ForeignKey(
        MedicalRecord,
        on_delete=models.CASCADE,
        related_name='treatments',
        null=True,
        blank=True
    )
    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name='treatments_given',
        null=True,
        blank=True
    )

    treatment_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    treatment_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.treatment_name} - {self.patient}"


# 🔥 KEY CHANGE: link to MedicalRecord
class Prescription(models.Model):
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name='prescriptions'
    )
    medical_record = models.ForeignKey(
        MedicalRecord,
        on_delete=models.CASCADE,
        related_name='prescriptions',
        null=True,
        blank=True
    )
    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name='prescriptions_issued',
        null=True,
        blank=True
    )

    medication = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100, blank=True)
    frequency = models.CharField(max_length=100, blank=True)
    duration = models.CharField(max_length=100, blank=True)

    date_prescribed = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.medication} - {self.patient}"