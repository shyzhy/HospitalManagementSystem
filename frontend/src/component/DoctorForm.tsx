import React, { useState, useEffect } from 'react';
import { createDoctor, updateDoctor } from '../api';
import { Doctor } from '../types';

interface DoctorFormProps {
    doctor?: Doctor | null;
    onSubmit: (updatedDoctor: Doctor) => void;
    onCancel?: () => void;
    isInline?: boolean;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ doctor, onSubmit, onCancel, isInline }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        specialization: '',
        license_number: '',
        is_available: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (doctor) {
            setFormData({
                first_name: doctor.first_name || '',
                last_name: doctor.last_name || '',
                username: doctor.username || '',
                password: '',
                specialization: doctor.specialization || '',
                license_number: doctor.license_number || '',
                is_available: doctor.is_available
            });
        }
    }, [doctor]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (doctor?.id) {
                const res = await updateDoctor(doctor.id, formData);
                onSubmit(res);
            } else {
                const res = await createDoctor(formData);
                onSubmit(res);
            }
        } catch (err: any) {
            console.error("Failed to save doctor:", err);
            alert(`Error: ${JSON.stringify(err.response?.data || "Failed to save")}`);
        } finally {
            setLoading(false);
        }
    };

    const formContent = (
            <div className={`bg-white w-full ${isInline ? 'max-w-4xl shadow-sm border border-slate-200 my-2' : 'max-w-2xl shadow-xl overflow-hidden'} rounded-xl`}>
                <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">
                            {doctor ? 'Account Settings' : 'Register New Doctor'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Manage your internal credentials and status</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                        <span className={`w-2 h-2 rounded-full ${formData.is_available ? 'bg-emerald-500' : 'bg-slate-400'} ${formData.is_available ? 'animate-pulse' : ''}`}></span>
                        <span className={`text-[11px] font-bold tracking-wide uppercase ${formData.is_available ? 'text-emerald-700' : 'text-slate-500'}`}>
                            {formData.is_available ? 'Active' : 'Offline'}
                        </span>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-600 block">First Name</label>
                            <input name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-transparent border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder-slate-400" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-600 block">Last Name</label>
                            <input name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-transparent border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder-slate-400" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-600 block">Username</label>
                            <input name="username" value={formData.username} onChange={handleChange} required className="w-full px-4 py-2.5 bg-transparent border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder-slate-400" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-600 flex items-baseline justify-between block">
                                Password <span className="text-[10px] text-slate-400 font-normal">{doctor && "(Leave blank to keep current)"}</span>
                            </label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required={!doctor} className="w-full px-4 py-2.5 bg-transparent border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder-slate-400" placeholder={doctor ? "••••••••" : ""} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-600 block">Specialization</label>
                            <input name="specialization" value={formData.specialization} onChange={handleChange} required className="w-full px-4 py-2.5 bg-transparent border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder-slate-400" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-600 block">License Number</label>
                            <input name="license_number" value={formData.license_number} onChange={handleChange} required className="w-full px-4 py-2.5 bg-transparent border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <label className="text-sm font-semibold text-slate-600 block">Duty Status</label>
                        <div className="flex gap-3 max-w-sm">
                            <button type="button" onClick={() => setFormData({...formData, is_available: true})} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.is_available ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}>
                                Active
                            </button>
                            <button type="button" onClick={() => setFormData({...formData, is_available: false})} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!formData.is_available ? 'bg-amber-50 text-amber-600 border border-amber-200 shadow-sm' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}>
                                Away
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-6 !mt-8">
                        <button 
                            type="button" 
                            onClick={onCancel} 
                            className="px-6 py-3 bg-slate-50 text-slate-400 font-bold rounded-lg text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Directory
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="px-8 py-3.5 bg-[#556ee6] text-white font-bold rounded-lg text-[13px] uppercase tracking-widest shadow-[0_4px_15px_rgba(85,110,230,0.3)] hover:bg-[#485ec4] hover:-translate-y-0.5 active:scale-95 transition-all"
                        >
                            {loading ? 'Processing...' : doctor ? 'Save Changes' : 'Create Record'}
                        </button>
                    </div>
                </form>
            </div>
    );

    if (isInline) return formContent;
    
    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {formContent}
        </div>
    );
};

export default DoctorForm;