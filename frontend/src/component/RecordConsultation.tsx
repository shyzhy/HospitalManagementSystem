import React, { useState, useEffect } from 'react';
import { createConsultation, updateConsultation, getPatients, getDoctors } from '../api';
import { Patient, Doctor, Consultation } from '../types';

interface RecordConsultationProps {
    initialData?: Consultation | null;
    onSuccess: () => void;
}

const RecordConsultation: React.FC<RecordConsultationProps> = ({ initialData, onSuccess }) => {
    // 1. Get User Role and IDs from local storage
    const userRole = localStorage.getItem('role') || 'patient';
    const currentDoctorId = localStorage.getItem('doctorId');
    const currentPatientId = localStorage.getItem('patientId'); 

    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    
    const [formData, setFormData] = useState({
        patient: '',
        doctor: '', 
        consultation_date: new Date().toISOString().split('T')[0], 
        diagnosis: '',
        symptoms: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch BOTH lists so admins/patients can select doctors
        getPatients().then(setPatients).catch(console.error);
        getDoctors().then(setDoctors).catch(console.error);

        if (initialData) {
            setFormData({
                patient: initialData.patient ? String(initialData.patient) : '',
                doctor: initialData.doctor ? String(initialData.doctor) : '',
                consultation_date: initialData.consultation_date || new Date().toISOString().split('T')[0],
                diagnosis: initialData.diagnosis || '',
                symptoms: initialData.symptoms || ''
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 2. SMART ID ASSIGNMENT BASED ON ROLE
        let finalPatientId = Number(formData.patient);
        let finalDoctorId = Number(formData.doctor);

        if (userRole === 'doctor') {
            finalDoctorId = Number(currentDoctorId); // Doctor is locked to themselves
        } else if (userRole === 'patient') {
            finalPatientId = Number(currentPatientId); // Patient is locked to themselves
        }

        const payload = {
            patient: finalPatientId,
            doctor: finalDoctorId,
            consultation_date: formData.consultation_date,
            diagnosis: formData.diagnosis,
            symptoms: formData.symptoms
        };

        // Validation Checks
        if (!payload.doctor) {
            alert("Error: Missing Doctor. Please select a doctor or refresh your session.");
            setLoading(false);
            return;
        }
        if (!payload.patient) {
            alert("Error: Missing Patient. Please select a patient or refresh your session.");
            setLoading(false);
            return;
        }

        try {
            if (initialData?.id) {
                await updateConsultation(initialData.id, payload);
            } else {
                await createConsultation(payload);
            }
            onSuccess();
        } catch (err: any) {
            console.error("Save Error:", err.response?.data || err);
            alert("Failed to save record. Check if all fields are filled.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-8">
                {initialData ? 'Edit Consultation' : 'New Consultation Record'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* SHOW PATIENT SELECT (For Admins and Doctors) */}
                    {(userRole === 'admin' || userRole === 'doctor') && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Patient</label>
                            <select 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={formData.patient}
                                onChange={(e) => setFormData({...formData, patient: e.target.value})}
                                required
                            >
                                <option value="">Choose Patient...</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* SHOW DOCTOR SELECT (For Admins and Patients) */}
                    {(userRole === 'admin' || userRole === 'patient') && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Doctor</label>
                            <select 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={formData.doctor}
                                onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                                required
                            >
                                <option value="">Choose Doctor...</option>
                                {doctors.map(d => (
                                    <option key={d.id} value={d.id}>
                                        Dr. {d.first_name} {d.last_name}{d.specialization ? ` - ${d.specialization}` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* DATE FIELD */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Consultation Date</label>
                        <input 
                            type="date"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={formData.consultation_date}
                            onChange={(e) => setFormData({...formData, consultation_date: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Final Diagnosis</label>
                    <input 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                        value={formData.diagnosis}
                        onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                        placeholder={userRole === 'patient' ? "Doctor will fill this out..." : "Enter diagnosis results..."}
                        disabled={userRole === 'patient'} 
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Symptoms / Notes</label>
                    <textarea 
                        rows={4}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                        value={formData.symptoms}
                        onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                        placeholder="Describe patient symptoms..."
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all"
                >
                    {loading ? 'Processing...' : 'Save Consultation Record'}
                </button>
            </form>
        </div>
    );
};

export default RecordConsultation;