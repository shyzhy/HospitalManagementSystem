from django.contrib import admin
# Cleaned up imports: removed MedicalRecord and Treatment
from .models import Patient, Doctor, Visit, Consultation, Prescription

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('patient_id', 'first_name', 'last_name')

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'license_number')

@admin.register(Visit)
class VisitAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'visit_date')

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'consultation_date')

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    # medication_name must be here to match your updated model
    list_display = ('medication_name', 'dosage', 'duration', 'visit')