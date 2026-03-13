from django.contrib import admin
from .models import Patient, Doctor, Visit, MedicalRecord, Prescription, Treatment

admin.site.register(Patient)
admin.site.register(Doctor)
admin.site.register(Visit)
admin.site.register(MedicalRecord)
admin.site.register(Prescription)
admin.site.register(Treatment)