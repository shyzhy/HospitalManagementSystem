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
        email: '',
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
                email: patient.email || patient.user_details?.email || '', 
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
        <div className={`w-full ${isInline ? 'bg-transparent' : 'bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden'}`}>
            {!isInline && (
                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">
                            {patient ? 'Edit Patient Profile' : 'New Patient Record'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Manage patient identification and contact information</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm text-[#556ee6]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className={`${isInline ? 'p-2' : 'p-8'} space-y-7`}>
                {/* --- ACCOUNT ACCESS --- */}
                <div className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-800 border-l-4 border-[#556ee6] pl-3">Account Security & Access</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Secure Email Address</label>
                            <input 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                                type="email"
                                placeholder="Enter email address..."
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800" 
                            />
                        </div>
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Access Password {patient && "(Secure)"}</label>
                            <input 
                                type="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required={!patient} 
                                placeholder={patient ? "Leave blank to keep current..." : "Enter secure password..."}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800" 
                            />
                        </div>
                    </div>
                </div>

                {/* --- PERSONAL IDENTITY --- */}
                <div className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-800 border-l-4 border-[#556ee6] pl-3">Personal Identity</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Legal First Name</label>
                            <input 
                                name="first_name" 
                                value={formData.first_name} 
                                onChange={handleChange} 
                                required 
                                placeholder="Enter first name..."
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800" 
                            />
                        </div>
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Legal Last Name</label>
                            <input 
                                name="last_name" 
                                value={formData.last_name} 
                                onChange={handleChange} 
                                required 
                                placeholder="Enter last name..."
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800" 
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Date of Birth</label>
                            <input 
                                type="date" 
                                name="dob" 
                                value={formData.dob} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800" 
                            />
                        </div>
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Legal Gender</label>
                            <select 
                                name="gender" 
                                value={formData.gender} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 appearance-none"
                            >
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- CONTACT HUB --- */}
                <div className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-800 border-l-4 border-[#556ee6] pl-3">Verified Contact Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Primary Phone Number</label>
                            <input 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                required 
                                placeholder="Enter phone number..."
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800" 
                            />
                        </div>
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Residential Address</label>
                            <input 
                                name="address" 
                                value={formData.address} 
                                onChange={handleChange} 
                                required 
                                placeholder="Enter street address, city..."
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800" 
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100 mt-6 font-sans">
                    {!isInline ? (
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
                    ) : (
                        <div></div>
                    )}
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
                        {patient ? 'Update patient' : 'Save clinical record'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PatientForm;