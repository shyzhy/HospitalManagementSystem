import React from 'react';
import { Patient } from '../types';

interface Props {
  patients: Patient[];
  onUpdate: (patient: Patient) => void;
  onDelete: (id: number) => void;
  onTrack: (patient: Patient) => void; // Gidugang para sa Track Treatment
}

const PatientList: React.FC<Props> = ({ patients, onUpdate, onDelete, onTrack }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-emerald-50 text-emerald-800 text-[10px] uppercase font-black tracking-widest">
          <tr>
            <th className="px-6 py-4">Hospital ID</th>
            <th className="px-6 py-4">Patient Name</th>
            <th className="px-6 py-4">DOB | Gender</th>
            <th className="px-6 py-4">Contact</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {patients.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm italic">
                No patients found in the registry.
              </td>
            </tr>
          ) : (
            patients.map((p) => (
              <tr key={p.id} className="hover:bg-emerald-50/30 transition-colors group">
                <td className="px-6 py-4 text-xs font-mono text-slate-400">
                  {p.patient_id}
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-800">
                    {p.first_name} {p.last_name}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {p.dob} | {p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : 'Other'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {p.phone}
                </td>
                <td className="px-6 py-4 text-right space-x-4">
                  {/* BAG-O: Track Treatment Button */}
                  <button 
                    onClick={() => onTrack(p)} 
                    className="text-blue-600 font-black hover:underline text-xs"
                  >
                    TRACK
                  </button>
                  
                  <button 
                    onClick={() => onUpdate(p)} 
                    className="text-emerald-600 font-black hover:underline text-xs"
                  >
                    EDIT
                  </button>
                  
                  <button 
                    onClick={() => onDelete(p.id!)} 
                    className="text-red-400 font-black hover:text-red-600 text-xs"
                  >
                    REMOVE
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;