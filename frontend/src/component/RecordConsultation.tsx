import React, { useState, useEffect } from 'react';
import { createConsultation, updateConsultation, getPatients, getDoctors } from '../api';
import { Patient, Doctor, Consultation } from '../types';

interface RecordConsultationProps {
    initialData?: Consultation | null;
    onSuccess: () => void;
    onCancel?: () => void;
}

const RecordConsultation: React.FC<RecordConsultationProps> = ({ initialData, onSuccess, onCancel }) => {
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
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">
                        {initialData ? 'Edit Consultation' : 'New Consultation Record'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Record clinical findings and patient diagnosis</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm text-[#556ee6]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    
                    {/* SHOW PATIENT SELECT (For Admins and Doctors) */}
                    {(userRole === 'admin' || userRole === 'doctor') && (
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Patient Assignment</label>
                            <div className="relative group">
                                <select 
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 appearance-none"
                                    value={formData.patient}
                                    onChange={(e) => setFormData({...formData, patient: e.target.value})}
                                    required
                                >
                                    <option value="">Choose Patient...</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                                    ))}
                                </select>
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#556ee6] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SHOW DOCTOR SELECT (For Admins and Patients) */}
                    {(userRole === 'admin' || userRole === 'patient') && (
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Medical Professional</label>
                            <div className="relative group">
                                <select 
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 appearance-none"
                                    value={formData.doctor}
                                    onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                                    required
                                >
                                    <option value="">Choose Physician...</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id}>
                                            Dr. {d.first_name} {d.last_name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#556ee6] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DATE FIELD */}
                    <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                        <label className="text-sm font-semibold text-slate-600 ml-0.5">Consultation Date</label>
                        <div className="relative group">
                            <input 
                                type="date"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 uppercase tracking-tight"
                                value={formData.consultation_date}
                                onChange={(e) => setFormData({...formData, consultation_date: e.target.value})}
                                required
                            />
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#556ee6] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                    <label className="text-sm font-semibold text-slate-600 ml-0.5">Final Diagnosis</label>
                    <textarea 
                        rows={2}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder-slate-400 resize-none"
                        value={formData.diagnosis}
                        onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                        placeholder={userRole === 'patient' ? "Awaiting physician's clinical input..." : "Summarize the primary clinical finding..."}
                        disabled={userRole === 'patient'} 
                    />
                </div>

                <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                    <label className="text-sm font-semibold text-slate-600 ml-0.5">Clinical Symptoms & Notes</label>
                    <textarea 
                        rows={5}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder-slate-400 resize-none"
                        value={formData.symptoms}
                        onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                        placeholder="Detail the patient presentation and specific complaints..."
                    />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-6 font-sans">
                    <button 
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 bg-slate-50 text-slate-400 font-bold rounded-lg text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Directory
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="px-8 py-3 bg-[#556ee6] text-white font-bold rounded-lg text-[13px] uppercase tracking-widest shadow-[0_4px_15px_rgba(85,110,230,0.3)] hover:bg-[#485ec4] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {initialData ? 'Update Consultation' : 'Save Consultation Record'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RecordConsultation;