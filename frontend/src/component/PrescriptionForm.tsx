import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createPrescription, updatePrescription } from '../api';
import { Prescription } from '../types';

interface PrescriptionFormProps {
    consultationId: number | null;
    initialData?: Prescription | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ 
    initialData, onSuccess, onCancel 
}) => {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    
    const [formData, setFormData] = useState({
        medication: '',
        dosage: '',
        frequency: '', // This was the field causing the error!
        duration: '',
        patient: '',
        doctor: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [docRes, patRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/v1/doctors/'),
                    axios.get('http://127.0.0.1:8000/api/v1/patients/')
                ]);
                setDoctors(docRes.data);
                setPatients(patRes.data);
            } catch (err) { console.error("Error fetching dropdown data", err); }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                medication: initialData.medication || '',
                dosage: initialData.dosage || '',
                frequency: initialData.frequency || '',
                duration: initialData.duration || '',
                patient: initialData.patient ? String(initialData.patient) : '',
                doctor: initialData.doctor ? String(initialData.doctor) : ''
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation before sending
        if (!formData.patient || !formData.doctor || !formData.frequency) {
            alert("Please fill in all required fields, including Frequency.");
            return;
        }

        try {
            // Convert strings to numbers for Django ForeignKeys
            const payload = {
                ...formData,
                patient: Number(formData.patient),
                doctor: Number(formData.doctor)
            };

            if (initialData?.id) {
                await updatePrescription(initialData.id, payload);
            } else {
                await createPrescription(payload);
            }
            onSuccess();
        } catch (error: any) {
            console.error("Save error:", error.response?.data);
            alert(`Error: ${JSON.stringify(error.response?.data)}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
                <div className="bg-purple-600 p-6">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">
                        {initialData ? 'Edit Prescription' : 'Add Prescription'}
                    </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {/* PATIENT DROPDOWN */}
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-1">Select Patient</label>
                        <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.patient} onChange={(e) => setFormData({...formData, patient: e.target.value})} required>
                            <option value="">Choose Patient...</option>
                            {patients.map(pat => (
                                <option key={pat.id} value={pat.id}>{pat.first_name} {pat.last_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* DOCTOR DROPDOWN */}
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-1">Attending Doctor</label>
                        <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.doctor} onChange={(e) => setFormData({...formData, doctor: e.target.value})} required>
                            <option value="">Choose Doctor...</option>
                            {doctors.map(doc => (
                                <option key={doc.id} value={doc.id}>
                                    Dr. {doc.user_details?.first_name} {doc.user_details?.last_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <hr className="border-slate-100" />

                    {/* MEDICATION */}
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-1">Medication Name</label>
                        <input type="text" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g. Amoxicillin"
                            value={formData.medication} onChange={(e) => setFormData({...formData, medication: e.target.value})} />
                    </div>

                    {/* FREQUENCY - ADDED THIS FIELD TO FIX ERROR */}
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-1">Frequency</label>
                        <input type="text" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g. 3x a day (after meals)"
                            value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})} />
                    </div>

                    {/* DOSAGE & DURATION GRID */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase mb-1">Dosage</label>
                            <input type="text" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                                placeholder="500mg"
                                value={formData.dosage} onChange={(e) => setFormData({...formData, dosage: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase mb-1">Duration</label>
                            <input type="text" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                                placeholder="7 days"
                                value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-all">
                            CANCEL
                        </button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition-all">
                            SAVE RECORD
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrescriptionForm;