import React, { useState, useEffect } from 'react';
import { getPatients, getDoctors, createConsultation } from '../api';
import { Patient, Doctor } from '../types';

const RecordConsultation = () => {
    // 1. State for the dropdown lists
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    
    // 2. State for the form fields
    const [formData, setFormData] = useState({
        patient: '',
        doctor: '',
        symptoms: '',
        diagnosis: '',
        notes: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 3. FETCH DATA ON LOAD - This fixes the empty select lists
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [patientData, doctorData] = await Promise.all([
                    getPatients(),
                    getDoctors()
                ]);
                setPatients(patientData);
                setDoctors(doctorData);
            } catch (error) {
                console.error("Error loading selection data:", error);
                setMessage({ type: 'error', text: 'Failed to load patients or doctors.' });
            }
        };
        loadInitialData();
    }, []);

    // 4. Handle Form Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await createConsultation(formData);
            setMessage({ type: 'success', text: 'Consultation recorded successfully!' });
            // Clear form
            setFormData({ patient: '', doctor: '', symptoms: '', diagnosis: '', notes: '' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save record. Check server connection.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-black text-emerald-700 mb-6 uppercase tracking-tight">
                New Consultation Entry
            </h2>

            {message.text && (
                <div className={`mb-4 p-4 rounded-lg font-bold text-sm ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-2">Patient</label>
                        <select 
                            required
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            value={formData.patient}
                            onChange={(e) => setFormData({...formData, patient: e.target.value})}
                        >
                            <option value="">Select Patient</option>
                            {patients.map((p) => (
                                <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-2">Attending Doctor</label>
                        <select 
                            required
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            value={formData.doctor}
                            onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {/* Handle nested user object if it exists */}
                                    Dr. {d.user?.last_name || d.license_number}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Symptoms</label>
                    <textarea 
                        required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-24 resize-none focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="Enter patient complaints..."
                        value={formData.symptoms}
                        onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Diagnosis</label>
                    <textarea 
                        required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-24 resize-none focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="Enter medical findings..."
                        value={formData.diagnosis}
                        onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                    />
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'SAVING...' : 'SAVE MEDICAL RECORD'}
                </button>
            </form>
        </div>
    );
};

export default RecordConsultation;