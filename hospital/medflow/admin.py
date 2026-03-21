from django.contrib import admin
from .models import Patient, Doctor, Consultation, Prescription, Treatment, MedicalRecord


# ----------------- PATIENT -----------------
@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'dob', 'gender', 'phone')


# ----------------- DOCTOR -----------------
@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'license_number', 'is_available')
    search_fields = ('user__first_name', 'user__last_name', 'license_number')
    list_filter = ('specialization', 'is_available')


# ----------------- CONSULTATION -----------------
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'consultation_date') 
    list_filter = ('consultation_date', 'doctor') 
    search_fields = ('patient__first_name', 'patient__last_name', 'diagnosis')


# ----------------- PRESCRIPTION -----------------
class PrescriptionInline(admin.TabularInline):
    model = Prescription
    extra = 0
    readonly_fields = ('date_prescribed',)
    show_change_link = True


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('medication', 'dosage', 'frequency', 'duration', 'patient', 'doctor')
    search_fields = ('medication', 'patient__first_name', 'patient__last_name')
    list_filter = ('date_prescribed',)


# ----------------- TREATMENT -----------------
class TreatmentInline(admin.TabularInline):
    model = Treatment
    extra = 0
    show_change_link = True


@admin.register(Treatment)
class TreatmentAdmin(admin.ModelAdmin):
    list_display = ('treatment_name', 'patient', 'doctor', 'treatment_date')
    search_fields = ('treatment_name', 'patient__first_name', 'patient__last_name')
    list_filter = ('treatment_date',)


# ----------------- MEDICAL RECORD -----------------
@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('patient', 'blood_type', 'created_at', 'updated_at')
    search_fields = ('patient__first_name', 'patient__last_name', 'patient__patient_id')
    list_filter = ('blood_type', 'created_at')
    readonly_fields = ('created_at', 'updated_at')

    # Show related Treatments & Prescriptions in the MedicalRecord page
    inlines = [TreatmentInline, PrescriptionInline]