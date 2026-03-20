import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DoctorFormProps {
    doctor: any | null; 
    onSubmit: () => void;
    onCancel: () => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ doctor, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        specialization: '',
        license_number: '',
        password: '',
        is_available: true
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (doctor) {
            setFormData({
                username: doctor.user_details?.username || '',
                first_name: doctor.user_details?.first_name || '',
                last_name: doctor.user_details?.last_name || '',
                specialization: doctor.specialization || '',
                license_number: doctor.license_number || '',
                password: '', // Keep blank during edit
                is_available: doctor.is_available ?? true
            });
        }
    }, [doctor]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Prepare payload: Remove password if it's empty during an update
            const payload: any = { ...formData };
            if (doctor && !formData.password) {
                delete payload.password;
            }

            if (doctor?.id) {
                await axios.put(`http://127.0.0.1:8000/api/v1/doctors/${doctor.id}/`, payload);
            } else {
                await axios.post('http://127.0.0.1:8000/api/v1/doctors/', payload);
            }
            onSubmit();
        } catch (err: any) {
            console.error(err.response?.data);
            alert("Error: " + JSON.stringify(err.response?.data));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
                <div className="bg-blue-600 p-6 flex justify-between items-center">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">
                        {doctor ? '📝 Edit Doctor Profile' : '➕ Register New Doctor'}
                    </h2>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${formData.is_available ? 'bg-emerald-400 text-white' : 'bg-red-400 text-white'}`}>
                        {formData.is_available ? 'Online' : 'Offline'}
                    </span>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">First Name</label>
                            <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Last Name</label>
                            <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Username</label>
                            <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">{doctor ? 'New Password (Optional)' : 'Password'}</label>
                            <input type="password" placeholder={doctor ? "Leave blank to keep current" : "Minimum 8 chars"} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required={!doctor} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Specialization</label>
                            <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">License Number</label>
                            <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.license_number} onChange={(e) => setFormData({...formData, license_number: e.target.value})} required />
                        </div>
                    </div>

                    {/* STATUS SELECTOR (REPLACES CHECKBOX) */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Duty Status</label>
                        <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                            <button 
                                type="button" 
                                onClick={() => setFormData({...formData, is_available: true})}
                                className={`py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${formData.is_available ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                ● Active
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setFormData({...formData, is_available: false})}
                                className={`py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${!formData.is_available ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                ○ Away
                            </button>
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button type="button" onClick={onCancel} className="flex-1 py-4 border border-slate-200 text-slate-500 font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                            {loading ? 'Processing...' : doctor ? 'Update Profile' : 'Register Doctor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorForm;