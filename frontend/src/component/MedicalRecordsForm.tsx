import React, { useState, useEffect } from 'react';
import { createMedicalRecord, updateMedicalRecord } from '../api';
import { Patient, MedicalRecord } from '../types';

interface MedicalRecordsFormProps {
    initialData?: MedicalRecord | null;
    patients: Patient[];
    onSuccess: () => void;
    onCancel: () => void;
}

const MedicalRecordsForm: React.FC<MedicalRecordsFormProps> = ({ 
    initialData, 
    patients, 
    onSuccess, 
    onCancel 
}) => {
    const [formData, setFormData] = useState({
        patient: '',
        blood_type: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        allergies: '',
        chronic_conditions: '',
        medical_history: '',
        attachment: null as File | null
    });
    const [loading, setLoading] = useState(false);

    // Sync form with initialData if editing an existing record
    useEffect(() => {
        if (initialData) {
            setFormData({
                patient: String(initialData.patient),
                blood_type: initialData.blood_type || '',
                emergency_contact_name: initialData.emergency_contact_name || '',
                emergency_contact_phone: initialData.emergency_contact_phone || '',
                allergies: initialData.allergies || '',
                chronic_conditions: initialData.chronic_conditions || '',
                medical_history: initialData.medical_history || '',
                attachment: null // Files cannot be pre-filled for security reasons
            });
        }
    }, [initialData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, attachment: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 1. Create FormData to support file uploads
        const data = new FormData();
        
        // 2. Append all text fields (Wrapped in String() to satisfy TypeScript)
        data.append('patient', String(formData.patient));
        data.append('blood_type', String(formData.blood_type));
        data.append('emergency_contact_name', String(formData.emergency_contact_name));
        data.append('emergency_contact_phone', String(formData.emergency_contact_phone));
        data.append('allergies', String(formData.allergies));
        data.append('chronic_conditions', String(formData.chronic_conditions));
        data.append('medical_history', String(formData.medical_history));

        // 3. Append the file only if one was selected
        if (formData.attachment instanceof File) {
            data.append('attachment', formData.attachment);
        }

        try {
            // 4. Update if ID exists, otherwise Create new
            if (initialData && initialData.id) {
                await updateMedicalRecord(initialData.id, data);
            } else {
                await createMedicalRecord(data);
            }
            onSuccess();
        } catch (err: any) {
            console.error("Save Error:", err.response?.data);
            // Show the "One patient = One record" validation error cleanly
            const errorMsg = err.response?.data?.patient?.[0] || "Failed to save medical record.";
            alert(`Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                    {initialData ? 'Update Medical Record' : 'Create Medical Record'}
                </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient</label>
                        <select 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            value={formData.patient} 
                            onChange={(e) => setFormData({...formData, patient: e.target.value})} 
                            required
                            disabled={!!initialData} // Lock patient selection if editing
                        >
                            <option value="">Select Patient</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Type</label>
                        <input 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            placeholder="e.g., O+, A-"
                            value={formData.blood_type} 
                            onChange={(e) => setFormData({...formData, blood_type: e.target.value})} 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Emergency Contact</label>
                        <input 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            placeholder="Contact Name"
                            value={formData.emergency_contact_name} 
                            onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})} 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Emergency Phone</label>
                        <input 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            placeholder="Contact Number"
                            value={formData.emergency_contact_phone} 
                            onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})} 
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Allergies</label>
                    <textarea 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-20 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="List any known allergies..."
                        value={formData.allergies} 
                        onChange={(e) => setFormData({...formData, allergies: e.target.value})} 
                    />
                </div>

                {/* ADDED: Chronic Conditions */}
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chronic Conditions</label>
                    <textarea 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-20 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="e.g., Asthma, Hypertension, Diabetes..."
                        value={formData.chronic_conditions} 
                        onChange={(e) => setFormData({...formData, chronic_conditions: e.target.value})} 
                    />
                </div>

                {/* ADDED: Medical History */}
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medical History</label>
                    <textarea 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-20 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="Past surgeries, major illnesses, family history..."
                        value={formData.medical_history} 
                        onChange={(e) => setFormData({...formData, medical_history: e.target.value})} 
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Attachment (Scanned Files)</label>
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer" 
                    />
                </div>

                <div className="pt-4 flex gap-4">
                    <button type="button" onClick={onCancel} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-xl uppercase tracking-widest hover:bg-slate-200 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-xl uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50">
                        {loading ? 'Processing...' : initialData ? 'Update Record' : 'Create Record'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MedicalRecordsForm;