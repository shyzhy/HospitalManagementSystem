import React, { useState } from 'react';
import { Patient } from '../types';

interface PatientListProps {
    patients: Patient[];
    onUpdate: (patient: Patient) => void;
    onDelete: (id: number) => void;
    onTrack: (patient: Patient) => void;
}

const PatientList: React.FC<PatientListProps> = ({ patients, onUpdate, onDelete, onTrack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const userRole = localStorage.getItem('role');

    const filteredPatients = patients.filter(patient => 
        patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.last_name.toLowerCase().includes(searchTerm.toLowerCase())
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
                    placeholder="Search master patient directory..." 
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
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Contact Details</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Region / Address</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredPatients.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-300 font-bold text-xs uppercase tracking-[0.2em]">No patient records matches the search criteria</td></tr>
                        ) : (
                            filteredPatients.map((patient) => (
                                <tr 
                                    key={patient.id} 
                                    className="hover:bg-slate-50/50 transition-all duration-300 group cursor-pointer"
                                    onClick={() => onTrack(patient)}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 text-[#556ee6] flex items-center justify-center font-black text-xs border border-slate-200 shadow-sm transition-transform group-hover:scale-105">
                                                {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-800 tracking-tight text-sm group-hover:text-[#556ee6] transition-colors leading-none mb-1">
                                                    {patient.first_name} {patient.last_name}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{patient.id?.toString().padStart(4, '0')}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 hidden md:table-cell">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-600">{patient.phone}</span>
                                            <span className="text-[10px] text-slate-400 underline decoration-slate-200 truncate max-w-[150px]">{patient.user_details?.username || patient.username || 'No Account'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 hidden lg:table-cell">
                                        <div className="text-xs font-medium text-slate-500 italic truncate max-w-[200px]">
                                            {patient.address || 'No address registered'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right opacity-60 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center justify-end gap-3">
                                            <button 
                                                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#556ee6] hover:text-white transition-all shadow-sm"
                                            >
                                                Inspect
                                            </button>
                                            {userRole === 'admin' && (
                                                <div className="flex gap-2 border-l border-slate-100 pl-3 ml-1">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); onUpdate(patient); }} 
                                                        className="p-1.5 text-slate-400 hover:text-[#556ee6] transition-colors"
                                                        title="Edit Profile"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); patient.id && onDelete(patient.id); }} 
                                                        className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                                        title="Delete Profile"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
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

export default PatientList;