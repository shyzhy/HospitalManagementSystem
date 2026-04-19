import React, { useState, useEffect } from 'react';
import { createPrescription, updatePrescription } from '../api';
import { Patient, Doctor, Prescription } from '../types';

interface PrescriptionFormProps {
    initialData?: Prescription | null;
    patients: Patient[];
    doctors: Doctor[];
    onSuccess: () => void;
    onCancel: () => void;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
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
        medication: '',
        frequency: '',
        dosage: '',
        duration: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                patient: String(initialData.patient),
                doctor: String(initialData.doctor),
                medication: initialData.medication || '',
                frequency: initialData.frequency || '',
                dosage: initialData.dosage || '',
                duration: initialData.duration || ''
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

        const payload = {
            patient: Number(formData.patient),
            doctor: userRole === 'doctor' ? Number(currentDoctorId) : Number(formData.doctor),
            medication: formData.medication,
            frequency: formData.frequency,
            dosage: formData.dosage,
            duration: formData.duration
        };

        if (!payload.patient || !payload.doctor || payload.doctor === 0) {
            alert(`Error: Missing Required ID. Please LOGOUT and LOGIN again to refresh your session.`);
            setLoading(false);
            return;
        }

        try {
            if (initialData?.id) {
                await updatePrescription(initialData.id, payload);
            } else {
                await createPrescription(payload);
            }
            onSuccess();
        } catch (err: any) {
            console.error("Save Error:", err.response?.data || err);
            alert("Failed to save prescription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white w-full rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="bg-[#556ee6] p-6 text-white flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md border border-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-widest leading-none">
                            {initialData ? 'Update Medication Order' : 'Issue New Prescription'}
                        </h3>
                        <p className="text-[10px] text-blue-100 font-bold mt-1 uppercase tracking-[0.1em] opacity-80 italic">medflow clinical pharmacy</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* --- ASSIGNMENT SECTION --- */}
                <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-100 space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-4 h-px bg-slate-200"></span>
                        Recipient & Provider
                    </h4>
                    <div className={`grid grid-cols-1 ${userRole === 'admin' ? 'md:grid-cols-2' : ''} gap-6`}>
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned Patient</label>
                            <div className="relative group">
                                <select
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:ring-4 focus:ring-[#556ee6]/10 focus:border-[#556ee6] outline-none transition-all text-slate-800 font-bold appearance-none"
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
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Prescribing Doctor</label>
                                <div className="relative group">
                                    <select
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:ring-4 focus:ring-[#556ee6]/10 focus:border-[#556ee6] outline-none transition-all text-slate-800 font-bold appearance-none"
                                        value={formData.doctor}
                                        onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Physician...</option>
                                        {doctors.map(d => <option key={d.id} value={d.id}> {d.first_name} {d.last_name}</option>)}
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

                {/* --- MEDICATION SECTION --- */}
                <div className="space-y-6">
                    <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medication Name & Concentration</label>
                        <div className="relative group">
                            <input
                                className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:ring-4 focus:ring-[#556ee6]/10 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder-slate-400 font-black tracking-tight"
                                value={formData.medication}
                                onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                                placeholder="e.g. Lisinopril 20mg / Hydrochlorothiazide 12.5mg"
                                required
                            />
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#556ee6] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dosage</label>
                            <input
                                className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:ring-4 focus:ring-[#556ee6]/10 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder-slate-400 font-bold"
                                value={formData.dosage}
                                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                placeholder="e.g. 1 Tablet"
                            />
                        </div>
                        <div className="space-y-1.5 focus-within:text-emerald-600 transition-colors">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Frequency</label>
                            <input
                                className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 outline-none transition-all text-slate-800 placeholder-slate-400 font-bold"
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                placeholder="e.g. BID (Twice Daily)"
                            />
                        </div>
                        <div className="space-y-1.5 focus-within:text-orange-500 transition-colors">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration</label>
                            <input
                                className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-slate-800 placeholder-slate-400 font-bold"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="e.g. 30 Days"
                            />
                        </div>
                    </div>
                </div>

                {/* --- FOOTER --- */}
                <div className="pt-8 flex justify-between items-center border-t border-slate-100 mt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3.5 bg-slate-50 text-slate-400 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Clinical Directory
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-12 py-4 bg-[#556ee6] text-white font-black rounded-xl text-[12px] uppercase tracking-widest shadow-[0_8px_20px_rgba(85,110,230,0.25)] hover:bg-[#485ec4] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        )}
                        {initialData ? 'Update Order' : 'Authorize & Issue'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PrescriptionForm;