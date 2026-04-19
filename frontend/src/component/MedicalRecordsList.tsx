import React, { useState, useEffect } from 'react';
import { getMedicalRecords, deleteMedicalRecord } from '../api';
import { MedicalRecord, Patient } from '../types';

interface MedicalRecordsListProps {
    patients: Patient[];
    onUpdate: (record: MedicalRecord) => void;
    onView: (record: MedicalRecord) => void;
}

const MedicalRecordsList: React.FC<MedicalRecordsListProps> = ({ patients, onUpdate, onView }) => {
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const userRole = localStorage.getItem('role');

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const data = await getMedicalRecords();
            setRecords(data);
        } catch (error) {
            console.error("Error fetching medical records:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRecords = records.filter(record => 
        record.patient_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="p-20 text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#556ee6] border-t-transparent"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Medical Repository...</p>
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
                    placeholder="Search patient medical profiles..." 
                    className="w-full bg-transparent outline-none font-medium text-slate-800 placeholder:text-slate-400 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="w-full">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Identity</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Type</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Emergency Contact</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredRecords.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-300 font-bold text-xs uppercase tracking-[0.2em]">No medical profiles found</td></tr>
                        ) : (
                            filteredRecords.map((record) => (
                                <tr 
                                    key={record.id} 
                                    className="hover:bg-slate-50/50 transition-all duration-300 group cursor-pointer"
                                    onClick={() => onView(record)}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#f4f5f9] text-[#556ee6] flex items-center justify-center font-black text-xs">
                                                {record.patient_name?.charAt(0)}
                                            </div>
                                            <div className="font-black text-slate-800 tracking-tight text-sm group-hover:text-[#556ee6] transition-colors">
                                                {record.patient_name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                       <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-md font-black text-[10px] border border-red-100 uppercase tracking-tighter">
                                          {record.blood_type || '??'}
                                       </span>
                                    </td>
                                    <td className="px-6 py-5 hidden md:table-cell">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-slate-600">{record.emergency_contact_name || 'N/A'}</span>
                                            <span className="text-[10px] text-slate-400 font-mono tracking-tighter">{record.emergency_contact_phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right opacity-60 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center justify-end gap-3">
                                            <button 
                                                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#556ee6] hover:text-white transition-all shadow-sm"
                                            >
                                                Inspect
                                            </button>
                                            {(userRole === 'admin' || userRole === 'doctor') && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onUpdate(record); }} 
                                                    className="p-1.5 text-slate-400 hover:text-[#556ee6] transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
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

export default MedicalRecordsList;