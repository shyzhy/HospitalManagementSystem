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
            <div className={`w-full ${isInline ? 'bg-transparent' : 'bg-white rounded-2xl shadow-xl overflow-hidden'}`}>
                {!isInline && (
                    <div className="bg-[#4e5ec4] p-8 text-white flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                                <span className="p-2 bg-white/20 rounded-xl backdrop-blur-md italic text-sm">MD</span>
                                Physician Enrollment
                            </h3>
                            <p className="text-xs text-white/70 mt-1 font-medium italic">Establishing internal clinical credentials.</p>
                        </div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className={`${isInline ? 'p-0' : 'p-8'} space-y-8`}>
                    {/* --- CLINICAL IDENTITY SECTION --- */}
                    <div className={`p-8 ${isInline ? 'bg-slate-50 border border-slate-100' : 'bg-slate-50 border border-slate-200'} rounded-[2.5rem] space-y-8`}>
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-1.5 h-6 bg-[#4e5ec4] rounded-full"></div>
                             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Clinical Identity</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Legal First Name</label>
                                <input name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full p-4 bg-transparent border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#4e5ec4]/5 focus:border-[#4e5ec4] outline-none transition-all font-bold text-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Legal Last Name</label>
                                <input name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full p-4 bg-transparent border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#4e5ec4]/5 focus:border-[#4e5ec4] outline-none transition-all font-bold text-slate-700" />
                            </div>
                        </div>
                    </div>

                    {/* --- PROFESSIONAL CREDENTIALS SECTION --- */}
                    <div className={`p-8 ${isInline ? 'bg-slate-50 border border-slate-100' : 'bg-slate-50 border border-slate-200'} rounded-[2.5rem] space-y-8`}>
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Clinical Credentials</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Assigned Specialization</label>
                                <input name="specialization" value={formData.specialization} onChange={handleChange} required className="w-full p-4 bg-transparent border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Medical License Number</label>
                                <input name="license_number" value={formData.license_number} onChange={handleChange} required className="w-full p-4 bg-transparent border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 font-mono" />
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Internal Duty Status</label>
                            <div className="flex gap-4 max-w-sm">
                                <button type="button" onClick={() => setFormData({...formData, is_available: true})} className={`flex-1 py-4 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all ${formData.is_available ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                    On Duty
                                </button>
                                <button type="button" onClick={() => setFormData({...formData, is_available: false})} className={`flex-1 py-4 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all ${!formData.is_available ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                    Away
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- SYSTEM ACCESS SECTION --- */}
                    <div className={`p-8 bg-slate-900 rounded-[2.5rem] space-y-8 text-white shadow-xl shadow-slate-900/10`}>
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-1.5 h-6 bg-blue-400 rounded-full"></div>
                             <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Verified System Access</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Secure Username</label>
                                <input name="username" value={formData.username} onChange={handleChange} required className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:ring-4 focus:ring-blue-400/5 focus:border-blue-400 outline-none transition-all font-bold text-white shadow-inner" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Password {doctor && "(Leave blank to keep current)"}</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required={!doctor} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:ring-4 focus:ring-blue-400/5 focus:border-blue-400 outline-none transition-all font-bold text-white shadow-inner" placeholder={doctor ? "••••••••" : ""} />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-8 pb-8 font-sans">
                        <button 
                            type="button" 
                            onClick={onCancel} 
                            className="px-8 py-4 bg-slate-100 text-slate-400 font-bold rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Cancel Modification
                        </button>
                        
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className={`px-10 py-5 bg-[#4e5ec4] text-white font-black rounded-[2rem] text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-[#4e5ec4]/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3`}
                        >
                            {loading ? (
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {doctor ? 'Commit Physician Updates' : 'Confirm Clinical Record'}
                        </button>
                    </div>
                </form>
            </div>
    );

    if (isInline) return <div className="p-8">{formContent}</div>;
    
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="max-w-2xl w-full animate-in zoom-in-95 duration-500">
                {formContent}
            </div>
        </div>
    );
};

export default DoctorForm;