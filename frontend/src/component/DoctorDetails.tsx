import React from 'react';
import { Doctor } from '../types';

interface DoctorDetailsProps {
    doctor: Doctor;
    onEdit: () => void;
    onClose: () => void;
}

const DoctorDetails: React.FC<DoctorDetailsProps> = ({ doctor, onEdit, onClose }) => {
    const initials = `${doctor.first_name?.charAt(0) || ''}${doctor.last_name?.charAt(0) || ''}`;

    return (
        <div className="bg-white w-full rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in-95 duration-500 shadow-sm border border-slate-100">
            
            {/* --- CLINICAL IDENTIFIER HEADER --- */}
            <div className="bg-slate-50/50 p-10 border-b border-slate-100 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#4e5ec4]/5 to-transparent pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-[1.8rem] bg-gradient-to-br from-[#4e5ec4] to-[#3a47a1] p-1 shadow-xl shadow-[#4e5ec4]/20">
                            <div className="w-full h-full rounded-[1.6rem] bg-white flex items-center justify-center font-black text-2xl text-[#4e5ec4] tracking-tighter">
                                {initials}
                            </div>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg border-2 border-white shadow-md ${doctor.is_available ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                    </div>

                    <div className="text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                             <span className="px-3 py-1 bg-[#4e5ec4] text-white rounded-full text-[9px] font-black uppercase tracking-widest">Medical Specialist</span>
                             <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${doctor.is_available ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                {doctor.is_available ? 'Active Status' : 'On Leave'}
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter leading-none mb-1">
                            Dr. {doctor.first_name} {doctor.last_name}
                        </h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{doctor.specialization} • Verified Clinician</p>
                    </div>

                    <div className="md:ml-auto flex items-center gap-3">
                         <div className="text-right hidden lg:block mr-4">
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Electronic ID</p>
                            <p className="text-xs font-mono font-bold text-slate-400">#DOC-{doctor.id?.toString().padStart(4, '0')}</p>
                         </div>
                         <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-[#4e5ec4]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04a11.955 11.955 0 01-8.618 3.04m0 0a11.955 11.955 0 00-3.382 8.356c0 6.627 5.373 12 12 12s12-5.373 12-12c0-3.159-1.223-6.03-3.218-8.158" />
                            </svg>
                         </div>
                    </div>
                </div>
            </div>

            {/* --- DETAILS GRID --- */}
            <div className="p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    
                    {/* Professional Credentials Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
                            <span className="w-1.5 h-6 bg-[#4e5ec4] rounded-full"></span>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Professional Standing</h4>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50/50 transition-colors group">
                                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-[#4e5ec4]/10 group-hover:text-[#4e5ec4] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm5 3h1a1 1 0 011 1v1H7v-1a1 1 0 011-1h1z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Medical License Number</p>
                                    <p className="text-base font-black text-slate-800 font-mono italic tracking-tight uppercase">{doctor.license_number}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50/50 transition-colors group">
                                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-[#4e5ec4]/10 group-hover:text-[#4e5ec4] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Assigned Specialization</p>
                                    <p className="text-base font-bold text-slate-700 leading-tight">Expert practitioner in <span className="text-[#4e5ec4]">{doctor.specialization}</span>.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registry Status Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
                            <span className="w-1.5 h-6 bg-emerald-400 rounded-full"></span>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Status</h4>
                        </div>
                        
                        <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Credentialed Access</p>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                                This physician is a verified member of the MedFlow clinical network. Their medical standing is currently active and all consultations are synchronized with our core records.
                            </p>
                            <div className="pt-2">
                                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${doctor.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {doctor.is_available ? 'Ready for Consultation' : 'Temporarily Unavailable'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- ADMINISTRATIVE ACTIONS --- */}
                <div className="pt-10 border-t border-slate-50 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 flex-row-reverse">
                        <button 
                            onClick={onEdit}
                            className="flex-1 sm:flex-none px-12 py-4 bg-slate-800 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-900 active:scale-95 transition-all text-center"
                        >
                            Modify Specialty Profile
                        </button>
                        <button 
                            onClick={onClose} 
                            className="flex-1 sm:flex-none px-8 py-4 bg-slate-100 text-slate-400 font-bold rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all text-center flex items-center justify-center gap-2"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Master List
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;
