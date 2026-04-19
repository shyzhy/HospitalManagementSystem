import React from 'react';
import { MedicalRecord } from '../types';

interface MedicalRecordDetailsProps {
    record: MedicalRecord;
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
}

const MedicalRecordDetails: React.FC<MedicalRecordDetailsProps> = ({ record, onEdit, onDelete, onClose }) => {
    return (
        <div className="bg-white w-full rounded-2xl overflow-hidden animate-in fade-in duration-300">
            
            {/* Header Section - Inline Version */}
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-lg font-bold text-slate-800 leading-none">Medical Profile</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest italic">Confidential Clinical History</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm text-[#556ee6] relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
            </div>

            <div className="p-10 space-y-8">
                {/* Primary Info Area */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Identity</label>
                        <p className="text-3xl font-black text-[#556ee6] tracking-tight leading-tight">
                            {record.patient_name || 'Anonymous Patient'}
                        </p>
                    </div>
                    <div className="text-right">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Blood Type</label>
                         <span className="px-4 py-2 bg-red-50 text-red-600 rounded-full font-black text-lg border border-red-100 shadow-sm">
                            {record.blood_type || 'N/A'}
                         </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 bg-slate-50/80 p-6 rounded-3xl border border-slate-100">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Emergency Contact</label>
                        <p className="text-sm font-bold text-slate-800">
                            {record.emergency_contact_name || 'None Registered'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Primary Phone</label>
                        <p className="text-sm font-black text-[#556ee6] font-mono tracking-tighter">
                            {record.emergency_contact_phone || 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Clinical Summaries */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                            Known Allergies
                        </h4>
                        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm text-slate-600 font-medium leading-relaxed italic">
                            {record.allergies || 'No allergies recorded in system.'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#556ee6]"></span>
                                Chronic Conditions
                            </h4>
                            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm text-slate-700 font-bold leading-relaxed min-h-[100px]">
                                {record.chronic_conditions || 'No chronic conditions listed.'}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                Clinical History & Notes
                            </h4>
                            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm text-slate-600 font-medium leading-relaxed min-h-[100px]">
                                {record.medical_history || 'No established medical history records.'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attachment Link */}
                {record.attachment && (
                     <div className="pt-2">
                        <a 
                            href={typeof record.attachment === 'string' ? record.attachment : '#'} 
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-center gap-3 p-4 bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl transition-all group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#556ee6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span className="text-xs font-black text-slate-700 uppercase tracking-widest group-hover:text-[#556ee6]">View Clinical Attachment</span>
                        </a>
                    </div>
                )}

                {/* Professional Action Footer */}
                <div className="space-y-3 pt-6 border-t border-slate-100">
                    <div className="flex gap-4 flex-row-reverse">
                        <button 
                            onClick={onEdit}
                            className="px-8 py-3.5 bg-[#556ee6] text-white font-bold rounded-lg text-[11px] uppercase tracking-widest shadow-[0_8px_20px_rgba(85,110,230,0.15)] hover:bg-[#485ec4] active:scale-95 transition-all"
                        >
                            Modify Profile
                        </button>
                        <button 
                            onClick={onDelete}
                            className="px-6 py-3.5 bg-white border border-slate-200 text-red-500 font-bold rounded-lg text-[11px] uppercase tracking-widest hover:bg-red-50 active:scale-95 transition-all"
                        >
                            Void Record
                        </button>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-full py-3.5 bg-slate-50 text-slate-400 font-bold rounded-lg text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all text-center"
                    >
                        Return to Repository
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MedicalRecordDetails;
