import React, { useState, useEffect } from 'react';
import { createTreatment, updateTreatment } from '../api';
import { Patient, Doctor, Treatment } from '../types';

interface TreatmentFormProps {
    initialData?: Treatment | null;
    patients: Patient[];
    doctors: Doctor[];
    onSuccess: () => void;
    onCancel?: () => void; 
}

const TreatmentForm: React.FC<TreatmentFormProps> = ({ 
    initialData, 
    patients, 
    doctors, 
    onSuccess,
    onCancel
}) => {
    // 1. Get current IDs from browser storage
    const userRole = localStorage.getItem('role') || 'patient';
    const currentDoctorId = localStorage.getItem('doctorId');

    const [formData, setFormData] = useState({
        patient: '',
        doctor: '',
        treatment_name: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                patient: String(initialData.patient),
                doctor: String(initialData.doctor),
                treatment_name: initialData.treatment_name,
                description: initialData.description || '',
            });
        } else {
            // Pre-fill doctor ID if user is a doctor
            setFormData(prev => ({
                ...prev,
                doctor: (userRole === 'doctor' && currentDoctorId) ? currentDoctorId : ''
            }));
        }
    }, [initialData, userRole, currentDoctorId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 2. SECURE PAYLOAD: Force the correct Doctor ID based on role
            const payload = {
                patient: Number(formData.patient),
                doctor: userRole === 'doctor' ? Number(currentDoctorId) : Number(formData.doctor),
                treatment_name: formData.treatment_name,
                description: formData.description
            };

            if (!payload.patient || !payload.doctor || payload.doctor === 0) {
                alert(`Error: Missing Required ID. If you are a Doctor, please LOGOUT and LOGIN again to refresh your session.`);
                setLoading(false);
                return;
            }

            if (initialData?.id) {
                await updateTreatment(initialData.id, payload);
            } else {
                await createTreatment(payload);
            }
            onSuccess();
        } catch (err: any) {
            console.error("Save Error:", err.response?.data || err);
            alert(`Failed to save treatment record.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                    <span className="text-emerald-500 text-2xl">+</span> 
                    {initialData ? 'Edit Treatment Record' : 'New Treatment Record'}
                </h3>
                {onCancel && (
                    <button type="button" onClick={onCancel} className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600">
                        Back to List
                    </button>
                )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`grid grid-cols-1 ${userRole === 'admin' ? 'md:grid-cols-2' : ''} gap-6`}>
                    
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient Name</label>
                        <select 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={formData.patient} 
                            onChange={(e) => setFormData({...formData, patient: e.target.value})} 
                            required 
                        >
                            <option value="">Select Patient...</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
                        </select>
                    </div>
                    
                    {/* ONLY SHOW DOCTOR DROPDOWN IF LOGGED IN AS ADMIN */}
                    {userRole === 'admin' && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Attending Physician</label>
                            <select 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={formData.doctor} 
                                onChange={(e) => setFormData({...formData, doctor: e.target.value})} 
                                required 
                            >
                                <option value="">Select Doctor...</option>
                                {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.last_name}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medication / Treatment Plan</label>
                    <input 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 outline-none" 
                        value={formData.treatment_name} 
                        onChange={(e) => setFormData({...formData, treatment_name: e.target.value})} 
                        placeholder="e.g. Acute Bronchitis" 
                        required 
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description / Notes</label>
                    <textarea 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-32 focus:ring-2 focus:ring-emerald-500 outline-none" 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                        placeholder="Add specific instructions or notes..." 
                    />
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-600 text-white font-black rounded-xl uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all">
                        {loading ? 'Processing...' : 'Save Clinical Record'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TreatmentForm;