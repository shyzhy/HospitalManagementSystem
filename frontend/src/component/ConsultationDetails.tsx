import React from 'react';
import { Consultation } from '../types';

interface ConsultationDetailsProps {
    consultation: Consultation;
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
}

const ConsultationDetails: React.FC<ConsultationDetailsProps> = ({ consultation, onEdit, onDelete, onClose }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-left">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white animate-in fade-in zoom-in duration-200">
                
                {/* Header Section */}
                <div className="bg-purple-600 p-8 text-white flex justify-between items-center">
                    <h3 className="text-xl font-black uppercase tracking-widest">Consultation Details</h3>
                    <button onClick={onClose} className="text-white/70 hover:text-white text-3xl font-light leading-none">&times;</button>
                </div>

                <div className="p-10 space-y-8">
                    {/* Patient Name */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient</label>
                        <p className="text-2xl font-black text-purple-600 tracking-tight leading-tight">
                            {consultation.patient_name || 'Unknown Patient'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Consultation Date */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</label>
                            <p className="text-lg font-bold text-slate-700">
                                {consultation.consultation_date ? new Date(consultation.consultation_date).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        {/* Attending Physician */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Physician</label>
                            <p className="text-sm font-bold text-slate-600 italic">
                                {consultation.doctor_name || 'Not assigned'}
                            </p>
                        </div>
                    </div>

                    {/* Diagnosis / Symptoms Box */}
                    <div className="space-y-4">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Diagnosis</label>
                            <p className="text-slate-700 font-bold leading-relaxed">
                                {consultation.diagnosis || <span className="text-slate-300 italic">No diagnosis recorded</span>}
                            </p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Symptoms / Notes</label>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                {consultation.symptoms || <span className="text-slate-300 italic">No symptom notes</span>}
                            </p>
                        </div>
                    </div>

                    {/* Action Footer Buttons */}
                    <div className="space-y-3 pt-4">
                        <div className="flex gap-3">
                            <button 
                                onClick={onEdit}
                                className="flex-1 py-4 bg-emerald-500 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-100 hover:bg-emerald-600 active:scale-95 transition-all"
                            >
                                Edit Record
                            </button>
                            <button 
                                onClick={onDelete}
                                className="flex-1 py-4 bg-red-50 text-red-500 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-red-100 active:scale-95 transition-all"
                            >
                                Remove
                            </button>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="w-full py-4 bg-white border-2 border-slate-100 text-slate-400 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultationDetails;