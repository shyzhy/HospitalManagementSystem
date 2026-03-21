import React, { useEffect, useState } from 'react';
import { getPrescriptions, deletePrescription } from '../api';
import { Prescription } from '../types';

interface PrescriptionListProps {
    onUpdate: (prescription: Prescription) => void;
}

const PrescriptionList: React.FC<PrescriptionListProps> = ({ onUpdate }) => {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);
    
    // State to handle the "View" popup for patients
    const [viewItem, setViewItem] = useState<Prescription | null>(null);

    // Get the user's role to determine permissions
    const userRole = localStorage.getItem('role') || 'patient';

    useEffect(() => {
        const fetchPrescriptionsData = async () => {
            try {
                const data = await getPrescriptions();
                setPrescriptions(data);
            } catch (error) {
                console.error("Error fetching prescriptions:", error);
            }
        };

        fetchPrescriptionsData();
    }, [refreshKey]);

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to permanently delete this prescription?")) {
            try {
                await deletePrescription(id);
                setRefreshKey(k => k + 1); // Refresh the list
            } catch (error) {
                alert("Failed to delete prescription.");
            }
        }
    };

    return (
        <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm relative">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medication</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dosage</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Frequency</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {prescriptions.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 text-sm font-black text-slate-800">
                                {p.patient_name || `Patient ID: ${p.patient}`}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-slate-600 italic">
                                {p.doctor_name || `Doctor ID: ${p.doctor}`}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-purple-600">
                                {p.medication}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                {p.dosage}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                {p.frequency}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                {p.duration}
                            </td>
                            <td className="px-6 py-4 text-right space-x-4">
                                {/* CONDITIONAL PERMISSIONS LOGIC */}
                                {userRole === 'patient' ? (
                                    <button 
                                        onClick={() => setViewItem(p)} 
                                        className="text-blue-500 hover:text-blue-700 font-black text-[10px] uppercase tracking-widest transition-colors"
                                    >
                                        View
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => onUpdate(p)} 
                                            className="text-blue-500 hover:text-blue-700 font-black text-[10px] uppercase tracking-widest transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => p.id && handleDelete(p.id)} 
                                            className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase tracking-widest transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    {prescriptions.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                                No prescription records found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* --- PATIENT VIEW MODAL --- */}
            {viewItem && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-purple-600 p-6 text-white flex justify-between items-center">
                            <h3 className="text-lg font-black uppercase tracking-widest">Prescription Details</h3>
                            <button onClick={() => setViewItem(null)} className="text-white/70 hover:text-white font-black text-xl transition-colors">&times;</button>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            <div className="border-b border-slate-100 pb-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medication</span>
                                <p className="text-2xl font-black text-purple-600 mt-1">{viewItem.medication}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dosage</span>
                                    <p className="font-bold text-slate-800 mt-1">{viewItem.dosage}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
                                    <p className="font-bold text-slate-800 mt-1">{viewItem.duration}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Directions / Frequency</span>
                                <p className="font-bold text-slate-800 mt-1">{viewItem.frequency}</p>
                            </div>

                            <div className="pt-2 flex items-center justify-between text-sm">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attending Physician:</span>
                                <span className="font-bold text-slate-600 italic">{viewItem.doctor_name || `Doctor ID: ${viewItem.doctor}`}</span>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100">
                            <button onClick={() => setViewItem(null)} className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-black rounded-xl uppercase tracking-widest hover:bg-slate-100 transition-colors">
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrescriptionList;