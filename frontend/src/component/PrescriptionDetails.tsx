import React from 'react';
import { Prescription } from '../types';

interface PrescriptionDetailsProps {
    prescription: Prescription;
    onEdit: () => void;
    onDelete: (id: number) => void;
    onClose: () => void;
}

const PrescriptionDetails: React.FC<PrescriptionDetailsProps> = ({ prescription, onEdit, onDelete, onClose }) => {
    const userRole = localStorage.getItem('role') || 'patient';

    return (
        <div className="bg-white w-full rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 border border-slate-200 shadow-xl">

            {/* --- PRESCRIPTION HEADER --- */}
            <div className="bg-[#556ee6] p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-white/20 rounded-md text-[9px] font-black uppercase tracking-widest backdrop-blur-md">Medical Prescription</span>
                            <span className="px-2 py-0.5 bg-white/10 text-blue-100 rounded-md text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 tracking-widest">Digital Auth Verified</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">Prescription Details</h3>
                        <p className="text-xs text-blue-100/60 font-medium mt-2 italic">Medication Order #{prescription.id?.toString().padStart(4, '0')}</p>
                    </div>
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                </div>

                {/* Decorative background element */}
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute left-1/4 -bottom-12 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
            </div>

            <div className="p-10 space-y-10">

                {/* --- MEDICATION IDENTITY --- */}
                <div className="bg-[#556ee6]/5 p-8 rounded-3xl border border-[#556ee6]/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white text-[#556ee6] flex items-center justify-center font-black text-2xl shadow-sm border border-slate-100 ring-4 ring-[#556ee6]/5">
                            💊
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Active Medication</label>
                            <p className="text-3xl font-black text-[#556ee6] tracking-tight leading-tight">
                                {prescription.medication}
                            </p>
                        </div>
                    </div>
                    <div className="text-center md:text-right bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Issue Date</label>
                        <p className="text-sm font-black text-slate-800">
                            {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* --- CLINICAL DOSAGE GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-2 group hover:bg-white hover:border-[#556ee6]/20 transition-all duration-300">
                        <div className="flex items-center gap-2 text-[#556ee6]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-[10px] font-black uppercase tracking-widest">Dosage</span>
                        </div>
                        <p className="text-lg font-black text-slate-800">{prescription.dosage || 'N/A'}</p>
                    </div>

                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-2 group hover:bg-white hover:border-[#556ee6]/20 transition-all duration-300">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="text-[10px] font-black uppercase tracking-widest">Frequency</span>
                        </div>
                        <p className="text-lg font-black text-slate-800">{prescription.frequency || 'N/A'}</p>
                    </div>

                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-2 group hover:bg-white hover:border-[#556ee6]/20 transition-all duration-300">
                        <div className="flex items-center gap-2 text-orange-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[10px] font-black uppercase tracking-widest">Duration</span>
                        </div>
                        <p className="text-lg font-black text-slate-800">{prescription.duration || 'N/A'}</p>
                    </div>
                </div>

                {/* --- ATTRIBUTION AREA --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-slate-100">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Recipient Patient</label>
                        <p className="font-bold text-slate-700">{prescription.patient_name || `ID: ${prescription.patient}`}</p>
                    </div>
                    <div className="md:text-right space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Authorized Physician</label>
                        <p className="font-bold text-slate-700 italic"> {prescription.doctor_name || `ID: ${prescription.doctor}`}</p>
                    </div>
                </div>

                {/* --- PROFESSIONAL ACTION FOOTER --- */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-200/40">
                        {userRole !== 'patient' ? (
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => prescription.id && onDelete(prescription.id)}
                                    className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-300 text-red-500 font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-red-50 hover:border-red-200 active:scale-95 transition-all shadow-sm"
                                >
                                    Void Order
                                </button>
                                <button
                                    onClick={onEdit}
                                    className="flex-1 sm:flex-none px-10 py-3 bg-[#556ee6] text-white font-bold rounded-xl text-[10px] uppercase tracking-widest shadow-[0_8px_20px_rgba(85,110,230,0.25)] hover:bg-[#485ec4] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Modify Prescription
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04m0 0a11.955 11.955 0 00-3.382 8.356c0 6.627 5.373 12 12 12s12-5.373 12-12c0-3.159-1.223-6.03-3.218-8.158" />
                                    </svg>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Authorized Clinical Record</p>
                                    <p className="text-[9px] text-slate-400 font-medium italic">This medication order is verified. Please contact your physician for changes.</p>
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

export default PrescriptionDetails;
