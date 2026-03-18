import React from 'react';
import { Doctor } from '../types';

interface Props {
  doctors: Doctor[];
  onUpdate: (doctor: Doctor) => void;
  onDelete: (id: number) => void;
}

const DoctorList: React.FC<Props> = ({ doctors, onUpdate, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Specialization</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {doctors.map(doc => (
            <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-bold text-slate-800">
                  Dr. {doc.user?.first_name} {doc.user?.last_name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">{doc.license_number}</div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{doc.specialization}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${doc.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {doc.is_available ? 'ACTIVE' : 'AWAY'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => onUpdate(doc)} className="text-blue-600 hover:text-blue-800 font-bold text-xs mr-4">EDIT</button>
                <button onClick={() => onDelete(doc.id!)} className="text-red-400 hover:text-red-600 font-bold text-xs">DELETE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorList;