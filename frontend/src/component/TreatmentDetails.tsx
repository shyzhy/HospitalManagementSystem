import React from 'react';
import { Treatment } from '../types';

interface TreatmentDetailsProps {
    treatment: Treatment;
    onEdit: () => void;
    onDelete: (id: number) => void;
    onClose: () => void;
}

const TreatmentDetails: React.FC<TreatmentDetailsProps> = ({ treatment, onEdit, onDelete, onClose }) => {
    const userRole = localStorage.getItem('role') || 'patient';

    return (
        <div className="bg-white w-full rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 border border-slate-200">

            {/* Header Section - Modern Minimalist */}
            <div className="bg-white p-8 border-b border-slate-100 relative overflow-hidden flex justify-between items-center">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-black uppercase tracking-widest border border-emerald-100">Clinical Procedure</span>
                        <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md text-[9px] font-black uppercase tracking-widest border border-slate-200">System Record</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Treatment Plan Details</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-[0.2em]">MedFlow &gt; Clinical Documentation</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-emerald-600 shadow-sm relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
            </div>

            <div className="p-10 space-y-10">

                {/* Identification & Metadata Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Patient Identification Card */}
                    <div className="lg:col-span-2 bg-slate-50/50 rounded-3xl p-8 border border-slate-100 flex items-center gap-6">
                        {treatment.patient_profile_picture_url ? (
                            <img
                                src={treatment.patient_profile_picture_url}
                                alt={treatment.patient_name}
                                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-white border border-slate-200 text-emerald-600 flex items-center justify-center font-black text-2xl shadow-sm">
                                {treatment.patient_name?.charAt(0) || 'P'}
                            </div>
                        )}
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Patient</p>
                            <p className="text-2xl font-bold text-slate-800 tracking-tight leading-none">
                                {treatment.patient_name || 'Anonymous Patient'}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">INTERNAL ID: #{treatment.patient}</span>
                                <span className="text-[10px] font-bold text-slate-400">Verified Identity.</span>
                            </div>
                        </div>
                    </div>

                    {/* Meta Info Card */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-slate-200">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Clinical ID</p>
                            <p className="text-xl font-bold font-mono tracking-tighter text-emerald-400">#TRT-{treatment.id?.toString().padStart(4, '0')}</p>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Assignment Date</p>
                                <p className="text-sm font-bold">{treatment.treatment_date ? new Date(treatment.treatment_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Status</p>
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Procedure Specifics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Designated Procedure</h4>
                        </div>
                        <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-emerald-100 transition-colors">
                            <p className="text-xl font-bold text-slate-800 tracking-tight leading-relaxed">
                                {treatment.treatment_name}
                            </p>
                            <div className="mt-4 flex items-center gap-3 pt-4 border-t border-slate-50">
                                {treatment.doctor_profile_picture_url ? (
                                    <img src={treatment.doctor_profile_picture_url} className="w-6 h-6 rounded-full object-cover" alt="doctor" />
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">D</div>
                                )}
                                <span className="text-[11px] font-bold text-slate-500">Authorized by {treatment.doctor_name}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-slate-300 rounded-full"></div>
                            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Clinical Protocol</h4>
                        </div>
                        <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-3xl min-h-[160px]">
                            <p className="text-[13px] text-slate-600 font-medium leading-relaxed italic whitespace-pre-wrap">
                                {treatment.description || 'Detailed clinical procedural notes are pending for this treatment record.'}
                            </p>
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
                                    onClick={() => treatment.id && onDelete(treatment.id)}
                                    className="px-6 py-3.5 bg-white border border-slate-200 text-red-500 font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-red-50 hover:border-red-100 active:scale-95 transition-all"
                                >
                                    Void Plan
                                </button>
                                <button
                                    onClick={onEdit}
                                    className="px-10 py-3.5 bg-emerald-600 text-white font-bold rounded-xl text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    Update Documentation
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TreatmentDetails;
