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
    // 1. Auth & Local State
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
                attachment: null
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

        const data = new FormData();
        data.append('patient', String(formData.patient));
        data.append('blood_type', String(formData.blood_type));
        data.append('emergency_contact_name', String(formData.emergency_contact_name));
        data.append('emergency_contact_phone', String(formData.emergency_contact_phone));
        data.append('allergies', String(formData.allergies));
        data.append('chronic_conditions', String(formData.chronic_conditions));
        data.append('medical_history', String(formData.medical_history));

        if (formData.attachment instanceof File) {
            data.append('attachment', formData.attachment);
        }

        try {
            if (initialData && initialData.id) {
                await updateMedicalRecord(initialData.id, data);
            } else {
                await createMedicalRecord(data);
            }
            onSuccess();
        } catch (err: any) {
            const errorMsg = err.response?.data?.patient?.[0] || "Failed to save medical record.";
            alert(`Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
            {/* Header */}
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">
                        {initialData ? 'Edit Medical Record' : 'New Medical History'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Manage critical patient health data and history</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm text-[#556ee6]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-7">
                {/* --- IDENTITY --- */}
                <div className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-800 border-l-4 border-[#556ee6] pl-3">Patient Identification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                        <div className="md:col-span-2 space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Assigned Patient</label>
                            <div className="relative group">
                                <select 
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 appearance-none"
                                    value={formData.patient} 
                                    onChange={(e) => setFormData({...formData, patient: e.target.value})} 
                                    required
                                    disabled={!!initialData}
                                >
                                    <option value="">Select Target Patient...</option>
                                    {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
                                </select>
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#556ee6] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Blood Group</label>
                            <select 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 appearance-none font-bold"
                                value={formData.blood_type} 
                                onChange={(e) => setFormData({...formData, blood_type: e.target.value})} 
                            >
                                <option value="">Unknown</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- EMERGENCY --- */}
                <div className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-800 border-l-4 border-[#556ee6] pl-3">Emergency Contacts</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Contact Full Name</label>
                            <input 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800"
                                placeholder="Enter contact name..."
                                value={formData.emergency_contact_name} 
                                onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})} 
                            />
                        </div>
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Emergency Phone</label>
                            <input 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800"
                                placeholder="Enter emergency phone..."
                                value={formData.emergency_contact_phone} 
                                onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})} 
                            />
                        </div>
                    </div>
                </div>

                {/* --- CLINICAL --- */}
                <div className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-800 border-l-4 border-[#556ee6] pl-3">Clinical History</h4>
                    <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                        <label className="text-sm font-semibold text-slate-600 ml-0.5">Known Allergies</label>
                        <textarea 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder:text-slate-400 resize-none"
                            placeholder="Detail any medication or food allergies..."
                            value={formData.allergies} 
                            onChange={(e) => setFormData({...formData, allergies: e.target.value})} 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Chronic Conditions</label>
                            <textarea 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder:text-slate-400 resize-none min-h-[120px]"
                                placeholder="List persistent conditions (e.g., Hypertension)..."
                                value={formData.chronic_conditions} 
                                onChange={(e) => setFormData({...formData, chronic_conditions: e.target.value})} 
                            />
                        </div>
                        <div className="space-y-1.5 focus-within:text-[#556ee6] transition-colors">
                            <label className="text-sm font-semibold text-slate-600 ml-0.5">Medical History</label>
                            <textarea 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-[#556ee6]/20 focus:border-[#556ee6] outline-none transition-all text-slate-800 placeholder:text-slate-400 resize-none min-h-[120px]"
                                placeholder="Past surgeries or significant history..."
                                value={formData.medical_history} 
                                onChange={(e) => setFormData({...formData, medical_history: e.target.value})} 
                            />
                        </div>
                    </div>
                </div>

                {/* --- ATTACHMENTS --- */}
                <div className="space-y-4 border-t border-slate-100 pt-6">
                    <h4 className="text-sm font-bold text-slate-800 border-l-4 border-[#556ee6] pl-3">Supporting Documentation</h4>
                    <div className="relative group p-6 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 hover:bg-white hover:border-[#556ee6] transition-all flex flex-col items-center justify-center text-center">
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        />
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#556ee6] mb-3 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-slate-700">{formData.attachment ? formData.attachment.name : 'Upload Clinical Files'}</p>
                        <p className="text-[11px] text-slate-500 font-medium">PDF, JPG, or PNG (Max 10MB)</p>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100 mt-6 font-sans">
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        className="w-full sm:w-auto px-6 py-3 bg-slate-50 text-slate-400 font-bold rounded-lg text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                    >
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
                        {initialData ? 'Update Record' : 'Save Record'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MedicalRecordsForm;