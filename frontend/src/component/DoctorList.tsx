import React, { useState } from 'react';
import { Doctor } from '../types';

interface DoctorListProps {
    doctors: Doctor[];
    onUpdate: (doctor: Doctor) => void;
    onDelete: (id: number) => void;
    onTrack: (doctor: Doctor) => void;
}

const DoctorList: React.FC<DoctorListProps> = ({ doctors, onUpdate, onDelete, onTrack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const userRole = localStorage.getItem('role');

    const filteredDoctors = doctors.filter(doc => 
        doc.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 px-4 pt-4 animate-in fade-in duration-500">
            {/* SEARCH AREA */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center gap-3 transition-all focus-within:shadow-[0_4px_12px_rgba(0,0,0,0.03)] focus-within:border-[#4e5ec4]/30">
                <div className="text-slate-400 pl-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input 
                    type="text" 
                    placeholder="Filter staff by name or specialty..." 
                    className="w-full bg-transparent outline-none font-medium text-slate-800 placeholder:text-slate-400 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="w-full">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Personnel</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Reg. Number</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Verified Specialization</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredDoctors.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-300 font-bold text-xs uppercase tracking-[0.2em]">No medical staff found matching search criteria</td></tr>
                        ) : (
                            filteredDoctors.map((doc, index) => (
                                <tr 
                                    key={doc.id} 
                                    className="hover:bg-slate-50 group transition-all duration-300 cursor-pointer"
                                    onClick={() => onTrack(doc)}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white text-xs border border-white/20 shadow-sm transition-transform group-hover:scale-105 ${index % 2 === 0 ? 'bg-[#4e5ec4]' : 'bg-slate-800'}`}>
                                                {doc.first_name.charAt(0)}{doc.last_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-800 tracking-tight text-sm group-hover:text-[#4e5ec4] transition-colors leading-none mb-1.5">
                                                    Dr. {doc.first_name} {doc.last_name}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Registry Active</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 hidden md:table-cell">
                                        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-tighter">#{doc.license_number}</span>
                                    </td>
                                    <td className="px-6 py-5 hidden lg:table-cell">
                                        <div className="text-xs font-black text-slate-500 uppercase tracking-widest italic">{doc.specialization}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${doc.is_available ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`}></div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${doc.is_available ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {doc.is_available ? 'Active' : 'Away'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#4e5ec4] hover:text-white transition-all shadow-sm"
                                            >
                                                Inspect
                                            </button>
                                            
                                            {userRole === 'admin' && (
                                                <div className="flex gap-1.5 border-l border-slate-100 pl-3 ml-1">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); onUpdate(doc); }} 
                                                        className="p-2 text-slate-400 hover:text-[#4e5ec4] hover:bg-white rounded-lg transition-all"
                                                        title="Edit Credentials"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); doc.id && onDelete(doc.id); }} 
                                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Revoke Registry"
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

export default DoctorList;