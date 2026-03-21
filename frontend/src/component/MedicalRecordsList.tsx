import React, { useState, useEffect } from 'react';
import { getMedicalRecords, deleteMedicalRecord } from '../api';
import { MedicalRecord, Patient } from '../types';

interface MedicalRecordsListProps {
    patients: Patient[];
    onUpdate: (record: MedicalRecord) => void;
}

const MedicalRecordsList: React.FC<MedicalRecordsListProps> = ({ patients, onUpdate }) => {
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewRecord, setViewRecord] = useState<MedicalRecord | null>(null);

    const userRole = localStorage.getItem('role');

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const data = await getMedicalRecords();
            setRecords(data);
        } catch (error) {
            console.error("Error fetching medical records:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this medical record?")) {
            try {
                await deleteMedicalRecord(id);
                fetchRecords();
            } catch (error) {
                console.error("Error deleting record:", error);
                alert("Failed to delete record.");
            }
        }
    };

    // Filter records based on search term
    const filteredRecords = records.filter(record => 
        record.patient_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Loading records...</div>;

    return (
        <div className="space-y-6">
            {/* SEARCH BAR */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <span className="text-xl pl-2">🔍</span>
                <input 
                    type="text" 
                    placeholder="Search by Patient Name..." 
                    className="w-full bg-transparent outline-none font-bold text-slate-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Type</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Allergies</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredRecords.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">No medical records found</td></tr>
                        ) : (
                            filteredRecords.map((record) => (
                                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-slate-800">{record.patient_name}</td>
                                    <td className="px-6 py-4 font-bold text-red-500">{record.blood_type || 'N/A'}</td>
                                    <td className="px-6 py-4 font-medium text-slate-500 hidden md:table-cell truncate max-w-[200px]">
                                        {record.allergies || 'None listed'}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => setViewRecord(record)} className="text-emerald-600 hover:text-emerald-800 font-black text-[10px] uppercase tracking-widest transition-colors">
                                            View
                                        </button>
                                        {(userRole === 'admin' || userRole === 'doctor') && (
                                            <>
                                                <button onClick={() => onUpdate(record)} className="text-blue-500 hover:text-blue-700 font-black text-[10px] uppercase tracking-widest transition-colors">
                                                    Edit
                                                </button>
                                                <button onClick={() => record.id && handleDelete(record.id)} className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase tracking-widest transition-colors">
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

            {/* VIEW MODAL */}
            {viewRecord && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
                            <h3 className="text-lg font-black uppercase tracking-widest">Medical Record Details</h3>
                            <button onClick={() => setViewRecord(null)} className="text-white/70 hover:text-white text-2xl font-black">&times;</button>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6 border-b border-slate-100 pb-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient Name</p>
                                    <p className="font-bold text-slate-800 text-lg">{viewRecord.patient_name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Blood Type</p>
                                    <p className="font-bold text-red-500 text-lg">{viewRecord.blood_type || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 border-b border-slate-100 pb-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Emergency Contact</p>
                                    <p className="font-bold text-slate-700">{viewRecord.emergency_contact_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Emergency Phone</p>
                                    <p className="font-bold text-slate-700">{viewRecord.emergency_contact_phone || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Allergies</p>
                                    <p className="font-medium text-slate-600 bg-slate-50 p-3 rounded-xl">{viewRecord.allergies || 'None listed'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chronic Conditions</p>
                                    <p className="font-medium text-slate-600 bg-slate-50 p-3 rounded-xl">{viewRecord.chronic_conditions || 'None listed'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Medical History</p>
                                    <p className="font-medium text-slate-600 bg-slate-50 p-3 rounded-xl">{viewRecord.medical_history || 'None listed'}</p>
                                </div>
                            </div>

                            {/* View Attachment Button */}
                            {viewRecord.attachment ? (
                                <div className="pt-4">
                                    <a 
                                        href={typeof viewRecord.attachment === 'string' ? viewRecord.attachment : URL.createObjectURL(viewRecord.attachment)} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-100 transition-colors"
                                    >
                                        📎 View Attached File
                                    </a>
                                </div>
                            ) : (
                                <div className="pt-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No files attached</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalRecordsList;