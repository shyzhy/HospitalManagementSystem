import React, { useEffect, useState } from 'react';
import { getPrescriptions, deletePrescription } from '../api';
import { Prescription } from '../types';

interface PrescriptionListProps {
    onUpdate: (prescription: Prescription) => void;
    onView?: (prescription: Prescription) => void;
}

const PrescriptionList: React.FC<PrescriptionListProps> = ({ onUpdate, onView }) => {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);

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
        if (window.confirm("Clinical Action: Are you sure you want to permanently void this prescription?")) {
            try {
                await deletePrescription(id);
                setRefreshKey(k => k + 1);
            } catch (error) {
                alert("Failed to delete prescription.");
            }
        }
    };

    return (
        <div className="space-y-6 px-4 pt-4 animate-in fade-in duration-500">
            <div className="w-full">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medication Order</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Identity</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Prescribing Physician</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {prescriptions.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">No active prescriptions found</td></tr>
                        ) : (
                            prescriptions.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer" onClick={() => onView && onView(p)}>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#556ee6] flex items-center justify-center text-lg shadow-sm border border-blue-100/50">
                                                💊
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 tracking-tight group-hover:text-[#556ee6] transition-colors">{p.medication}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Order #{p.id?.toString().padStart(4, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-[#556ee6] flex items-center justify-center font-black text-[9px]">
                                                {p.patient_name?.charAt(0) || 'P'}
                                            </div>
                                            <span className="text-sm font-bold text-slate-600 tracking-tight">{p.patient_name || `ID: ${p.patient}`}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[11px] font-bold text-slate-400 italic">{p.doctor_name || `ID: ${p.doctor}`}</span>
                                    </td>
                                    <td className="px-6 py-5 text-right opacity-40 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                                            {userRole !== 'patient' ? (
                                                <>
                                                    <button 
                                                        onClick={() => onUpdate(p)} 
                                                        className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#556ee6] hover:text-white transition-all shadow-sm"
                                                    >
                                                        Modify
                                                    </button>
                                                    <button 
                                                        onClick={() => p.id && handleDelete(p.id)} 
                                                        className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </>
                                            ) : (
                                                <button 
                                                    onClick={() => onView && onView(p)} 
                                                    className="px-4 py-2 bg-[#556ee6]/10 text-[#556ee6] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#556ee6] hover:text-white transition-all"
                                                >
                                                    View Prescription
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PrescriptionList;