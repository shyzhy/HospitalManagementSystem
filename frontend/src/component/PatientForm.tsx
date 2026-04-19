import React, { useState, useEffect } from 'react';
import { createPatient, updatePatient } from '../api';
import { Patient } from '../types';

interface PatientFormProps {
    patient?: Patient | null;
    onSubmit: () => void;
    onCancel: () => void;
    isInline?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onSubmit, onCancel, isInline }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        dob: '',
        gender: 'M', // FIXED: Default to 'M'
        phone: '',
        address: '',
        username: '',
        password: '' 
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (patient) {
            setFormData({
                first_name: patient.first_name || '',
                last_name: patient.last_name || '',
                dob: patient.dob || '',
                gender: patient.gender || 'M', // FIXED: Use single letter
                phone: patient.phone || '',
                address: patient.address || '',
                username: patient.username || patient.user_details?.username || '', 
                password: '' 
            });
        }
    }, [patient]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (patient?.id) {
                await updatePatient(patient.id, formData);
            } else {
                await createPatient(formData);
            }
            onSubmit();
        } catch (err: any) {
            console.error("Failed to save patient:", err);
            // Show exact error message to help debug
            alert(`Error saving patient record: ${JSON.stringify(err.response?.data || "Unknown Error")}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`w-full ${isInline ? 'bg-transparent' : 'bg-white rounded-2xl shadow-sm border border-slate-200'} overflow-hidden transition-all duration-300`}>
            {!isInline && (
                <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
                    <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="text-emerald-300 text-2xl">+</span> 
                        {patient ? 'Edit Patient Profile' : 'Register New Patient'}
                    </h3>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className={`${isInline ? 'p-2' : 'p-8'} space-y-8`}>
                {/* --- LOGIN CREDENTIALS SECTION --- */}
                <div className={`p-6 ${isInline ? 'bg-white border-2 border-slate-50 shadow-sm' : 'bg-slate-50 border border-slate-200'} rounded-3xl space-y-6 mb-6`}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-6 bg-[#556ee6] rounded-full"></div>
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Account Security & Access</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Secure Username</label>
                            <input name="username" value={formData.username} onChange={handleChange} required className="w-full p-4 bg-transparent border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#556ee6]/5 focus:border-[#556ee6] outline-none transition-all font-bold text-slate-700" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Password {patient && "(Keep blank to skip)"}</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required={!patient} className="w-full p-4 bg-transparent border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#556ee6]/5 focus:border-[#556ee6] outline-none transition-all font-bold text-slate-700" placeholder={patient ? "••••••••" : ""} />
                        </div>
                    </div>
                </div>

                {/* --- PERSONAL IDENTITY SECTION --- */}
                <div className={`p-8 ${isInline ? 'bg-white border-2 border-slate-50 shadow-sm' : 'bg-slate-50 border border-slate-200'} rounded-[2.5rem] space-y-6`}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Legal Identity Details</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Legal First Name</label>
                            <input name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full p-4 bg-transparent border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Legal Last Name</label>
                            <input name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full p-4 bg-transparent border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Birth Registry Date</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full p-4 bg-transparent border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Identity Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full p-4 bg-transparent border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 appearance-none">
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- CONTACT HUB SECTION --- */}
                <div className={`p-8 ${isInline ? 'bg-white border-2 border-slate-50 shadow-sm' : 'bg-slate-50 border border-slate-200'} rounded-[2.5rem] space-y-6`}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-6 bg-slate-400 rounded-full"></div>
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Verified Contact Information</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Primary Phone</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-4 bg-transparent border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-mono font-bold text-emerald-600" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Residential Address</label>
                            <input name="address" value={formData.address} onChange={handleChange} required className="w-full p-4 bg-transparent border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-8 font-sans">
                    {!isInline ? (
                        <button 
                            type="button" 
                            onClick={onCancel} 
                            className="px-6 py-3 bg-slate-50 text-slate-400 font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Directory
                        </button>
                    ) : (
                        <div></div>
                    )}
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="px-10 py-5 bg-emerald-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-200/50 hover:bg-emerald-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
                    >
                        {loading ? (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {patient ? 'Commit Changes' : 'Finalize Registration'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PatientForm;