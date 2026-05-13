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
        <div className="bg-white w-full rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 border border-slate-200">

            {/* Header Section - Modern Minimalist */}
            <div className="bg-white p-8 border-b border-slate-100 relative overflow-hidden flex justify-between items-center">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                         <span className="px-2 py-0.5 bg-[#556ee6]/5 text-[#556ee6] rounded-md text-[9px] font-black uppercase tracking-widest border border-[#556ee6]/10">Medical Order</span>
                         <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md text-[9px] font-black uppercase tracking-widest border border-slate-200">Verified Authorization</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Prescription Documentation</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-[0.2em]">MedFlow &gt; Pharmacy Dispatch</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[#556ee6] shadow-sm relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
            </div>

            <div className="p-10 space-y-10">

                {/* Patient & Metadata Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Patient Identification Card */}
                    <div className="lg:col-span-2 bg-slate-50/50 rounded-3xl p-8 border border-slate-100 flex items-center gap-6">
                        {prescription.patient_profile_picture_url ? (
                            <img 
                                src={prescription.patient_profile_picture_url} 
                                alt={prescription.patient_name}
                                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-white border border-slate-200 text-[#556ee6] flex items-center justify-center font-black text-2xl shadow-sm">
                                {prescription.patient_name?.charAt(0) || 'P'}
                            </div>
                        )}
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient Patient</p>
                            <p className="text-2xl font-bold text-slate-800 tracking-tight leading-none">
                                {prescription.patient_name || 'Anonymous Patient'}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] font-bold text-[#556ee6] bg-[#556ee6]/5 px-2 py-0.5 rounded border border-[#556ee6]/10">ID: #{prescription.patient}</span>
                                <span className="text-[10px] font-bold text-slate-400">Clinical Verification Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Metadata */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-slate-200">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Order Ref</p>
                            <p className="text-xl font-bold font-mono tracking-tighter text-[#556ee6]">#RX-{prescription.id?.toString().padStart(4, '0')}</p>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Authorized On</p>
                                <p className="text-sm font-bold">{prescription.date_prescribed ? new Date(prescription.date_prescribed).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Physician</p>
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{prescription.doctor_name}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Medication Details Area */}
                <div className="space-y-8">
                    <div className="p-8 bg-[#556ee6]/5 rounded-3xl border border-[#556ee6]/10 flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm border border-slate-100">💊</div>
                        <div>
                            <p className="text-[10px] font-black text-[#556ee6] uppercase tracking-widest mb-1">Active Medication</p>
                            <h4 className="text-2xl font-bold text-slate-800">{prescription.medication}</h4>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-2 group hover:bg-white hover:border-[#556ee6]/20 transition-all duration-300">
                            <div className="flex items-center gap-2 text-[#556ee6]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="text-[10px] font-black uppercase tracking-widest">Dosage</span>
                            </div>
                            <p className="text-lg font-bold text-slate-800">{prescription.dosage || 'N/A'}</p>
                        </div>

                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-2 group hover:bg-white hover:border-[#556ee6]/20 transition-all duration-300">
                            <div className="flex items-center gap-2 text-emerald-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                <span className="text-[10px] font-black uppercase tracking-widest">Frequency</span>
                            </div>
                            <p className="text-lg font-bold text-slate-800">{prescription.frequency || 'N/A'}</p>
                        </div>

                        <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-2 group hover:bg-white hover:border-[#556ee6]/20 transition-all duration-300">
                            <div className="flex items-center gap-2 text-orange-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span className="text-[10px] font-black uppercase tracking-widest">Duration</span>
                            </div>
                            <p className="text-lg font-bold text-slate-800">{prescription.duration || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="space-y-4 pt-10 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <button 
                            onClick={onClose} 
                            className="w-full sm:w-auto py-3.5 px-8 text-slate-400 font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Return to Directory
                        </button>

                        {userRole !== 'patient' && (
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => prescription.id && onDelete(prescription.id)}
                                    className="px-6 py-3.5 bg-white border border-slate-200 text-red-500 font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-red-50 hover:border-red-100 active:scale-95 transition-all"
                                >
                                    Void Order
                                </button>
                                <button
                                    onClick={onEdit}
                                    className="px-10 py-3.5 bg-[#556ee6] text-white font-bold rounded-xl text-[11px] uppercase tracking-widest shadow-lg shadow-[#556ee6]/20 hover:bg-[#485ec4] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    Update Order
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionDetails;
