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
        <div className="space-y-6 px-4 pt-4">
            {/* SEARCH BAR */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center gap-3 transition-all focus-within:shadow-[0_0_0_4px_rgba(15,23,42,0.05)] focus-within:border-slate-300">
                <div className="text-slate-400 pl-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input 
                    type="text" 
                    placeholder="Search consultations..." 
                    className="w-full bg-transparent outline-none font-medium text-slate-800 placeholder:text-slate-400 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="w-full">
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
                                      <tr key={consultation.id} className="hover:bg-white transition-all duration-300 group cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                                          <td className="px-6 py-5 font-black text-slate-400 text-[11px] tracking-widest uppercase">
                                              {consultation.consultation_date ? new Date(consultation.consultation_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                          </td>
                                          <td className="px-6 py-5">
                                             <div className="font-black text-slate-800 tracking-tight text-sm group-hover:text-emerald-700 transition-colors">
                                                 {consultation.patient_name}
                                             </div>
                                          </td>
                                          <td className="px-6 py-5 font-medium text-slate-500 text-xs">
                                              Dr. {consultation.doctor_name}
                                          </td>
                                          <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-medium tracking-wide ${consultation.diagnosis ? 'bg-slate-100 text-slate-700' : 'bg-orange-50 text-orange-600'}`}>
                                                {consultation.diagnosis ? consultation.diagnosis.substring(0, 15) + (consultation.diagnosis.length > 15 ? '...' : '') : "Pending"}
                                            </span>
                                          </td>
                                          <td className="px-6 py-4 text-right space-x-4">
                                              {/* Primary VIEW/EDIT Action */}
                                              <button 
                                                  onClick={() => onUpdate(consultation)} 
                                                  className="text-blue-500 hover:text-blue-700 font-bold text-xs hover:underline transition-all"
                                              >
                                                  View
                                              </button>

                                              {/* CANCEL/REMOVE Action */}
                                              <button 
                                                  onClick={() => consultation.id && handleDelete(consultation.id)} 
                                                  className="text-red-500 hover:text-red-700 font-bold text-xs hover:underline transition-all"
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