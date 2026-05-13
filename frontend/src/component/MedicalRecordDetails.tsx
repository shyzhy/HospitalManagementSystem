import React, { useEffect, useState } from 'react';
import { MedicalRecord, Prescription, Treatment } from '../types';
import { getPrescriptionsByPatient, getTreatmentsByPatient } from '../api';

interface MedicalRecordDetailsProps {
    record: MedicalRecord;
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
}

const MedicalRecordDetails: React.FC<MedicalRecordDetailsProps> = ({ record, onEdit, onDelete, onClose }) => {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [loadingTracks, setLoadingTracks] = useState(true);

    useEffect(() => {
        const fetchTracks = async () => {
            if (!record.patient) return;
            try {
                const [pData, tData] = await Promise.all([
                    getPrescriptionsByPatient(record.patient),
                    getTreatmentsByPatient(record.patient)
                ]);
                setPrescriptions(pData);
                setTreatments(tData);
            } catch (error) {
                console.error("Error fetching clinical tracks:", error);
            } finally {
                setLoadingTracks(false);
            }
        };
        fetchTracks();
    }, [record.patient]);

    return (
        <div className="bg-white w-full rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl shadow-slate-200">
            
            {/* Header Section with Profile Picture */}
            <div className="px-10 py-12 border-b border-slate-100 bg-slate-50/30 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                {/* Profile Picture Circle */}
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center relative z-10 transition-transform group-hover:scale-105 duration-500">
                        {record.patient_profile_picture_url ? (
                            <img src={record.patient_profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl font-black text-slate-300">{record.patient_name?.charAt(0) || 'P'}</span>
                        )}
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-tr from-[#556ee6] to-indigo-400 rounded-full opacity-20 blur group-hover:opacity-40 transition-opacity duration-500"></div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-end gap-3 mb-2">
                        <h3 className="text-4xl font-black text-slate-800 tracking-tight leading-none">
                            {record.patient_name || 'Anonymous Patient'}
                        </h3>
                        <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full font-black text-sm border border-red-100 shadow-sm inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            {record.blood_type || 'N/A'}
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        Official Clinical Dossier #REC-{record.id?.toString().padStart(4, '0')}
                    </p>
                </div>

                <div className="hidden lg:flex flex-col items-end gap-2">
                    <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-[#556ee6]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                </div>
            </div>

            <div className="p-10 space-y-12">
                {/* Clinical Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        {/* Civil Contacts */}
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency Contact</label>
                                <p className="text-sm font-bold text-slate-800">{record.emergency_contact_name || 'None'}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Phone</label>
                                <p className="text-sm font-black text-[#556ee6]">{record.emergency_contact_phone || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Summaries */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                    Known Allergies
                                </h4>
                                <div className="p-5 bg-red-50/30 border border-red-100 rounded-2xl text-sm text-red-900 font-medium italic">
                                    {record.allergies || 'No allergies recorded.'}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                    <span className="w-2 h-2 rounded-full bg-[#556ee6]"></span>
                                    Chronic Conditions
                                </h4>
                                <div className="p-5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700 font-bold leading-relaxed">
                                    {record.chronic_conditions || 'None listed.'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Integrated Clinical History */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Clinical Tracks (All Providers)
                            </h4>
                            <span className="text-[9px] font-black text-[#556ee6] bg-[#556ee6]/10 px-2 py-0.5 rounded uppercase">Verified Data</span>
                        </div>
                        
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {loadingTracks ? (
                                <div className="p-10 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing tracks...</div>
                            ) : prescriptions.length === 0 && treatments.length === 0 ? (
                                <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-300 text-xs font-bold uppercase italic">No issued tracks from clinical providers</div>
                            ) : (
                                <>
                                    {/* TREATMENTS HISTORY */}
                                    {treatments.map((t) => (
                                        <div key={t.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[#556ee6]/20 transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Treatment</span>
                                                <span className="text-[9px] font-bold text-slate-400 italic">{t.treatment_date}</span>
                                            </div>
                                            <p className="text-sm font-black text-slate-800 mb-1">{t.treatment_name}</p>
                                            <p className="text-[10px] text-slate-500 font-bold italic uppercase tracking-tight">Supervisor: {t.doctor_name}</p>
                                        </div>
                                    ))}
                                    
                                    {/* PRESCRIPTIONS HISTORY */}
                                    {prescriptions.map((p) => (
                                        <div key={p.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-emerald-500/20 transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Prescription</span>
                                                <span className="text-[9px] font-bold text-slate-400 italic">{p.date_prescribed}</span>
                                            </div>
                                            <p className="text-sm font-black text-slate-800 mb-1">{p.medication}</p>
                                            <div className="flex justify-between items-center">
                                                <p className="text-[10px] text-slate-500 font-bold italic uppercase tracking-tight">Provider: {p.doctor_name}</p>
                                                <span className="text-[9px] font-black text-slate-400 uppercase">{p.dosage}</span>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Professional Action Footer */}
                <div className="space-y-4 pt-10 border-t border-slate-100">
                    <div className="flex gap-4 flex-row-reverse">
                        <button 
                            onClick={onEdit}
                            className="flex-1 md:flex-none px-12 py-4 bg-[#556ee6] text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-[#556ee6]/20 hover:bg-[#485ec4] hover:-translate-y-0.5 active:translate-y-0 transition-all"
                        >
                            Modify Profile
                        </button>
                        <button 
                            onClick={onDelete}
                            className="px-8 py-4 bg-white border border-slate-200 text-red-500 font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] hover:bg-red-50 active:scale-95 transition-all"
                        >
                            Void Record
                        </button>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-full py-4 bg-slate-50 text-slate-400 font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all text-center"
                    >
                        Return to Repository
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MedicalRecordDetails;
