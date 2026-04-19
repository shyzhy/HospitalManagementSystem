import React from 'react';

interface DoctorListProps {
    doctors: any[];
    onUpdate: (doctor: any) => void;
    onDelete: (id: number) => void;
}

const DoctorList: React.FC<DoctorListProps> = ({ doctors, onUpdate, onDelete }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name & License</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialization</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Duty Status</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {doctors.map((doc) => (
                        <tr key={doc.id} className={`transition-colors ${!doc.is_available ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className={`font-black text-sm ${!doc.is_available ? 'text-slate-400' : 'text-slate-800'}`}>
                                        Dr. {doc.first_name} {doc.last_name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                        ID: {doc.license_number}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`text-sm font-medium ${!doc.is_available ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {doc.specialization}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    doc.is_available 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                    : 'bg-red-50 text-red-600 border-red-100'
                                }`}>
                                    {doc.is_available ? '● ACTIVE' : '○ AWAY'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-3">
                                <button onClick={() => onUpdate(doc)} className="text-blue-500 hover:text-blue-700 font-black text-[10px] uppercase tracking-widest">Edit</button>
                                <button onClick={() => doc.id && onDelete(doc.id)} className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase tracking-widest">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DoctorList;