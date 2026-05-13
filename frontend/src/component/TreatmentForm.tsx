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
        <div className="bg-white w-full rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">
                        {initialData ? 'Edit Treatment Plan' : 'New Treatment Record'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Detail clinical procedures and treatment protocols</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm text-[#556ee6]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-7">
                {/* --- ASSIGNMENT --- */}
                <div className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-800 border-l-4 border-[#556ee6] pl-3">Clinical Assignment</h4>
                    <div className={`grid grid-cols-1 ${userRole === 'admin' ? 'md:grid-cols-2' : ''} gap-7`}>
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Assigned Patient</label>
                            <div className="relative group">
                                <select
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 appearance-none"
                                    value={formData.patient}
                                    onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                                    required
                                >
                                    <option value="">Select Target Patient...</option>
                                    {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
                                </select>
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#556ee6] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {userRole === 'admin' && (
                            <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                                <label className="text-sm font-semibold text-slate-600 ml-0.5">Attending Physician</label>
                                <div className="relative group">
                                    <select
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 appearance-none"
                                        value={formData.doctor}
                                        onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Physician...</option>
                                        {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.first_name} {d.last_name}</option>)}
                                    </select>
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#556ee6] transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- TREATMENT --- */}
                <div className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-800 border-l-4 border-[#556ee6] pl-3">Treatment Plan</h4>
                    <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                        <label className="text-sm font-semibold text-slate-600 ml-0.5">Procedure / Plan Designation</label>
                        <div className="relative group">
                            <input
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder:text-slate-400"
                                value={formData.treatment_name}
                                onChange={(e) => setFormData({ ...formData, treatment_name: e.target.value })}
                                placeholder="e.g. Intravenous Antibiotic Course - Protocol A"
                                required
                            />
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#556ee6] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                        <label className="text-sm font-semibold text-slate-600 ml-0.5">Clinical Protocol & Notes</label>
                        <textarea
                            rows={6}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder-slate-400 resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detail the clinical steps, required equipment, and specific procedural guidelines..."
                        />
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100 mt-6 font-sans">
                    <button
                        type="button"
                        onClick={() => onCancel?.()}
                        className="w-full sm:w-auto px-6 py-3 bg-slate-50 text-slate-400 font-bold rounded-lg text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Directory
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-8 py-3 bg-[#556ee6] text-white font-bold rounded-lg text-[13px] uppercase tracking-widest shadow-[0_4px_15px_rgba(85,110,230,0.3)] hover:bg-[#485ec4] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {initialData ? 'Update Plan' : 'Save Treatment'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TreatmentForm;