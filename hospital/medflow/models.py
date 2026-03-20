from django.db import models
from django.contrib.auth.models import User

class Patient(models.Model):
    patient_id = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    dob = models.DateField()
    gender = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')])
    phone = models.CharField(max_length=15)
    address = models.TextField()

    def name(self):
        return f"{self.first_name} {self.last_name}"

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, unique=True)
    
    # YOU MUST HAVE THIS LINE:
    is_available = models.BooleanField(default=True) 

    def __str__(self):
        return f"Dr. {self.user.last_name} - {self.specialization}"
class Visit(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='visits')
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True)
    visit_date = models.DateTimeField(auto_now_add=True)
    reason_for_visit = models.TextField()

class Consultation(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    consultation_date = models.DateField(auto_now_add=True)
    diagnosis = models.TextField()
    symptoms = models.CharField(max_length=1000, default='')

class Prescription(models.Model):
    # Adding null=True, blank=True avoids the "provide a default" prompt
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='prescriptions', null=True, blank=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='prescriptions_issued', null=True, blank=True)
    
    # Adding default='' or null=True for text fields
    medication = models.CharField(max_length=200, default='') 
    dosage = models.CharField(max_length=100, default='')
    frequency = models.CharField(max_length=100, default='')
    duration = models.CharField(max_length=100, default='')
    
    date_prescribed = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.medication} - {self.patient.name if self.patient else 'No Patient'}"

class Treatment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='treatments', null=True, blank=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='treatments_given', null=True, blank=True)
    
    treatment_name = models.CharField(max_length=200, default='')
    description = models.TextField(default='') 
    treatment_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.treatment_name}"