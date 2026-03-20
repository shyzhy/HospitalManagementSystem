import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Removed Treatment import to fix warning

interface TreatmentListProps {
  patientId: string | number;
  onUpdate: (treatment: any) => void;
}

const TreatmentList: React.FC<TreatmentListProps> = ({ patientId, onUpdate }) => {
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // We move this inside useEffect or wrap in useCallback to fix the warning
  useEffect(() => {
    const fetchTreatments = async () => {
      setLoading(true);
      try {
        const url = patientId && patientId !== 0 
          ? `http://127.0.0.1:8000/api/v1/treatments/?patient=${patientId}`
          : `http://127.0.0.1:8000/api/v1/treatments/`;
        const response = await axios.get(url);
        setTreatments(response.data);
      } catch (error) {
        console.error("Error fetching treatments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, [patientId]); // Dependency is fine now

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this treatment record?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/v1/treatments/${id}/`);
        // Trigger a local refresh by filtering the state
        setTreatments(prev => prev.filter(t => t.id !== id));
      } catch (error) {
        alert("Failed to delete record.");
      }
    }
  };

  if (loading) return <p className="p-10 text-center text-slate-400 font-bold uppercase text-xs">Syncing Treatments...</p>;

  return (
    <div className="overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase">Patient</th>
            <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase">Doctor</th>
            <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase">Diagnosis</th>
            <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase">Plan</th>
            <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase text-right">Date</th>
            <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {treatments.map((t) => (
            <tr key={t.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm font-bold text-slate-800">{t.patient_name || `ID: ${t.patient}`}</td>
              <td className="px-6 py-4 text-sm text-slate-600 italic">{t.doctor_name || `ID: ${t.doctor}`}</td>
              <td className="px-6 py-4 text-sm font-medium text-teal-700">{t.treatment_name}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{t.description}</td>
              <td className="px-6 py-4 text-sm text-slate-400 text-right font-mono">
                {t.treatment_date ? new Date(t.treatment_date).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 text-right space-x-3">
                <button onClick={() => onUpdate(t)} className="text-blue-500 font-black text-[10px] uppercase tracking-widest">Edit</button>
                <button onClick={() => handleDelete(t.id)} className="text-red-400 font-black text-[10px] uppercase tracking-widest">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TreatmentList;