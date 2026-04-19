import React, { useState } from 'react';
import { Patient } from '../types';
import PatientForm from './PatientForm';

interface PatientProfileProps {
    patient: Patient | undefined;
    onUpdate: () => void;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ patient, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);

    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-slate-200 animate-pulse">
                <div className="w-20 h-20 bg-slate-100 rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-slate-100 rounded mb-2"></div>
                <div className="h-3 w-32 bg-slate-50 rounded"></div>
            </div>
        );
    }

    const initials = `${patient.first_name?.charAt(0) || ''}${patient.last_name?.charAt(0) || ''}`;

    const handleUpdateSuccess = () => {
        setIsEditing(false);
        onUpdate();
    };

    if (isEditing) {
        return (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 flex items-center justify-between px-2">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Update Account</h2>
                        <p className="text-xs text-slate-500 font-medium">Modify your clinical and security details.</p>
                    </div>
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                </div>
                <PatientForm patient={patient} onSubmit={handleUpdateSuccess} onCancel={() => setIsEditing(false)} isInline={true} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pt-6 animate-in fade-in zoom-in-95 duration-700">
            {/* --- PREMIUM DASHBOARD HEADER --- */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden relative mb-10">
                
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50"></div>

                <div className="p-12 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-10">
                        {/* Avatar Section */}
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-emerald-400 p-1.5 shadow-2xl shadow-emerald-200/50">
                                <div className="w-full h-full rounded-[2.2rem] bg-white flex items-center justify-center font-black text-5xl text-emerald-600 tracking-tighter">
                                    {initials}
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 p-4 bg-emerald-600 text-white rounded-3xl shadow-xl border-4 border-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944a11.955 11.955 0 01-8.618 3.04m0 0a11.955 11.955 0 00-3.382 8.356c0 6.627 5.373 12 12 12s12-5.373 12-12c0-3.159-1.223-6.03-3.218-8.158" />
                                </svg>
                            </div>
                        </div>

                        {/* Name & Quick Info */}
                        <div className="flex-1 text-center lg:text-left space-y-4">
                            <div>
                                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">Active Patient Record</span>
                                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">ID: #{patient.id?.toString().padStart(4, '0')}</span>
                                </div>
                                <h1 className="text-5xl font-black text-slate-800 tracking-tighter leading-none mb-2">
                                    {patient.first_name} {patient.last_name}
                                </h1>
                                <p className="text-slate-400 font-medium italic text-lg">{patient.address || 'No primary residence recorded.'}</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Date of Birth</p>
                                        <p className="text-sm font-bold text-slate-700">{patient.dob ? new Date(patient.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-slate-100 hidden sm:block"></div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Biological Gender</p>
                                        <p className="text-sm font-bold text-slate-700">{patient.gender === 'M' ? 'Male' : (patient.gender === 'F' ? 'Female' : 'Other')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Action */}
                        <div className="lg:border-l border-slate-100 lg:pl-10">
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="px-10 py-5 bg-slate-800 text-white font-black rounded-3xl text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-slate-900 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
                            >
                                Edit Profile
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DASHBOARD CONTENT GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* Contact Hub Card */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">Contact Information</h3>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Verified Connection Details</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="group">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Primary Phone</label>
                            <p className="text-2xl font-black text-[#556ee6] font-mono tracking-tighter group-hover:translate-x-1 transition-transform">{patient.phone || 'N/A'}</p>
                        </div>
                        <div className="h-px bg-slate-50"></div>
                        <div className="group">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">System Account Username</label>
                            <p className="text-lg font-bold text-slate-700 italic group-hover:translate-x-1 transition-transform">@{patient.user_details?.username || 'No-Account'}</p>
                        </div>
                    </div>
                </div>

                {/* Account Security Card */}
                <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-900/10 text-white space-y-8 relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                    <div className="flex items-center gap-4 relative z-10 border-b border-white/10 pb-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center backdrop-blur-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight uppercase">Account Security</h3>
                            <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Credential Management</p>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                            <p className="text-xs text-white/60 leading-relaxed mb-4 italic">
                                To ensure your medical records remain private, we recommend changing your password regularly and using complex characters.
                            </p>
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                            >
                                Secure My Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Assurance */}
            <div className="mt-12 text-center p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    MedFlow Clinical Ledger • Verified Digital Identity
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </p>
            </div>
        </div>
    );
};

export default PatientProfile;
