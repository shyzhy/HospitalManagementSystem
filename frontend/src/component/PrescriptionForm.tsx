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
    // 1. Grab IDs from browser storage
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
            // 2. Pre-fill the doctor ID if logged in as a doctor
            setFormData(prev => ({
                ...prev,
                doctor: (userRole === 'doctor' && currentDoctorId) ? currentDoctorId : ''
            }));
        }
    }, [initialData, userRole, currentDoctorId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 3. Auto-Assign payload
        const payload = {
            patient: Number(formData.patient),
            doctor: userRole === 'doctor' ? Number(currentDoctorId) : Number(formData.doctor),
            medication: formData.medication,
            frequency: formData.frequency,
            dosage: formData.dosage,
            duration: formData.duration
        };

        // 4. Secure check to prevent 500 Server Errors
        if (!payload.patient || !payload.doctor || payload.doctor === 0) {
            alert(`Error: Missing Required ID. (Patient ID: ${payload.patient}, Doctor ID: ${payload.doctor}). Please LOGOUT and LOGIN again to refresh your session.`);
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
            alert("Failed to save prescription. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-purple-600 p-6 text-white flex justify-between items-center">
                    <h3 className="text-lg font-black uppercase tracking-widest">
                        {initialData ? 'Edit Prescription' : 'Add Prescription'}
                    </h3>
                    <button onClick={onCancel} className="text-white/70 hover:text-white text-2xl font-black">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Patient</label>
                        <select 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                            value={formData.patient} 
                            onChange={(e) => setFormData({...formData, patient: e.target.value})} 
                            required
                        >
                            <option value="">Select Patient...</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
                        </select>
                    </div>

                    {/* Only Admins see the Doctor Dropdown */}
                    {userRole === 'admin' && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Doctor</label>
                            <select 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                                value={formData.doctor} 
                                onChange={(e) => setFormData({...formData, doctor: e.target.value})} 
                                required
                            >
                                <option value="">Select Doctor...</option>
                                {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.user_details?.last_name || d.last_name}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medication Name</label>
                        <input 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                            value={formData.medication} 
                            onChange={(e) => setFormData({...formData, medication: e.target.value})} 
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Frequency</label>
                        <input 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                            value={formData.frequency} 
                            onChange={(e) => setFormData({...formData, frequency: e.target.value})} 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dosage</label>
                            <input 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                value={formData.dosage} 
                                onChange={(e) => setFormData({...formData, dosage: e.target.value})} 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration</label>
                            <input 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                value={formData.duration} 
                                onChange={(e) => setFormData({...formData, duration: e.target.value})} 
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="button" onClick={onCancel} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-black rounded-xl uppercase tracking-widest hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 py-4 bg-purple-600 text-white font-black rounded-xl uppercase tracking-widest shadow-lg shadow-purple-200 hover:bg-purple-700 active:scale-95 transition-all">
                            {loading ? 'Processing...' : 'Save Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrescriptionForm;