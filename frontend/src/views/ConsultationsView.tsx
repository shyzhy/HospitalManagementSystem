import React, { useState } from 'react';
import ConsultationList from '../component/ConsultationList';
import ConsultationDetails from '../component/ConsultationDetails';
import RecordConsultation from '../component/RecordConsultation';
import { deleteConsultation } from '../api';
import { Patient, Consultation } from '../types';

interface ConsultationsViewProps {
  patients: Patient[];
  canRegisterNew: boolean;
}

const ConsultationsView: React.FC<ConsultationsViewProps> = ({ patients, canRegisterNew }) => {
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [showConsultationDetails, setShowConsultationDetails] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {!showConsultationForm && !showConsultationDetails && (
        <div className="p-6 flex justify-between items-center border-b border-slate-100">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#556ee6]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase leading-none">Consultations</h3>
                    <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] mt-1.5 uppercase">MedFlow &gt; Consultations</p>
                </div>
            </div>
            {canRegisterNew && (
                <button 
                    onClick={() => { setSelectedConsultation(null); setShowConsultationForm(true); }}
                    className="px-6 py-2.5 bg-[#556ee6] text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-[#485ec4] transition-all flex items-center gap-2 shadow-lg shadow-[#556ee6]/10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Add New
                </button>
            )}
        </div>
      )}
      {showConsultationDetails && selectedConsultation ? (
        <ConsultationDetails 
          consultation={selectedConsultation}
          onClose={() => setShowConsultationDetails(false)}
          onEdit={() => { setShowConsultationDetails(false); setShowConsultationForm(true); }}
          onDelete={() => {
             if(selectedConsultation.id) {
               deleteConsultation(selectedConsultation.id).then(() => {
                  setShowConsultationDetails(false);
                  setRefreshKey(k => k + 1);
               });
             }
          }}
        />
      ) : showConsultationForm ? (
          <RecordConsultation 
              initialData={selectedConsultation} 
              onSuccess={() => { setShowConsultationForm(false); setSelectedConsultation(null); setRefreshKey(k => k + 1); }} 
              onCancel={() => setShowConsultationForm(false)}
          /> 
      ) : (
          <ConsultationList 
              key={refreshKey} 
              patients={patients} 
              onUpdate={(c) => { 
                setSelectedConsultation(c); 
                setShowConsultationDetails(true); 
              }} 
          />
      )}
    </div>
  );
};

export default ConsultationsView;
