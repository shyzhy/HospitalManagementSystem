import React, { useState, useEffect } from 'react';
import { createConsultation, updateConsultation, getPatients } from '../api';
import { Patient, Consultation } from '../types';

interface RecordConsultationProps {
    initialData?: Consultation | null;
    onSuccess: () => void;
}

const RecordConsultation: React.FC<RecordConsultationProps> = ({ initialData, onSuccess }) => {
    const currentDoctorId = localStorage.getItem('doctorId');

    const [patients, setPatients] = useState<Patient[]>([]);
    const [formData, setFormData] = useState({
        patient: '',
        consultation_date: new Date().toISOString().split('T')[0], 
        diagnosis: '',
        symptoms: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getPatients().then(setPatients).catch(console.error);

        if (initialData) {
            setFormData({
                patient: String(initialData.patient),
                consultation_date: initialData.consultation_date || new Date().toISOString().split('T')[0],
                diagnosis: initialData.diagnosis || '',
                symptoms: initialData.symptoms || ''
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            patient: Number(formData.patient),
            doctor: Number(currentDoctorId),
            consultation_date: formData.consultation_date,
            diagnosis: formData.diagnosis,
            symptoms: formData.symptoms
        };

  
        if (!payload.doctor || payload.doctor === 0) {
            alert("Error: Missing Doctor ID. Please LOGOUT and LOGIN again to refresh your session.");
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
                    {/* PATIENT SELECT */}
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
                        placeholder="Enter diagnosis results..."
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