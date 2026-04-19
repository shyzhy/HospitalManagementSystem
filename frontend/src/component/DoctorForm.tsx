import React, { useState, useEffect } from 'react';
import { createDoctor, updateDoctor } from '../api';
import { Doctor } from '../types';

interface DoctorFormProps {
    doctor?: Doctor | null;
    onSubmit: () => void;
    onCancel: () => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ doctor, onSubmit, onCancel }) => {
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
                await updateDoctor(doctor.id, formData);
            } else {
                await createDoctor(formData);
            }
            onSubmit();
        } catch (err: any) {
            console.error("Failed to save doctor:", err);
            alert(`Error: ${JSON.stringify(err.response?.data || "Failed to save")}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                    <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="text-blue-300 text-2xl">+</span> 
                        {doctor ? 'Edit Doctor Profile' : 'Register New Doctor'}
                    </h3>
                    <span className="px-3 py-1 bg-blue-500 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {formData.is_available ? 'Online' : 'Offline'}
                    </span>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                            <input name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                            <input name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                            <input name="username" value={formData.username} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password {doctor && "(Leave blank to keep current)"}</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required={!doctor} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specialization</label>
                            <input name="specialization" value={formData.specialization} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">License Number</label>
                            <input name="license_number" value={formData.license_number} onChange={handleChange} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duty Status</label>
                        <div className="flex gap-4">
                            <button type="button" onClick={() => setFormData({...formData, is_available: true})} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${formData.is_available ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-500' : 'bg-slate-50 text-slate-400 border-2 border-transparent'}`}>
                                • Active
                            </button>
                            <button type="button" onClick={() => setFormData({...formData, is_available: false})} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${!formData.is_available ? 'bg-slate-100 text-slate-600 border-2 border-slate-400' : 'bg-slate-50 text-slate-400 border-2 border-transparent'}`}>
                                ⊘ Away
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button type="button" onClick={onCancel} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-black rounded-xl uppercase tracking-widest hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 py-4 bg-blue-600 text-white font-black rounded-xl uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all">
                            {loading ? 'Processing...' : doctor ? 'Update Record' : 'Save Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorForm;