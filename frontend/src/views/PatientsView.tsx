import React, { useState } from 'react';
import PatientList from '../component/PatientList';
import PatientForm from '../component/PatientForm';
import PatientDetails from '../component/PatientDetails';
import { deletePatient } from '../api';
import { Patient, Consultation } from '../types';
import { useNavigate } from 'react-router-dom';

interface PatientsViewProps {
  patients: Patient[];
  userRole: string | null;
  canRegisterNew: boolean;
  onRefresh: () => void;
}

const PatientsView: React.FC<PatientsViewProps> = ({ patients, userRole, canRegisterNew, onRefresh }) => {
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const navigate = useNavigate();

  return (
    <div className={showPatientDetails || showPatientForm ? "bg-white rounded-xl shadow-sm border border-slate-200" : "bg-white rounded-xl shadow-sm border border-slate-200"}>
        {!showPatientForm && !showPatientDetails && (
          <div className="p-6 flex justify-between items-center border-b border-slate-100">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#556ee6]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                  </div>
                  <div>
                      <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase leading-none">Patients Directory</h3>
                      <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] mt-1.5 uppercase">MedFlow &gt; Patients</p>
                  </div>
              </div>
              {canRegisterNew && (
                  <button 
                      onClick={() => { setSelectedPatient(null); setShowPatientForm(true); }}
                      className="px-6 py-2.5 bg-[#556ee6] text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-[#485ec4] transition-all flex items-center gap-2 shadow-lg shadow-[#556ee6]/10"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      Add New
                  </button>
              )}
          </div>
        )}
        {showPatientDetails && selectedPatient ? (
            <PatientDetails 
                patient={selectedPatient} 
                onClose={() => setShowPatientDetails(false)} 
                onEdit={() => { setShowPatientDetails(false); setShowPatientForm(true); }}
                readOnly={userRole === 'doctor'}
                onViewConsultation={(c) => {
                    navigate('/consultations');
                    // In a real app we'd pass the consultation ID or context here.
                }}
            />
        ) : showPatientForm ? (
            <PatientForm patient={selectedPatient} onSubmit={() => { setShowPatientForm(false); onRefresh(); }} onCancel={() => setShowPatientForm(false)} />
        ) : (
            <PatientList patients={patients} onUpdate={(p) => {setSelectedPatient(p); setShowPatientForm(true);}} onDelete={(id) => deletePatient(id).then(() => onRefresh())} onTrack={(p) => { setSelectedPatient(p); setShowPatientDetails(true); }} />
        )}
    </div>
  );
};

export default PatientsView;
