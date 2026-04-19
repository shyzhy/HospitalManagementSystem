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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTreatments = async () => {
            setLoading(true);
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
            } finally {
                setLoading(false);
            }
        };

        fetchTreatments();
    }, [patientId, refreshKey]);

    const handleDelete = async (id: number) => {
        if (window.confirm("Permanent Action: Are you sure you want to void this treatment record?")) {
            try {
                await deleteTreatment(id);
                setRefreshKey(k => k + 1);
            } catch (error) {
                console.error("Failed to delete treatment:", error);
            }
        }
    };

    if (loading) return (
        <div className="p-20 text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#556ee6] border-t-transparent"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retrieving Clinical Procedures...</p>
        </div>
    );

    return (
        <div className="space-y-6 px-4 pt-4">
            <div className="w-full">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Procedure / Treatment</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Identity</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Physician</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {treatments.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-300 font-bold text-xs uppercase tracking-[0.2em]">No treatment procedures recorded in this scope</td></tr>
                        ) : (
                            treatments.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50/50 transition-all duration-300 group cursor-pointer" onClick={() => onUpdate(t)}>
                                    <td className="px-6 py-5">
                                        <div className="font-black text-slate-800 tracking-tight text-sm group-hover:text-emerald-600 transition-colors">
                                            {t.treatment_name}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-medium italic truncate max-w-[200px] mt-1">
                                            {t.description || 'Clinical procedural details pending...'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-[#556ee6] flex items-center justify-center font-black text-[9px]">
                                                {t.patient_name?.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-slate-600 tracking-tight">{t.patient_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                         <span className="text-[11px] font-bold text-slate-500 italic">{t.doctor_name}</span>
                                    </td>
                                    <td className="px-6 py-5 text-right opacity-60 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center justify-end gap-3">
                                            <button 
                                                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#556ee6] hover:text-white transition-all shadow-sm"
                                            >
                                                Details
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); t.id && handleDelete(t.id); }} 
                                                className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
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

export default TreatmentList;