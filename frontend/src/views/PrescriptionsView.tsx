import React, { useState } from 'react';
import PrescriptionList from '../component/PrescriptionList';
import PrescriptionForm from '../component/PrescriptionForm';
import PrescriptionDetails from '../component/PrescriptionDetails';
import { deletePrescription } from '../api';
import { Patient, Doctor, Prescription } from '../types';

interface PrescriptionsViewProps {
  patients: Patient[];
  doctors: Doctor[];
  canRegisterNew: boolean;
}

const PrescriptionsView: React.FC<PrescriptionsViewProps> = ({ patients, doctors, canRegisterNew }) => {
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showPrescriptionDetails, setShowPrescriptionDetails] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {!showPrescriptionForm && !showPrescriptionDetails && (
        <div className="p-6 flex justify-between items-center border-b border-slate-100">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#556ee6]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase leading-none">Prescriptions</h3>
                    <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] mt-1.5 uppercase">MedFlow &gt; Prescriptions</p>
                </div>
            </div>
            {canRegisterNew && (
                <button 
                    onClick={() => { setSelectedPrescription(null); setShowPrescriptionForm(true); }}
                    className="px-6 py-2.5 bg-[#556ee6] text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-[#485ec4] transition-all flex items-center gap-2 shadow-lg shadow-[#556ee6]/10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Add New
                </button>
            )}
        </div>
      )}
      {showPrescriptionDetails && selectedPrescription ? (
          <PrescriptionDetails 
              prescription={selectedPrescription}
              onClose={() => setShowPrescriptionDetails(false)}
              onEdit={() => { setShowPrescriptionDetails(false); setShowPrescriptionForm(true); }}
              onDelete={(id) => deletePrescription(id).then(() => { setShowPrescriptionDetails(false); setRefreshKey(k => k + 1); })}
          />
      ) : showPrescriptionForm ? (
          <PrescriptionForm 
              initialData={selectedPrescription} 
              patients={patients} 
              doctors={doctors} 
              onSuccess={() => { setShowPrescriptionForm(false); setSelectedPrescription(null); setRefreshKey(k => k + 1); }} 
              onCancel={() => setShowPrescriptionForm(false)} 
          />
      ) : (
          <PrescriptionList 
              key={refreshKey}
              onUpdate={(p) => { setSelectedPrescription(p); setShowPrescriptionForm(true); }} 
              onView={(p) => { setSelectedPrescription(p); setShowPrescriptionDetails(true); }}
          />
      )}
    </div>
  );
};

export default PrescriptionsView;
