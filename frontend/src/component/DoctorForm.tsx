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
        email: '',
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
                email: doctor.email || '',
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
            <div className={`w-full ${isInline ? 'bg-transparent' : 'bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden'}`}>
                <div className={`${isInline ? 'p-0' : ''}`}>
                    {/* --- HEADER --- */}
                    {!isInline && (
                        <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    {doctor ? 'Edit Physician Profile' : 'New Physician Record'}
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">Record clinical credentials and internal registry data</p>
                            </div>
                            <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm text-[#556ee6]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={`${isInline ? 'p-0' : 'p-8'} space-y-7`}>
                        {/* --- CLINICAL IDENTITY --- */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold text-slate-800 border-l-4 border-[#556ee6] pl-3">Clinical Identity</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                                <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                                    <label className="text-sm font-semibold text-slate-600 ml-0.5">Legal First Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#556ee6] transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input 
                                            name="first_name" 
                                            value={formData.first_name} 
                                            onChange={handleChange} 
                                            required 
                                            placeholder="Enter first name..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder:text-slate-400" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                                    <label className="text-sm font-semibold text-slate-600 ml-0.5">Legal Last Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#556ee6] transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input 
                                            name="last_name" 
                                            value={formData.last_name} 
                                            onChange={handleChange} 
                                            required 
                                            placeholder="Enter last name..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder:text-slate-400" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- PROFESSIONAL CREDENTIALS --- */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold text-slate-800 border-l-4 border-[#556ee6] pl-3">Clinical Credentials</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                                <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                                    <label className="text-sm font-semibold text-slate-600 ml-0.5">Assigned Specialization</label>
                                    <div className="relative group">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#556ee6] transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.727 2.182a2 2 0 00.355 2.183l1.812 1.812a2 2 0 002.828 0l2.182-2.182a2 2 0 000-2.828l-1.081-1.081z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9A4 4 0 1012 1a4 4 0 000 8z" />
                                            </svg>
                                        </div>
                                        <input 
                                            name="specialization" 
                                            value={formData.specialization} 
                                            onChange={handleChange} 
                                            required 
                                            placeholder="Choose specialization..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder:text-slate-400" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                                    <label className="text-sm font-semibold text-slate-600 ml-0.5">Medical License Number</label>
                                    <div className="relative group">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#556ee6] transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <input 
                                            name="license_number" 
                                            value={formData.license_number} 
                                            onChange={handleChange} 
                                            required 
                                            placeholder="Enter license number..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder:text-slate-400 font-mono" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600 ml-0.5">Internal Duty Status</label>
                                <div className="flex gap-3 max-w-xs">
                                    <button 
                                        type="button" 
                                        onClick={() => setFormData({...formData, is_available: true})} 
                                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border ${formData.is_available ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'}`}
                                    >
                                        On Duty
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setFormData({...formData, is_available: false})} 
                                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border ${!formData.is_available ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'}`}
                                    >
                                        Away
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* --- SYSTEM ACCESS --- */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold text-slate-800 border-l-4 border-[#556ee6] pl-3">System Access</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                                <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                                    <label className="text-sm font-semibold text-slate-600 ml-0.5">Clinical Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#556ee6] transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            required 
                                            type="email"
                                            placeholder="Enter email address..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder:text-slate-400" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                                    <label className="text-sm font-semibold text-slate-600 ml-0.5">Secure Password {doctor && "(Secure)"}</label>
                                    <div className="relative group">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#556ee6] transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input 
                                            type="password" 
                                            name="password" 
                                            value={formData.password} 
                                            onChange={handleChange} 
                                            required={!doctor} 
                                            placeholder={doctor ? "Leave blank to keep current..." : "Enter secure password..."}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder:text-slate-400" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100 mt-6 font-sans">
                            <button 
                                type="button" 
                                onClick={onCancel} 
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
                                {doctor ? 'Update physician' : 'Save clinical record'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    );

    if (isInline) return <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">{formContent}</div>;
    
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-300 overflow-y-auto">
            <div className="max-w-4xl w-full my-auto animate-in zoom-in-95 duration-500">
                {formContent}
            </div>
        </div>
    );
};

export default DoctorForm;