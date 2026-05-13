import React, { useState } from 'react';
import DoctorList from '../component/DoctorList';
import DoctorForm from '../component/DoctorForm';
import DoctorDetails from '../component/DoctorDetails';
import { deleteDoctor } from '../api';
import { Doctor } from '../types';

interface DoctorsViewProps {
  doctors: Doctor[];
  onRefresh: () => void;
}

const DoctorsView: React.FC<DoctorsViewProps> = ({ doctors, onRefresh }) => {
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showDoctorDetails, setShowDoctorDetails] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  return (
    <div className={showDoctorDetails || showDoctorForm ? "bg-white rounded-xl shadow-sm border border-slate-200" : "bg-white rounded-xl shadow-sm border border-slate-200"}>
        {!showDoctorForm && !showDoctorDetails && (
            <div className="p-6 flex justify-between items-center border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#556ee6]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase leading-none">Physician Directory</h3>
                        <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] mt-1.5 uppercase">MedFlow &gt; Doctors</p>
                    </div>
                </div>
            
                <button 
                    onClick={() => { setSelectedDoctor(null); setShowDoctorForm(true); }}
                    className="px-6 py-2.5 bg-[#556ee6] text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-[#485ec4] transition-all flex items-center gap-2 shadow-lg shadow-[#556ee6]/10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Enroll Physician
                </button>
            </div>
        )}

        {showDoctorForm && (
            <div className="p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-0">
                    <DoctorForm 
                        doctor={selectedDoctor || undefined} 
                        onSubmit={() => { setShowDoctorForm(false); onRefresh(); }} 
                        onCancel={() => setShowDoctorForm(false)} 
                        isInline={true}
                    />
                </div>
            </div>
        )}

        {showDoctorDetails && selectedDoctor && !showDoctorForm && (
            <div className="p-4">
                 <DoctorDetails 
                    doctor={selectedDoctor} 
                    onEdit={() => { setShowDoctorDetails(false); setShowDoctorForm(true); }} 
                    onClose={() => setShowDoctorDetails(false)} 
                />
            </div>
        )}

        {!showDoctorForm && !showDoctorDetails && (
            <DoctorList 
                doctors={doctors} 
                onTrack={(d) => { setSelectedDoctor(d); setShowDoctorDetails(true); }}
                onUpdate={(d) => { setSelectedDoctor(d); setShowDoctorForm(true); }} 
                onDelete={(id) => deleteDoctor(id).then(() => onRefresh())} 
            />
        )}
    </div>
  );
};

export default DoctorsView;
