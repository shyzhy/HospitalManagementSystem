import React from 'react';

interface DoctorListProps {
    doctors: any[];
    onUpdate: (doctor: any) => void;
    onDelete: (id: number) => void;
}

const DoctorList: React.FC<DoctorListProps> = ({ doctors, onUpdate, onDelete }) => {
    return (
        <div className="w-full">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="py-4 px-2 text-[11px] font-bold text-slate-400 capitalize">Name</th>
                        <th className="py-4 px-2 text-[11px] font-bold text-slate-400 capitalize">ID</th>
                        <th className="py-4 px-2 text-[11px] font-bold text-slate-400 capitalize">Email</th>
                        <th className="py-4 px-2 text-[11px] font-bold text-slate-400 capitalize">Specialization</th>
                        <th className="py-4 px-2 text-[11px] font-bold text-slate-400 capitalize">STATUS</th>
                        <th className="py-4 px-2 text-right"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/60">
                    {doctors.map((doc, index) => (
                        <tr key={doc.id} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                            <td className="py-5 px-2">
                                <div className="flex items-center gap-4">
                                    {/* Avatar Placeholder */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white uppercase text-sm ${index % 2 === 0 ? 'bg-orange-400' : 'bg-blue-400'}`}>
                                        {doc.first_name?.charAt(0) || 'D'}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-slate-800">
                                            {doc.first_name} {doc.last_name}
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                                            {doc.specialization}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="py-5 px-2">
                                <span className="font-bold text-[13px] text-slate-700">
                                    {doc.license_number}
                                </span>
                            </td>
                            <td className="py-5 px-2">
                                <span className="font-bold text-[13px] text-slate-700">
                                    {doc.username || doc.first_name?.toLowerCase() + '@medflow.com'}
                                </span>
                            </td>
                            <td className="py-5 px-2">
                                <span className="font-bold text-[13px] text-slate-700">
                                    {doc.specialization}
                                </span>
                            </td>
                            <td className="py-5 px-2">
                                <span className={`px-4 py-1.5 rounded-md text-[11px] font-bold capitalize border border-transparent ${
                                    doc.is_available 
                                    ? 'bg-[#E8F5E9] text-[#2E7D32]' // Exact color from image for 'Approved'
                                    : 'bg-[#FFEBEE] text-[#C62828]' // Exact color from image for 'Declined'
                                }`}>
                                    {doc.is_available ? 'Active' : 'Away'}
                                </span>
                            </td>
                            <td className="py-5 px-2 text-right">
                                <button className="text-slate-300 group-hover:text-slate-600 transition-colors pr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DoctorList;