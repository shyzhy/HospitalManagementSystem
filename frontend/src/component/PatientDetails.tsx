import React from 'react';
import { Patient } from '../types';

interface PatientDetailsProps {
    patient: Patient;
    onEdit: () => void;
    onClose: () => void;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patient, onEdit, onClose }) => {
    return (
        <div className="bg-white w-full rounded-2xl overflow-hidden animate-in fade-in duration-300">
            
            {/* Header Section */}
            <div className="bg-white px-8 py-6 border-b border-slate-100 flex justify-between items-center relative overflow-hidden">
                <div className="flex items-center gap-5 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 text-[#556ee6] flex items-center justify-center font-black text-2xl shadow-inner">
                        {patient.first_name?.charAt(0)}{patient.last_name?.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 leading-none">
                            {patient.first_name} {patient.last_name}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest italic">Electronic Patient Record</p>
                    </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[#556ee6] relative z-10">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            </div>

            <div className="p-10 space-y-10">
                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Civil Identity & Contact</h4>
                        
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Account Identity</p>
                                    <p className="text-sm font-bold text-slate-800 underline decoration-slate-200 cursor-pointer hover:text-[#556ee6] transition-colors">{patient.user_details?.username || patient.username || 'No Account Record'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                                    <p className="text-sm font-black text-[#556ee6] font-mono tracking-tighter">{patient.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Residential Address</p>
                                    <p className="text-sm font-bold text-slate-600 italic line-clamp-2 leading-relaxed">{patient.address || 'No primary residence recorded.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats / Bio */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Medical Status Summary</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 text-center space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient ID</p>
                                <p className="text-xl font-black text-slate-800">#{patient.id?.toString().padStart(4, '0')}</p>
                            </div>
                            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 text-center space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultations</p>
                                <p className="text-xl font-black text-[#556ee6]">History</p>
                            </div>
                        </div>
                        <div className="p-6 bg-[#556ee6]/5 border border-[#556ee6]/10 rounded-3xl space-y-3">
                             <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#556ee6] animate-pulse"></div>
                                <p className="text-[10px] font-black text-[#556ee6] uppercase tracking-widest">Active Clinical Track</p>
                             </div>
                             <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                                This patient is currently being managed under active clinical observation. All treatments and prescriptions are synchronized with their primary digital record.
                             </p>
                        </div>
                    </div>
                </div>

                {/* Patient Footer Actions */}
                <div className="space-y-3 pt-10 border-t border-slate-100">
                    <div className="flex gap-4 flex-row-reverse">
                        <button 
                            onClick={onEdit}
                            className="px-8 py-3.5 bg-[#556ee6] text-white font-bold rounded-lg text-[11px] uppercase tracking-widest shadow-[0_8px_20px_rgba(85,110,230,0.15)] hover:bg-[#485ec4] active:scale-95 transition-all"
                        >
                            Modify Basic Profile
                        </button>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-full py-3.5 bg-slate-50 text-slate-400 font-bold rounded-lg text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all text-center flex items-center justify-center gap-2"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Directory
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;
