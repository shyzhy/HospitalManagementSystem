import React, { useEffect, useState } from 'react';
import { getConsultations } from '../api';
import { Consultation } from '../types';


const ConsultationList = () => {
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getConsultations();
                setConsultations(data);
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading history...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
            <div className="bg-slate-50 p-4 border-b border-slate-200">
                <h3 className="font-black text-slate-700 uppercase text-sm">Consultation History</h3>
            </div>
            <table className="w-full text-left">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase">Patient</th>
                        <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase">Attending Doctor</th>
                        <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase">Diagnosis</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {consultations.length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">No records found.</td></tr>
                    ) : (
                        consultations.map((c: any) => (
                            <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {new Date(c.consultation_date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-800">
                                    {/* Displays full patient name */}
                                    {c.patient_name ? `${c.patient_name} ${c.patient_last_name || ''}` : `ID: ${c.patient}`}
                                </td>
                                <td className="px-6 py-4 text-sm text-blue-600 font-medium">
                                    {/* Displays Doctor's Last Name */}
                                    {c.doctor_name ? `Dr. ${c.doctor_name}` : `Dr. ID: ${c.doctor}`}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{c.diagnosis}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ConsultationList;