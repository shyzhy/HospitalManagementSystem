import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Patient } from '../types';

interface ConsultationListProps {
  onUpdate: (consultation: any) => void;
  patients: Patient[];  // Add this line
}

const ConsultationList: React.FC<ConsultationListProps> = ({ onUpdate, patients }) => {
  const [consultations, setConsultations] = useState<any[]>([]);

  const fetchConsultations = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/v1/consultations/');
      setConsultations(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchConsultations(); }, []);

  // Helper to get patient name from ID
  const getPatientName = (patientId: number) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      return patient.first_name + ' ' + patient.last_name;
    }
    return 'Patient #' + patientId;
  };

  const handleRemove = async (id: number) => {
    if (window.confirm("Remove this consultation record?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/v1/consultations/${id}/`);
        fetchConsultations();
      } catch (e) { alert("Failed to remove."); }
    }
  };

  return (
    <div className="overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Attending Doctor</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnosis</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {consultations.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                {c.consultation_date}
              </td>
              <td className="px-6 py-4 text-sm font-black text-slate-800">
                {getPatientName(c.patient)}
              </td>
              
              <td className="px-6 py-4 text-sm font-bold text-blue-600">
                {c.doctor_name?.toLowerCase().startsWith('dr.') 
                  ? c.doctor_name 
                  : `Dr. ${c.doctor_name}`}
              </td>

              <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                {c.diagnosis}
              </td>
              <td className="px-6 py-4 text-right space-x-4">
                <button 
                  onClick={() => onUpdate(c)} 
                  className="text-emerald-500 hover:text-emerald-700 font-black text-[10px] uppercase tracking-widest transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleRemove(c.id)} 
                  className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase tracking-widest transition-colors"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsultationList;