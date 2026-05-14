import React, { useState } from 'react';
import PatientList from '../component/PatientList';
import PatientForm from '../component/PatientForm';
import PatientDetails from '../component/PatientDetails';
import TreatmentForm from '../component/TreatmentForm';
import PrescriptionForm from '../component/PrescriptionForm';
import ConsultationDetails from '../component/ConsultationDetails';
import PrescriptionDetails from '../component/PrescriptionDetails';
import TreatmentDetails from '../component/TreatmentDetails';
import { deletePatient, deleteConsultation, deletePrescription, deleteTreatment } from '../api';
import { Patient, Doctor, Consultation, Prescription, Treatment } from '../types';

interface PatientsViewProps {
  patients: Patient[];
  doctors: Doctor[];
  userRole: string | null;
  canRegisterNew: boolean;
  onRefresh: () => void;
}

const PatientsView: React.FC<PatientsViewProps> = ({ patients, doctors, userRole, canRegisterNew, onRefresh }) => {
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  // Clinical Detail States
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  
  const [showConsultationDetails, setShowConsultationDetails] = useState(false);
  const [showPrescriptionDetails, setShowPrescriptionDetails] = useState(false);
  const [showTreatmentDetails, setShowTreatmentDetails] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {!showPatientForm && !showPatientDetails && !showTreatmentForm && !showPrescriptionForm && 
         !showConsultationDetails && !showPrescriptionDetails && !showTreatmentDetails && (
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
                onViewConsultation={(c) => { setSelectedConsultation(c); setShowConsultationDetails(true); setShowPatientDetails(false); }}
                onViewPrescription={(p) => { setSelectedPrescription(p); setShowPrescriptionDetails(true); setShowPatientDetails(false); }}
                onViewTreatment={(t) => { setSelectedTreatment(t); setShowTreatmentDetails(true); setShowPatientDetails(false); }}
                onAddTreatment={() => { setShowPatientDetails(false); setShowTreatmentForm(true); }}
                onAddPrescription={() => { setShowPatientDetails(false); setShowPrescriptionForm(true); }}
                onDeletePrescription={async (id) => {
                    await deletePrescription(id);
                    onRefresh(); // Refresh global patient list
                }}
            />
        ) : showConsultationDetails && selectedConsultation ? (
            <ConsultationDetails 
                consultation={selectedConsultation} 
                onClose={() => { setShowConsultationDetails(false); setShowPatientDetails(true); }} 
                onEdit={() => {}} // Could add edit logic later
                onDelete={() => {
                    if (selectedConsultation.id) {
                        deleteConsultation(selectedConsultation.id).then(() => {
                            setShowConsultationDetails(false);
                            setShowPatientDetails(true);
                        });
                    }
                }}
            />
        ) : showPrescriptionDetails && selectedPrescription ? (
            <PrescriptionDetails 
                prescription={selectedPrescription} 
                onClose={() => { setShowPrescriptionDetails(false); setShowPatientDetails(true); }} 
                onEdit={() => {}}
                onDelete={(id) => {
                    deletePrescription(id).then(() => {
                        setShowPrescriptionDetails(false);
                        setShowPatientDetails(true);
                    });
                }}
            />
        ) : showTreatmentDetails && selectedTreatment ? (
            <TreatmentDetails 
                treatment={selectedTreatment} 
                onClose={() => { setShowTreatmentDetails(false); setShowPatientDetails(true); }} 
                onEdit={() => {}}
                onDelete={(id) => {
                    deleteTreatment(id).then(() => {
                        setShowTreatmentDetails(false);
                        setShowPatientDetails(true);
                    });
                }}
            />
        ) : showPatientForm ? (
            <PatientForm patient={selectedPatient} onSubmit={() => { setShowPatientForm(false); onRefresh(); }} onCancel={() => setShowPatientForm(false)} />
        ) : showTreatmentForm && selectedPatient ? (
            <TreatmentForm 
                patients={[selectedPatient]} 
                doctors={doctors} 
                onSuccess={() => { setShowTreatmentForm(false); onRefresh(); setShowPatientDetails(true); }} 
                onCancel={() => { setShowTreatmentForm(false); setShowPatientDetails(true); }} 
            />
        ) : showPrescriptionForm && selectedPatient ? (
            <PrescriptionForm 
                patients={[selectedPatient]} 
                doctors={doctors} 
                onSuccess={() => { setShowPrescriptionForm(false); onRefresh(); setShowPatientDetails(true); }} 
                onCancel={() => { setShowPrescriptionForm(false); setShowPatientDetails(true); }} 
            />
        ) : (
            <PatientList patients={patients} onUpdate={(p) => {setSelectedPatient(p); setShowPatientForm(true);}} onDelete={(id) => deletePatient(id).then(() => onRefresh())} onTrack={(p) => { setSelectedPatient(p); setShowPatientDetails(true); }} />
        )}
    </div>
  );
};

export default PatientsView;
