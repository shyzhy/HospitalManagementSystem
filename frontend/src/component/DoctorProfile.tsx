import React, { useState } from 'react';
import { Doctor } from '../types';
import DoctorForm from './DoctorForm';

interface DoctorProfileProps {
    doctor: Doctor | undefined;
    onUpdate: (updatedDoctor: Doctor) => void;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ doctor, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);

    if (!doctor) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[3rem] border border-slate-100 animate-pulse transition-all">
                <div className="w-24 h-24 bg-slate-50 rounded-full mb-6 shadow-inner"></div>
                <div className="h-5 w-64 bg-slate-50 rounded-lg mb-3"></div>
                <div className="h-3 w-40 bg-slate-50/50 rounded-lg"></div>
            </div>
        );
    }

    const initials = `${doctor.first_name?.charAt(0) || ''}${doctor.last_name?.charAt(0) || ''}`;

    const handleUpdateSuccess = (updatedDoctor: Doctor) => {
        setIsEditing(false);
        onUpdate(updatedDoctor);
    };

    if (isEditing) {
        return (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                <div className="mb-8 flex items-center justify-between px-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase leading-none">Credential Management</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Physician Workstation • Internal Registry</p>
                    </div>
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2.5 bg-slate-100 text-slate-500 font-bold rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 border border-slate-200"
                    >
                        Dismiss
                    </button>
                </div>
                <DoctorForm doctor={doctor} onSubmit={handleUpdateSuccess} onCancel={() => setIsEditing(false)} isInline={true} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pt-6 animate-in fade-in zoom-in-95 duration-700 pb-20">
            {/* --- PHYSICIAN HERO SECTION --- */}
            <div className="bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden relative mb-12">
                
                {/* Brand Decorative Background */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#4e5ec4]/5 to-transparent pointer-events-none"></div>
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#4e5ec4]/5 rounded-full blur-3xl opacity-30"></div>

                <div className="p-12 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Avatar Section */}
                        <div className="relative group">
                            <div className="w-44 h-44 rounded-[3rem] bg-gradient-to-br from-[#4e5ec4] to-[#3a47a1] p-1.5 shadow-2xl shadow-[#4e5ec4]/30">
                                <div className="w-full h-full rounded-[2.8rem] bg-white flex items-center justify-center font-black text-5xl text-[#4e5ec4] tracking-tighter">
                                    {initials}
                                </div>
                            </div>
                            <div className={`absolute -bottom-2 -right-2 p-4 rounded-[1.5rem] shadow-xl border-4 border-white transition-all transform ${doctor.is_available ? 'bg-emerald-500 scale-110' : 'bg-amber-500 scale-100'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={doctor.is_available ? "M5 13l4 4L19 7" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
                                </svg>
                            </div>
                        </div>

                        {/* Professional Identity */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                                <span className="px-4 py-1.5 bg-[#4e5ec4] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#4e5ec4]/20">Clinical Specialist</span>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${doctor.is_available ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                    {doctor.is_available ? 'On Duty' : 'Away'}
                                </span>
                            </div>
                            
                            <h1 className="text-5xl lg:text-6xl font-black text-slate-800 tracking-tighter leading-tight mb-4">
                                Dr. {doctor.first_name} {doctor.last_name}
                            </h1>
                            
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 text-[#4e5ec4] flex items-center justify-center shadow-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.727 2.182a2 2 0 00.355 2.183l1.812 1.812a2 2 0 002.828 0l2.182-2.182a2 2 0 000-2.828l-1.081-1.081z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9A4 4 0 1012 1a4 4 0 000 8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Specialization</p>
                                        <p className="text-base font-bold text-slate-700 tracking-tight italic">{doctor.specialization}</p>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-slate-100 hidden md:block"></div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center shadow-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04a11.955 11.955 0 01-8.618 3.04m0 0a11.955 11.955 0 00-3.382 8.356c0 6.627 5.373 12 12 12s12-5.373 12-12c0-3.159-1.223-6.03-3.218-8.158" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">License Status</p>
                                        <p className="text-base font-bold text-slate-700 tracking-tight uppercase font-mono">{doctor.license_number}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Action */}
                        <div className="lg:border-l border-slate-100 lg:pl-12 flex flex-col gap-4">
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="px-12 py-5 bg-slate-800 text-white font-black rounded-[2rem] text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-slate-900 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 whitespace-nowrap"
                            >
                                Edit Credentials
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CLINICAL WORKSTATION GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* System Access Card */}
                <div className="bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl shadow-slate-900/20 text-white flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#4e5ec4]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center backdrop-blur-md shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight uppercase">System Security</h3>
                                <p className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase mt-1">Access Protocol • @{doctor.username}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-white/[0.07] transition-all">
                                <p className="text-xs text-white/50 leading-relaxed mb-6 italic">
                                    Keep your clinical credentials secure. Multi-factor authentication is recommended for all medical specialist accounts.
                                </p>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95 shadow-xl"
                                >
                                    Rotate Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Standing Card */}
                <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Clinical Summary</h3>
                                <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">Verified Medical Registry</p>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="group">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Specialization Scope</label>
                                <div className="flex items-center gap-4">
                                    <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <p className="text-2xl font-black text-slate-800 tracking-tighter group-hover:translate-x-2 transition-transform">{doctor.specialization}</p>
                                </div>
                            </div>
                            <div className="h-px bg-slate-50"></div>
                            <div className="group">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Registry Designation</label>
                                <div className="flex items-center gap-4">
                                     <div className="h-1.5 w-1.5 bg-slate-300 rounded-full"></div>
                                     <p className="text-xl font-black text-[#4e5ec4] font-mono tracking-tight group-hover:translate-x-2 transition-transform italic">#{doctor.license_number}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 flex items-center gap-3">
                         <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Credentials Verified</span>
                    </div>
                </div>
            </div>

            {/* Workplace Assurance */}
            <div className="mt-16 text-center p-10 bg-slate-50/50 rounded-[3rem] border border-slate-100/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] flex items-center justify-center gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4e5ec4]"></span>
                    MedFlow Clinical Network • Physician Workstation v2.0
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4e5ec4]"></span>
                </p>
            </div>
        </div>
    );
};

export default DoctorProfile;
