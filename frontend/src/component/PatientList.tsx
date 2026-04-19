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

    // Filter patients based on first or last name
    const filteredPatients = patients.filter(patient => 
        patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* SEARCH BAR */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <span className="text-xl pl-2">🔍</span>
                <input 
                    type="text" 
                    placeholder="Search patients by name..." 
                    className="w-full bg-transparent outline-none font-bold text-slate-700 placeholder:text-slate-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Contact</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Address</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredPatients.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">No patients found</td></tr>
                        ) : (
                            filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-slate-800">{patient.first_name} {patient.last_name}</td>
                                    <td className="px-6 py-4 font-medium text-slate-500 hidden md:table-cell">{patient.phone}</td>
                                    <td className="px-6 py-4 font-medium text-slate-500 hidden lg:table-cell truncate max-w-[200px]">{patient.address}</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => onTrack(patient)} className="text-emerald-600 hover:text-emerald-800 font-black text-[10px] uppercase tracking-widest transition-colors">
                                            Track
                                        </button>
                                        {userRole === 'admin' && (
                                            <>
                                                <button onClick={() => onUpdate(patient)} className="text-blue-500 hover:text-blue-700 font-black text-[10px] uppercase tracking-widest transition-colors">
                                                    Edit
                                                </button>
                                                <button onClick={() => patient.id && onDelete(patient.id)} className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase tracking-widest transition-colors">
                                                    Remove
                                                </button>
                                            </>
                                        )}
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