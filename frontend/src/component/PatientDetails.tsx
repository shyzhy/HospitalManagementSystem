import React, { useState, useEffect } from 'react';
import { Patient, Consultation, Prescription, Treatment } from '../types';
import { getConsultationsByPatient, getPrescriptionsByPatient, getTreatmentsByPatient } from '../api';

interface PatientDetailsProps {
    patient: Patient;
    onEdit: () => void;
    onClose: () => void;
    readOnly?: boolean;
    onViewConsultation?: (consultation: Consultation) => void;
    onViewPrescription?: (prescription: Prescription) => void;
    onViewTreatment?: (treatment: Treatment) => void;
    onAddTreatment?: (patient: Patient) => void;
    onAddPrescription?: (patient: Patient) => void;
}

interface ClinicalRecord {
    id: number;
    date: string;
    type: 'consultation' | 'prescription' | 'treatment';
    title: string;
    subtitle: string;
    original: Consultation | Prescription | Treatment;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ 
    patient, 
    onEdit, 
    onClose, 
    readOnly, 
    onViewConsultation,
    onViewPrescription,
    onViewTreatment,
    onAddTreatment,
    onAddPrescription
}) => {
    const [records, setRecords] = useState<ClinicalRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'consultation' | 'prescription' | 'treatment'>('all');

    useEffect(() => {
        const fetchAllRecords = async () => {
            if (!patient.id) return;
            setLoading(true);
            try {
                const [cons, pres, treats] = await Promise.all([
                    getConsultationsByPatient(patient.id),
                    getPrescriptionsByPatient(patient.id),
                    getTreatmentsByPatient(patient.id)
                ]);

                const combined: ClinicalRecord[] = [
                    ...cons.map(c => ({
                        id: c.id!,
                        date: c.consultation_date,
                        type: 'consultation' as const,
                        title: `Consultation #${c.id?.toString().padStart(4, '0')}`,
                        subtitle: c.doctor_name || 'No Physician Recorded',
                        original: c
                    })),
                    ...pres.map(p => ({
                        id: p.id!,
                        date: p.date_prescribed || '',
                        type: 'prescription' as const,
                        title: `Prescription: ${p.medication}`,
                        subtitle: `By ${p.doctor_name || 'Medical Staff'}`,
                        original: p
                    })),
                    ...treats.map(t => ({
                        id: t.id!,
                        date: t.treatment_date || '',
                        type: 'treatment' as const,
                        title: `Treatment: ${t.treatment_name}`,
                        subtitle: `Supervised by ${t.doctor_name || 'Specialist'}`,
                        original: t
                    }))
                ];

                // Sort by date descending
                combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setRecords(combined);
            } catch (error) {
                console.error("Error fetching clinical history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllRecords();
    }, [patient.id]);

    const handleInspect = (record: ClinicalRecord) => {
        if (record.type === 'consultation') onViewConsultation?.(record.original as Consultation);
        if (record.type === 'prescription') onViewPrescription?.(record.original as Prescription);
        if (record.type === 'treatment') onViewTreatment?.(record.original as Treatment);
    };

    const filteredRecords = activeTab === 'all' 
        ? records 
        : records.filter(r => r.type === activeTab);

    return (
        <div className="bg-white w-full rounded-2xl overflow-hidden animate-in fade-in duration-300">
            
            {/* Header Section */}
            <div className="bg-white px-8 py-6 border-b border-slate-100 flex justify-between items-center relative overflow-hidden">
                <div className="flex items-center gap-5 relative z-10">
                    {(patient.profile_picture_url || patient.profile_picture) ? (
                        <img 
                            src={(patient.profile_picture_url || patient.profile_picture) as string} 
                            alt={`${patient.first_name} ${patient.last_name}`}
                            className="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-inner"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 text-[#556ee6] flex items-center justify-center font-black text-2xl shadow-inner">
                            {patient.first_name?.charAt(0)}{patient.last_name?.charAt(0)}
                        </div>
                    )}
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
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    
                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-6">
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
                                    <p className="text-sm font-bold text-slate-800 underline decoration-slate-200 cursor-pointer hover:text-[#556ee6] transition-colors">{patient.user_details?.email || patient.email || 'No Account Record'}</p>
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

                        {!readOnly && (
                        <div className="pt-4">
                            <button 
                                onClick={onEdit}
                                className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                            >
                                Edit Profile
                            </button>
                        </div>
                        )}
                    </div>

                    {/* Clinical History */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-2">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Track History</h4>
                            
                            {/* Tab Switcher */}
                            <div className="flex bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
                                {(['all', 'consultation', 'prescription', 'treatment'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                                            activeTab === tab 
                                            ? 'bg-white text-[#556ee6] shadow-sm' 
                                            : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        {tab === 'all' ? 'Unified' : tab === 'consultation' ? 'Consults' : tab === 'prescription' ? 'Rx' : 'Treats'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-50/50 rounded-3xl border border-slate-100 overflow-hidden">
                            {loading ? (
                                <div className="p-8 text-center space-y-3">
                                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-[#556ee6] border-t-transparent"></div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synchronizing clinical data...</p>
                                </div>
                            ) : filteredRecords.length === 0 ? (
                                <div className="p-12 text-center space-y-2">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-200 mx-auto border border-slate-100 shadow-sm mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 4-8-4" /></svg>
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No clinical records found.</p>
                                    <p className="text-[10px] text-slate-300 font-medium">Try switching tabs or add a new record below.</p>
                                </div>
                            ) : (
                                <div className="max-h-[360px] overflow-y-auto">
                                    {filteredRecords.map(record => (
                                        <div 
                                            key={`${record.type}-${record.id}`} 
                                            className="p-5 border-b border-slate-100 last:border-0 hover:bg-white transition-colors flex justify-between items-center group cursor-pointer"
                                            onClick={() => handleInspect(record)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${
                                                    record.type === 'consultation' ? 'bg-blue-50 text-[#556ee6] border-blue-100/50' : 
                                                    record.type === 'prescription' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 
                                                    'bg-purple-50 text-purple-600 border-purple-100/50'
                                                }`}>
                                                    {record.type === 'consultation' && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 00-2-2V6a2 2 0 002-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                                    )}
                                                    {record.type === 'prescription' && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                                    )}
                                                    {record.type === 'treatment' && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[12px] font-bold text-slate-800 leading-tight">{record.title}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1.5 flex items-center gap-2">
                                                        <span className="text-[#556ee6]">{record.date ? new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending'}</span>
                                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                        <span>{record.subtitle}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <button 
                                                className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#556ee6] hover:text-white transition-all shadow-sm active:scale-95"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleInspect(record);
                                                }}
                                            >
                                                Inspect
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Clinical Actions & Status */}
                        {!readOnly && (
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <button 
                                onClick={() => onAddPrescription?.(patient)}
                                className="flex-1 py-4 bg-white border border-slate-200 text-emerald-600 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-emerald-50 hover:border-emerald-100 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.98]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                New Prescription
                            </button>
                            <button 
                                onClick={() => onAddTreatment?.(patient)}
                                className="flex-1 py-4 bg-[#556ee6] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-[#556ee6]/20 hover:bg-[#485ec4] hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                Start Treatment Plan
                            </button>
                        </div>
                        )}
                    </div>
                </div>

                {/* Patient Footer Actions */}
                <div className="pt-10 border-t border-slate-100 flex justify-center">
                    <button 
                        onClick={onClose} 
                        className="py-4 px-12 bg-slate-50 text-slate-400 font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] hover:bg-slate-100 hover:text-slate-500 transition-all text-center flex items-center justify-center gap-3 active:scale-95 border border-transparent hover:border-slate-200/50"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Exit Record
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;
