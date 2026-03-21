import React, { useState, useEffect } from 'react';
import TreatmentForm from './TreatmentForm';
import TreatmentList from './TreatmentList';
import { Treatment, Patient, Doctor } from '../types';
import { getPatients, getDoctors } from '../api';

const TreatmentPage: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    
    // --- ADDED STATE FOR DROPDOWNS ---
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    // --- ADDED FETCH LOGIC ---
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                setPatients(await getPatients());
                setDoctors(await getDoctors());
            } catch (error) {
                console.error("Failed to fetch dropdown data:", error);
            }
        };
        fetchDropdownData();
    }, []);

    const handleRefresh = () => {
        setShowForm(false);
        setSelectedTreatment(null);
        setRefreshKey(k => k + 1);
    };

    const handleEdit = (treatment: Treatment) => {
        setSelectedTreatment(treatment);
        setShowForm(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Treatment Management</h2>
                <button 
                    onClick={() => { setSelectedTreatment(null); setShowForm(!showForm); }}
                    className="px-6 py-2 bg-emerald-600 text-white font-black rounded-lg uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-colors"
                >
                    {showForm ? 'Cancel' : 'Register New'}
                </button>
            </div>

            {showForm ? (
                <TreatmentForm 
                    initialData={selectedTreatment} 
                    patients={patients} // <--- FIXED: Passing patients
                    doctors={doctors}   // <--- FIXED: Passing doctors
                    onSuccess={handleRefresh} 
                />
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <TreatmentList 
                        key={refreshKey} 
                        patientId={0} 
                        patients={patients} // <--- Just in case TreatmentList also needs it for rendering names
                        onUpdate={handleEdit} 
                    />
                </div>
            )}
        </div>
    );
};

export default TreatmentPage;