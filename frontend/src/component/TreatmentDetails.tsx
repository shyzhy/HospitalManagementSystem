import React from 'react';
import { Treatment } from '../types';

interface TreatmentDetailsProps {
    treatment: Treatment;
    onEdit: () => void;
    onDelete: (id: number) => void;
    onClose: () => void;
}

const TreatmentDetails: React.FC<TreatmentDetailsProps> = ({ treatment, onEdit, onDelete, onClose }) => {
    return (
        <div className="bg-white w-full rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 border border-slate-200 shadow-xl">
            
            {/* Header Section */}
            <div className="bg-emerald-600 p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <span className="px-2 py-0.5 bg-white/20 rounded-md text-[9px] font-black uppercase tracking-widest backdrop-blur-md">Clinical Procedure</span>
                             <span className="px-2 py-0.5 bg-white/10 text-emerald-100 rounded-md text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10">Active Treatment Plan</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">Treatment Details</h3>
                        <p className="text-xs text-emerald-100/60 font-medium mt-2 italic shadow-sm">Procedural Record #{treatment.id?.toString().padStart(4, '0')}</p>
                    </div>
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                </div>
                
                {/* Decorative background element */}
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute left-1/4 -bottom-12 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl"></div>
            </div>

            <div className="p-10 space-y-10">
                
                {/* Primary Info Area */}
                <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                    {/* Patient Identification Card */}
                    <div className="flex-1 bg-slate-50/80 rounded-3xl p-6 border border-slate-100 flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-slate-200 text-emerald-600 flex items-center justify-center font-black text-3xl font-mono">
                            {treatment.patient_name?.charAt(0) || 'P'}
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Patient Assignment</label>
                            <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                                {treatment.patient_name || 'Anonymous Patient'}
                            </p>
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded leading-none">ID: #{treatment.patient}</span>
                        </div>
                    </div>

                    {/* Procedure Metadata Card */}
                    <div className="lg:w-1/3 bg-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-lg shadow-slate-200/50">
                        <div className="flex justify-between items-end border-b border-white/10 pb-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Enrollment Date</label>
                                <p className="text-lg font-black text-emerald-400">
                                    {treatment.treatment_date ? new Date(treatment.treatment_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block whitespace-nowrap">Clinical ID</span>
                                <span className="text-sm font-black font-mono tracking-tighter">#TRT-{treatment.id?.toString().padStart(4, '0')}</span>
                            </div>
                        </div>
                        <div className="pt-1">
                            <label className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1">Prescribing Physician</label>
                            <p className="text-sm font-bold text-white/90 truncate italic">Dr. {treatment.doctor_name}</p>
                        </div>
                    </div>
                </div>

                {/* Procedure Specifics */}
                <div className="space-y-8">
                    <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100/50 text-emerald-600 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Procedure / Plan Name</h4>
                        </div>
                        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
                            <p className="text-xl font-black text-slate-800 tracking-tight">{treatment.treatment_name}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Clinical Instructions & Plan Detail
                        </h4>
                        <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-3xl text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap italic">
                            {treatment.description || 'Detailed clinical procedural notes are pending for this treatment record.'}
                        </div>
                    </div>
                </div>

                {/* Professional Footer Actions */}
                <div className="space-y-4 pt-8 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-200/40">
                         <div className="flex gap-3 w-full sm:w-auto">
                            <button 
                                onClick={() => treatment.id && onDelete(treatment.id)}
                                className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-300 text-red-500 font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-red-50 hover:border-red-200 active:scale-95 transition-all shadow-sm"
                            >
                                Void Record
                            </button>
                            <button 
                                onClick={onEdit}
                                className="flex-1 sm:flex-none px-10 py-3 bg-emerald-600 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest shadow-[0_8px_20px_rgba(5,150,105,0.2)] hover:bg-emerald-700 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modify Plan
                            </button>
                         </div>
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

export default TreatmentDetails;
