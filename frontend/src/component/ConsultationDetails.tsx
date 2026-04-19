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
        <div className="bg-white w-full rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 border border-slate-200/60 shadow-xl">

            {/* --- REFINED HEADER --- */}
            <div className="bg-[#556ee6] p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-white/20 rounded-md text-[9px] font-black uppercase tracking-widest backdrop-blur-md">Electronic Medical Record</span>
                            <span className="px-2 py-0.5 bg-emerald-400/30 text-emerald-100 rounded-md text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-emerald-400/20">Verified Encounter</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">Consultation Summary</h3>
                        <p className="text-xs text-white/60 font-medium mt-2 italic">Clinical Encounter Log #{consultation.id?.toString().padStart(4, '0')}</p>
                    </div>
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl group transition-transform hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                </div>

                {/* Decorative background element */}
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute left-1/4 -bottom-12 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
            </div>

            <div className="p-10 space-y-10">

                {/* --- IDENTITY & METADATA GRID --- */}
                <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                    {/* Patient Bio Card */}
                    <div className="flex-1 bg-slate-50/80 rounded-3xl p-6 border border-slate-100 flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-slate-200 text-[#556ee6] flex items-center justify-center font-black text-3xl font-mono">
                            {consultation.patient_name?.charAt(0) || 'P'}
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Patient Identity</label>
                            <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                                {consultation.patient_name || 'Anonymous Patient'}
                            </p>
                            <span className="text-[11px] font-bold text-[#556ee6] bg-[#556ee6]/5 px-2 py-0.5 rounded leading-none">PatientID: #{consultation.patient}</span>
                        </div>
                    </div>

                    {/* Encounter Metadata Card */}
                    <div className="lg:w-1/3 bg-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-lg shadow-slate-200/50">
                        <div className="flex justify-between items-end border-b border-white/10 pb-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Encounter Date</label>
                                <p className="text-lg font-black text-emerald-400">
                                    {consultation.consultation_date ? new Date(consultation.consultation_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block whitespace-nowrap">Clinical ID</span>
                                <span className="text-sm font-black font-mono tracking-tighter">#CONS-{consultation.id?.toString().padStart(4, '0')}</span>
                            </div>
                        </div>
                        <div className="pt-1">
                            <label className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1">Attending Physician</label>
                            <p className="text-sm font-bold text-white/90 truncate italic">{displayDoctorName}</p>
                        </div>
                    </div>
                </div>

                {/* --- CLINICAL FINDINGS: HIGH DENSITY GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    {/* Diagnosis Panel */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#556ee6]/10 text-[#556ee6] flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Clinical Diagnosis</h4>
                        </div>
                        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm text-sm text-slate-800 font-bold leading-relaxed italic min-h-[120px] relative">
                            {consultation.diagnosis || 'No definitive diagnosis was recorded.'}
                            <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Symptoms Panel */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-100/50 text-orange-600 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Observations & Symptoms</h4>
                        </div>
                        <div className="p-6 bg-[#f8fafc] border border-slate-200/60 rounded-3xl text-sm text-slate-600 font-medium leading-relaxed min-h-[120px] whitespace-pre-wrap">
                            {consultation.symptoms || 'No primary symptoms were archived for this session.'}
                        </div>
                    </div>
                </div>

                {/* --- NOTES SECTION --- */}
                {consultation.notes && (
                    <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">External Physician Notes</span>
                            <div className="flex-1 h-px bg-slate-200/50"></div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">{consultation.notes}</p>
                    </div>
                )}

                {/* --- PROFESSIONAL ACTION FOOTER --- */}
                <div className="space-y-4 pt-8 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-200/40">
                        {userRole !== 'patient' ? (
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={onDelete}
                                    className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-300 text-red-500 font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-red-50 hover:border-red-200 active:scale-95 transition-all shadow-sm"
                                >
                                    Void Record
                                </button>
                                <button
                                    onClick={onEdit}
                                    className="flex-1 sm:flex-none px-10 py-3 bg-[#556ee6] text-white font-bold rounded-xl text-[10px] uppercase tracking-widest shadow-[0_8px_20px_rgba(85,110,230,0.25)] hover:bg-[#485ec4] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Modify Encounter
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#556ee6] border border-blue-100 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04m0 0a11.955 11.955 0 00-3.382 8.356c0 6.627 5.373 12 12 12s12-5.373 12-12c0-3.159-1.223-6.03-3.218-8.158" />
                                    </svg>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Authorized Clinical Record</p>
                                    <p className="text-[9px] text-slate-400 font-medium italic">This consultation log is verified. Please contact your physician for changes.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-4 text-slate-400 font-black rounded-2xl text-[11px] uppercase tracking-[0.3em] hover:bg-slate-50 transition-all text-center flex items-center justify-center gap-3 border border-transparent hover:border-slate-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Clinical Directory
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConsultationDetails;