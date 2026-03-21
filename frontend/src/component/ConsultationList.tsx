import React, { useState, useEffect } from 'react';
import { getConsultations, deleteConsultation } from '../api';
import { Consultation, Patient } from '../types';

interface ConsultationListProps {
    patients: Patient[];
    onUpdate: (consultation: Consultation) => void;
}

const ConsultationList: React.FC<ConsultationListProps> = ({ patients, onUpdate }) => {
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    

    useEffect(() => {
        fetchConsultations();
    }, []);

    const fetchConsultations = async () => {
        try {
            const data = await getConsultations();
            setConsultations(data);
        } catch (error) {
            console.error("Error fetching consultations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to remove this consultation?")) {
            try {
                await deleteConsultation(id);
                fetchConsultations();
            } catch (error) {
                console.error("Error deleting consultation:", error);
                alert("Failed to delete consultation.");
            }
        }
    };

    // Filter consultations based on patient name or doctor name
    const filteredConsultations = consultations.filter(consultation => 
        consultation.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Loading records...</div>;

    return (
        <div className="space-y-6">
            {/* SEARCH BAR */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <span className="text-xl pl-2">🔍</span>
                <input 
                    type="text" 
                    placeholder="Search consultations..." 
                    className="w-full bg-transparent outline-none font-bold text-slate-700 placeholder:text-slate-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Attending Doctor</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnosis</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                          <tbody className="divide-y divide-slate-100">
                              {filteredConsultations.length === 0 ? (
                                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">No consultations found</td></tr>
                              ) : (
                                  filteredConsultations.map((consultation) => (
                                      <tr key={consultation.id} className="hover:bg-slate-50/50 transition-colors group">
                                          <td className="px-6 py-4 font-medium text-slate-400 text-xs">
                                              {consultation.consultation_date ? new Date(consultation.consultation_date).toLocaleDateString() : 'N/A'}
                                          </td>
                                          <td className="px-6 py-4 font-black text-slate-800 uppercase tracking-tight text-sm">
                                              {consultation.patient_name}
                                          </td>
                                          <td className="px-6 py-4 font-bold text-blue-600 text-sm">
                                              {consultation.doctor_name}
                                          </td>
                                          <td className="px-6 py-4 font-medium text-slate-300 italic text-sm">
                                              {consultation.diagnosis || "Pending..."}
                                          </td>
                                          <td className="px-6 py-4 text-right space-x-4">
                                              {/* Primary VIEW/EDIT Action */}
                                              <button 
                                                  onClick={() => onUpdate(consultation)} 
                                                  className="text-emerald-500 hover:text-emerald-700 font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105"
                                              >
                                                  View
                                              </button>

                                              {/* CANCEL/REMOVE Action */}
                                              <button 
                                                  onClick={() => consultation.id && handleDelete(consultation.id)} 
                                                  className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105"
                                              >
                                                  Remove
                                              </button>
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

export default ConsultationList;