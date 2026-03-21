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
                username: patient.user_details?.username || '', 
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8">
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
                                <input name="username" value={formData.username} onChange={handleChange} required className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password {patient && "(Leave blank to keep current)"}</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required={!patient} className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                            <input name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                            <input name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                                {/* FIXED: Now sending M, F, or O to match Django */}
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
                            <input name="address" value={formData.address} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button type="button" onClick={onCancel} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-black rounded-xl uppercase tracking-widest hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-xl uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-200 active:scale-95 transition-all">
                            {loading ? 'Processing...' : patient ? 'Update Patient' : 'Register Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientForm;