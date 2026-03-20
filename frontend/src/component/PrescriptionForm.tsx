import React, { useState, useEffect } from 'react';
import { createPrescription, updatePrescription } from '../api';
import { Prescription } from '../types';

// component/PrescriptionForm.tsx
interface PrescriptionFormProps {
    consultationId: number | null; // Change from 'number' to 'number | null'
    initialData?: Prescription | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ 
    consultationId, 
    initialData, 
    onSuccess, 
    onCancel 
}) => {
    const [formData, setFormData] = useState({
        medication_name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
    });

    // Pre-fill the form for Editing mode
    useEffect(() => {
        if (initialData) {
            setFormData({
                medication_name: initialData.medication_name || '',
                dosage: initialData.dosage || '',
                frequency: initialData.frequency || '',
                duration: initialData.duration || '',
                instructions: initialData.instructions || ''
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // FIX: The backend error "visit: This field is required" means 
            // we must use 'visit' as the key, not 'consultation'.
            const payload = {
                ...formData,
                visit: consultationId 
            };

            if (initialData && initialData.id) {
                // UPDATE existing record
                await updatePrescription(initialData.id, payload);
            } else {
                // CREATE new record
                await createPrescription(payload);
            }
            onSuccess();
        } catch (error: any) {
            // Logic to capture and show backend validation errors
            console.error("Save error detail:", error.response?.data || error.message);
            
            // Displays the specific field error (e.g., "visit: This field is required")
            const errorMessage = error.response?.data 
                ? JSON.stringify(error.response.data) 
                : error.message;
                
            alert(`Error saving prescription: ${errorMessage}`);
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
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-1">Medication Name</label>
                        <input 
                            type="text" required
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            placeholder="e.g. Amoxicillin"
                            value={formData.medication_name}
                            onChange={(e) => setFormData({...formData, medication_name: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase mb-1">Dosage</label>
                            <input 
                                type="text" required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="500mg"
                                value={formData.dosage}
                                onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase mb-1">Duration</label>
                            <input 
                                type="text" required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="7 days"
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-1">Frequency</label>
                        <input 
                            type="text" required
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="3x a day"
                            value={formData.frequency}
                            onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-1">Additional Instructions</label>
                        <textarea 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Take with water..."
                            rows={2}
                            value={formData.instructions}
                            onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                        />
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button 
                            type="button" onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-all"
                        >
                            CANCEL
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-lg shadow-purple-200 hover:bg-purple-700 active:scale-95 transition-all"
                        >
                            {initialData ? 'UPDATE RECORD' : 'SAVE RECORD'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrescriptionForm;