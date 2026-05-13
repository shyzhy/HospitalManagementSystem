import React, { useState } from 'react';
import MedicalRecordsList from '../component/MedicalRecordsList';
import MedicalRecordsForm from '../component/MedicalRecordsForm';
import MedicalRecordDetails from '../component/MedicalRecordDetails';
import { deleteMedicalRecord } from '../api';
import { Patient, MedicalRecord } from '../types';

interface MedicalRecordsViewProps {
  patients: Patient[];
  canRegisterNew: boolean;
}

const MedicalRecordsView: React.FC<MedicalRecordsViewProps> = ({ patients, canRegisterNew }) => {
  const [showMedicalRecordForm, setShowMedicalRecordForm] = useState(false);
  const [showMedicalRecordDetails, setShowMedicalRecordDetails] = useState(false);
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<MedicalRecord | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {!showMedicalRecordForm && !showMedicalRecordDetails && (
        <div className="p-6 flex justify-between items-center border-b border-slate-100">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#556ee6]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase leading-none">Medical Records</h3>
                    <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] mt-1.5 uppercase">MedFlow &gt; Medical Records</p>
                </div>
            </div>
            {canRegisterNew && (
                <button 
                    onClick={() => { setSelectedMedicalRecord(null); setShowMedicalRecordForm(true); }}
                    className="px-6 py-2.5 bg-[#556ee6] text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-[#485ec4] transition-all flex items-center gap-2 shadow-lg shadow-[#556ee6]/10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Add New
                </button>
            )}
        </div>
      )}
      {showMedicalRecordDetails && selectedMedicalRecord ? (
          <MedicalRecordDetails 
              record={selectedMedicalRecord} 
              onClose={() => setShowMedicalRecordDetails(false)} 
              onEdit={() => { setShowMedicalRecordDetails(false); setShowMedicalRecordForm(true); }} 
              onDelete={() => {
                  if(selectedMedicalRecord?.id) {
                      deleteMedicalRecord(selectedMedicalRecord.id).then(() => {
                          setShowMedicalRecordDetails(false);
                          setSelectedMedicalRecord(null);
                          setRefreshKey(k => k + 1);
                      });
                  }
              }} 
          />
      ) : showMedicalRecordForm ? (
            <MedicalRecordsForm initialData={selectedMedicalRecord} patients={patients} onSuccess={() => { setShowMedicalRecordForm(false); setSelectedMedicalRecord(null); setRefreshKey(k => k + 1); }} onCancel={() => setShowMedicalRecordForm(false)} />
      ) : (
          <MedicalRecordsList key={refreshKey} patients={patients} onUpdate={(r) => { setSelectedMedicalRecord(r); setShowMedicalRecordForm(true); }} onView={(r) => { setSelectedMedicalRecord(r); setShowMedicalRecordDetails(true); }} />
      )}
    </div>
  );
};

export default MedicalRecordsView;
