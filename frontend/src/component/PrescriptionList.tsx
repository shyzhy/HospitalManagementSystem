import React, { useEffect, useState } from 'react';
import { getPrescriptions, deletePrescription } from '../api';
import { Prescription } from '../types';

interface PrescriptionListProps {
    onUpdate: (prescription: Prescription) => void;
}

const PrescriptionList: React.FC<PrescriptionListProps> = ({ onUpdate }) => {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPrescriptions = async () => {
        setLoading(true);
        try {
            const data = await getPrescriptions();
            setPrescriptions(data);
        } catch (error) {
            console.error("Error fetching prescriptions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    // CRUD: Delete Operation
    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this prescription record?")) {
            try {
                await deletePrescription(id);
                // Refresh the list after deletion to reflect changes in UI
                fetchPrescriptions(); 
            } catch (error) {
                alert("Failed to delete the record.");
            }
        }
    };

    if (loading) return (
        <div className="text-center py-10 text-slate-400 font-bold uppercase text-xs tracking-widest animate-pulse">
            Loading Records...
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase">Medication</th>
                        <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase">Dosage</th>
                        <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase">Frequency</th>
                        <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase">Duration</th>
                        <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {prescriptions.length === 0 ? (
                        <tr>
                            {/* Updated colSpan to 5 to match the total number of table headers */}
                            <td colSpan={5} className="px-6 py-10 text-center text-slate-400 font-bold italic">
                                No medical records found.
                            </td>
                        </tr>
                    ) : (
                        prescriptions.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 font-bold text-slate-800">{p.medication_name}</td>
                                <td className="px-6 py-4 text-slate-600 font-medium">{p.dosage}</td>
                                <td className="px-6 py-4 text-slate-600">{p.frequency}</td>
                                <td className="px-6 py-4 text-slate-600">{p.duration}</td>
                                <td className="px-6 py-4 text-right space-x-4">
                                    {/* Edit Button - Triggers the modal in App.tsx */}
                                    <button 
                                        onClick={() => onUpdate(p)}
                                        className="text-blue-500 hover:text-blue-700 font-black text-[10px] uppercase tracking-widest transition-colors"
                                    >
                                        Edit
                                    </button>
                                    
                                    {/* Delete Button */}
                                    <button 
                                        onClick={() => p.id && handleDelete(p.id)}
                                        className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase tracking-widest transition-colors"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PrescriptionList;