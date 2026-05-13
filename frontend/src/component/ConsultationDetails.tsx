import React from 'react';
import { Consultation } from '../types';

interface ConsultationDetailsProps {
    consultation: Consultation;
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
}

const ConsultationDetails: React.FC<ConsultationDetailsProps> = ({ consultation, onEdit, onDelete, onClose }) => {
    const userRole = localStorage.getItem('role') || 'patient';
    const displayDoctorName = consultation.doctor_name
        ? (consultation.doctor_name.toLowerCase().startsWith('dr.')
            ? consultation.doctor_name
            : ` ${consultation.doctor_name}`)
        : 'Not Assigned';

    return (
        <div className="bg-white w-full rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 border border-slate-200">

            {/* Header Section - Modern Minimalist */}
            <div className="bg-white p-8 border-b border-slate-100 relative overflow-hidden flex justify-between items-center">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                         <span className="px-2 py-0.5 bg-[#556ee6]/5 text-[#556ee6] rounded-md text-[9px] font-black uppercase tracking-widest border border-[#556ee6]/10">Electronic Medical Record</span>
                         <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-black uppercase tracking-widest border border-emerald-100">Verified Encounter</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Consultation Summary</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-[0.2em]">MedFlow &gt; Clinical Logs</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[#556ee6] shadow-sm relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
            </div>

            <div className="p-10 space-y-10">

                {/* --- IDENTITY & METADATA GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Identity Card */}
                    <div className="lg:col-span-2 bg-slate-50/50 rounded-3xl p-8 border border-slate-100 flex items-center gap-6">
                        {userRole === 'patient' ? (
                            <>
                                {consultation.doctor_profile_picture_url ? (
                                    <img 
                                        src={consultation.doctor_profile_picture_url} 
                                        alt={displayDoctorName}
                                        className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-white border border-slate-200 text-[#556ee6] flex items-center justify-center font-black text-2xl shadow-sm">
                                        {displayDoctorName.replace('Dr. ', '').charAt(0) || 'D'}
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attending Physician</p>
                                    <p className="text-2xl font-bold text-slate-800 tracking-tight leading-none">
                                        {displayDoctorName}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[10px] font-bold text-[#556ee6] bg-[#556ee6]/5 px-2 py-0.5 rounded border border-[#556ee6]/10">ID: #{consultation.doctor}</span>
                                        <span className="text-[10px] font-bold text-slate-400">Authorized Specialist</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {consultation.patient_profile_picture_url ? (
                                    <img 
                                        src={consultation.patient_profile_picture_url} 
                                        alt={consultation.patient_name || 'Patient'}
                                        className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-white border border-slate-200 text-[#556ee6] flex items-center justify-center font-black text-2xl shadow-sm">
                                        {consultation.patient_name?.charAt(0) || 'P'}
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Patient</p>
                                    <p className="text-2xl font-bold text-slate-800 tracking-tight leading-none">
                                        {consultation.patient_name || 'Anonymous Patient'}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[10px] font-bold text-[#556ee6] bg-[#556ee6]/5 px-2 py-0.5 rounded border border-[#556ee6]/10">ID: #{consultation.patient}</span>
                                        <span className="text-[10px] font-bold text-slate-400">Verified Patient Identity</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-slate-200">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Encounter ID</p>
                            <p className="text-xl font-bold font-mono tracking-tighter text-emerald-400">#CONS-{consultation.id?.toString().padStart(4, '0')}</p>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Clinical Date</p>
                                <p className="text-sm font-bold">{consultation.consultation_date ? new Date(consultation.consultation_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Status</p>
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Verified</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CLINICAL FINDINGS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Diagnosis Panel */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-[#556ee6] rounded-full"></div>
                            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Professional Diagnosis</h4>
                        </div>
                        <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm min-h-[160px] relative overflow-hidden group hover:border-[#556ee6]/20 transition-colors">
                            <p className="text-[15px] font-bold text-slate-800 leading-relaxed italic relative z-10">
                                {consultation.diagnosis || 'No definitive diagnosis was recorded.'}
                            </p>
                            <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-[#556ee6]/5 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Symptoms Panel */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-orange-400 rounded-full"></div>
                            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Patient Observations</h4>
                        </div>
                        <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-3xl min-h-[160px]">
                            <p className="text-[13px] text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                                {consultation.symptoms || 'No primary symptoms were archived for this session.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- NOTES SECTION --- */}
                {consultation.notes && (
                    <div className="bg-[#556ee6]/5 p-8 rounded-3xl border border-[#556ee6]/10 space-y-3">
                        <p className="text-[9px] font-black text-[#556ee6] uppercase tracking-[0.2em]">Internal Physician Notes</p>
                        <p className="text-[13px] text-slate-600 font-medium leading-relaxed italic italic">{consultation.notes}</p>
                    </div>
                )}

                {/* --- FOOTER ACTIONS --- */}
                <div className="space-y-4 pt-10 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto py-3.5 px-8 text-slate-400 font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Close Record
                        </button>

                        {userRole !== 'patient' && (
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={onDelete}
                                    className="px-6 py-3.5 bg-white border border-slate-200 text-red-500 font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-red-50 hover:border-red-100 active:scale-95 transition-all"
                                >
                                    Void Encounter
                                </button>
                                <button
                                    onClick={onEdit}
                                    className="px-10 py-3.5 bg-[#556ee6] text-white font-bold rounded-xl text-[11px] uppercase tracking-widest shadow-lg shadow-[#556ee6]/20 hover:bg-[#485ec4] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    Update Findings
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultationDetails;