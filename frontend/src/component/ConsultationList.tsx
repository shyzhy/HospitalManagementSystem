import React, { useState, useEffect } from 'react';
import { getConsultations, deleteConsultation } from '../api';
import { Consultation, Patient } from '../types';

interface ConsultationListProps {
    patients: Patient[];
    onUpdate: (consultation: Consultation) => void;
}

const ConsultationList: React.FC<ConsultationListProps> = ({ patients, onUpdate }) => {
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchConsultations();
    }, []);

    const fetchConsultations = async () => {
        try {
            const data = await getConsultations();
            setConsultations(data);
        } catch (error) {
            console.error("Error fetching consultations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Permanent Action: Are you sure you want to remove this clinical encounter?")) {
            try {
                await deleteConsultation(id);
                fetchConsultations();
            } catch (error) {
                console.error("Error deleting consultation:", error);
            }
        }
    };

    const filteredConsultations = consultations.filter(consultation =>
        consultation.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="p-20 text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#556ee6] border-t-transparent"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Clinical Ledger...</p>
        </div>
    );

    return (
        <div className="space-y-6 px-4 pt-4">
            {/* SEARCH AREA */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center gap-3 transition-all focus-within:shadow-[0_0_0_4px_rgba(85,110,230,0.05)] focus-within:border-[#556ee6]/30">
                <div className="text-slate-400 pl-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search clinical encounters..."
                    className="w-full bg-transparent outline-none font-medium text-slate-800 placeholder:text-slate-400 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="w-full">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Encounter Date</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Identity</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Attending Physician</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredConsultations.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-300 font-bold text-xs uppercase tracking-[0.2em]">No clinical encounters archived in this directory</td></tr>
                        ) : (
                            filteredConsultations.map((consultation) => (
                                <tr
                                    key={consultation.id}
                                    className="hover:bg-slate-50/50 transition-all duration-300 group cursor-pointer"
                                    onClick={() => onUpdate(consultation)}
                                >
                                    <td className="px-6 py-5">
                                        <div className="text-[10px] font-black text-[#556ee6] bg-[#556ee6]/5 px-2 py-1 rounded inline-block uppercase tracking-widest border border-[#556ee6]/10">
                                            {consultation.consultation_date ? new Date(consultation.consultation_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="font-black text-slate-800 tracking-tight text-sm group-hover:text-[#556ee6] transition-colors">
                                            {consultation.patient_name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                            <span className="text-[11px] font-bold text-slate-500 italic">{consultation.doctor_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right opacity-60 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#556ee6] hover:text-white transition-all shadow-sm"
                                            >
                                                Inspect
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); consultation.id && handleDelete(consultation.id); }}
                                                className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                                title="Void Encounter"
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

export default ConsultationList;