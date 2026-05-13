import React, { useState } from 'react';
import TreatmentList from '../component/TreatmentList';
import TreatmentDetails from '../component/TreatmentDetails';
import TreatmentForm from '../component/TreatmentForm';
import { deleteTreatment } from '../api';
import { Patient, Doctor, Treatment } from '../types';

interface TreatmentViewProps {
  patients: Patient[];
  doctors: Doctor[];
  canRegisterNew: boolean;
}

const TreatmentView: React.FC<TreatmentViewProps> = ({ patients, doctors, canRegisterNew }) => {
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [showTreatmentDetails, setShowTreatmentDetails] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {!showTreatmentForm && !showTreatmentDetails && (
        <div className="p-6 flex justify-between items-center border-b border-slate-100">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#556ee6]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase leading-none">Treatment</h3>
                    <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] mt-1.5 uppercase">MedFlow &gt; Treatment</p>
                </div>
            </div>
            {canRegisterNew && (
                <button 
                    onClick={() => { setSelectedTreatment(null); setShowTreatmentForm(true); }}
                    className="px-6 py-2.5 bg-[#556ee6] text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-[#485ec4] transition-all flex items-center gap-2 shadow-lg shadow-[#556ee6]/10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Add New
                </button>
            )}
        </div>
      )}
      {showTreatmentDetails && selectedTreatment ? (
          <TreatmentDetails 
              treatment={selectedTreatment}
              onClose={() => setShowTreatmentDetails(false)}
              onEdit={() => { setShowTreatmentDetails(false); setShowTreatmentForm(true); }}
              onDelete={(id) => deleteTreatment(id).then(() => { setShowTreatmentDetails(false); setRefreshKey(k => k + 1); })}
          />
      ) : showTreatmentForm ? (
          <TreatmentForm 
              initialData={selectedTreatment} 
              patients={patients} doctors={doctors} 
              onSuccess={() => { setShowTreatmentForm(false); setSelectedTreatment(null); setRefreshKey(k => k + 1); }} 
              onCancel={() => setShowTreatmentForm(false)}
          />
      ) : (
          <TreatmentList 
              key={refreshKey} 
              patientId={0} 
              patients={patients} 
              onUpdate={(t) => { setSelectedTreatment(t); setShowTreatmentDetails(true); }} 
          />
      )}
    </div>
  );
};

export default TreatmentView;
