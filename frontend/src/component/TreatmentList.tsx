import React, { useEffect, useState } from 'react';
import { getTreatments, getTreatmentsByPatient, deleteTreatment } from '../api';
import { Treatment, Patient } from '../types';

interface TreatmentListProps {
    patientId?: number;
    patients?: Patient[];
    onUpdate: (treatment: Treatment) => void;
}

const TreatmentList: React.FC<TreatmentListProps> = ({ patientId, patients, onUpdate }) => {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        // Moved inside useEffect to fix the React Hook warning
        const fetchTreatments = async () => {
            try {
                let data;
                if (patientId && patientId > 0) {
                    data = await getTreatmentsByPatient(patientId);
                } else {
                    data = await getTreatments();
                }
                setTreatments(data);
            } catch (error) {
                console.error("Error fetching treatments:", error);
            }
        };

        fetchTreatments();
    }, [patientId, refreshKey]); // Now depends on refreshKey so we can trigger it after delete

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this treatment record?")) {
            try {
                await deleteTreatment(id);
                setRefreshKey(k => k + 1); // Trigger the useEffect to refresh the list
            } catch (error) {
                alert("Failed to delete treatment.");
            }
        }
    };

    return (
        <div className="overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Treatment</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {treatments.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 text-sm font-black text-slate-800">
                                {t.patient_name}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-blue-600">
                                {t.doctor_name?.toLowerCase().startsWith('dr.') 
                                    ? t.doctor_name 
                                    : `Dr. ${t.doctor_name}`}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                                {t.treatment_name}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                                {t.description || '-'}
                            </td>
                            <td className="px-6 py-4 text-right space-x-4">
                                <button 
                                    onClick={() => onUpdate(t)} 
                                    className="text-emerald-500 hover:text-emerald-700 font-black text-[10px] uppercase tracking-widest transition-colors"
                                >
                                    Edit
                                </button>
                                <button 
                                    // ADDED SAFETY CHECK HERE (t.id && ...)
                                    onClick={() => t.id && handleDelete(t.id)} 
                                    className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase tracking-widest transition-colors"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    {treatments.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                                No treatment records found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TreatmentList;