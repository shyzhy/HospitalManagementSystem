import React, { useState, useEffect } from 'react';
import { createPatient, updatePatient } from '../api';
import { Patient } from '../types';

interface PatientFormProps {
    patient?: Patient | null;
    onSubmit: () => void;
    onCancel: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onSubmit, onCancel }) => {
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
        <div className="bg-white w-full rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
                <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="text-emerald-300 text-2xl">+</span> 
                    {patient ? 'Edit Patient Profile' : 'Register New Patient'}
                </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* --- LOGIN CREDENTIALS SECTION --- */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 mb-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Login Details</h4>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
                            <input name="username" value={formData.username} onChange={handleChange} required className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password {patient && "(Keep blank to skip)"}</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required={!patient} className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                        <input name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                        <input name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold">
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="O">Other</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono font-bold" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
                        <input name="address" value={formData.address} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold" />
                    </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-100 font-sans">
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
                        className="px-10 py-3.5 bg-emerald-600 text-white font-bold rounded-lg text-[13px] uppercase tracking-widest shadow-[0_8px_20px_rgba(5,150,105,0.2)] hover:bg-emerald-700 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {patient ? 'Update Patient' : 'Register Patient'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PatientForm;