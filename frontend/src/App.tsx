import React, { useState, useEffect } from 'react';
import './App.css';
import PatientList from './component/PatientList';
import DoctorList from './component/DoctorList';
import PatientForm from './component/PatientForm';
import DoctorForm from './component/DoctorForm';
import PrescriptionForm from './component/PrescriptionForm';
import PrescriptionList from './component/PrescriptionList';
import TreatmentForm from './component/TreatmentForm';
import TreatmentList from './component/TreatmentList';
import RecordConsultation from './component/RecordConsultation'; 
import ConsultationList from './component/ConsultationList';

import { getPatients, deletePatient } from './api';
import { getDoctors, deleteDoctor } from './api';
import { Patient, Doctor, Prescription, Consultation, Treatment } from './types'; 

import MedicalRecordsList from './component/MedicalRecordsList';
import MedicalRecordsForm from './component/MedicalRecordsForm';
import { MedicalRecord } from './types';
import { getMedicalRecords } from './api';

function App() {
   const [activeTab, setActiveTab] = useState<'patients' | 'doctors' | 'consultations' | 'prescriptions' | 'treatment' | 'medical_records'>('patients');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  // UI Toggle States
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false); 
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [showMedicalRecordForm, setShowMedicalRecordForm] = useState(false);

  // Data States for Editing
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<MedicalRecord | null>(null);

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  
  // refreshKey triggers a re-fetch in child components
  const [refreshKey, setRefreshKey] = useState(0);

  // Syncing Global Lists (Patients/Doctors)
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'patients') setPatients(await getPatients());
        else if (activeTab === 'doctors') setDoctors(await getDoctors());
        else if (activeTab === 'medical_records') setMedicalRecords(await getMedicalRecords());
      } catch (e) {
        console.error("Sync Error:", e);
      }
    };
    fetchData();
  }, [activeTab, refreshKey]);

  const handleTrackTreatment = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab('treatment');
    setShowTreatmentForm(false); 
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
            <span className="font-black text-xl text-emerald-600 cursor-pointer tracking-tighter" onClick={() => setActiveTab('patients')}>MED FLOW</span>
            <div className="flex space-x-1">
                {(['patients', 'doctors', 'consultations', 'prescriptions', 'treatment', 'medical_records'] as const).map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setShowConsultationForm(false);
                      setShowTreatmentForm(false);
                      setShowMedicalRecordForm(false);
                    }} 
                    className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${
                      activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {tab === 'medical_records' ? 'Medical Records' : tab}
                  </button>
                ))}
            </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase text-slate-800 tracking-tight">
              {activeTab === 'treatment' && selectedPatient 
                ? `History: ${selectedPatient.first_name} ${selectedPatient.last_name}` 
                : activeTab === 'medical_records'
                ? 'Medical Records'
                : activeTab}
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 italic">Authorized Personnel Only</p>
          </div>

          <button 
            onClick={() => {
              // Reset selection before opening form to ensure "Add New" isn't an "Edit"
              if(activeTab === 'patients') { setSelectedPatient(null); setShowPatientForm(true); }
              else if(activeTab === 'doctors') { setSelectedDoctor(null); setShowDoctorForm(true); }
              else if(activeTab === 'prescriptions') { setSelectedPrescription(null); setShowPrescriptionForm(true); }
              else if(activeTab === 'treatment') { setSelectedTreatment(null); setShowTreatmentForm(!showTreatmentForm); }
              else if(activeTab === 'consultations') { setSelectedConsultation(null); setShowConsultationForm(!showConsultationForm); }
              else if(activeTab === 'medical_records') { 
                setSelectedMedicalRecord(null); 
                setShowMedicalRecordForm(!showMedicalRecordForm); 
              }
            }}
            className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest transition-all hover:bg-emerald-700 shadow-xl shadow-emerald-100 active:scale-95"
          >
            {(activeTab === 'consultations' && showConsultationForm) || 
             (activeTab === 'treatment' && showTreatmentForm) ||
             (activeTab === 'medical_records' && showMedicalRecordForm)
              ? 'BACK TO LIST' 
              : 'REGISTER NEW'}
          </button>
        </div>

        {/* CONSULTATIONS */}
        {activeTab === 'consultations' && (
           <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            {showConsultationForm ? (
               <RecordConsultation 
                  initialData={selectedConsultation} 
                  onSuccess={() => { setShowConsultationForm(false); setSelectedConsultation(null); setRefreshKey(k => k + 1); }} 
               />
            ) : (
               <ConsultationList 
                  key={refreshKey} 
                  patients={patients}  // <-- ADDED THIS PROP
                  onUpdate={(c) => { setSelectedConsultation(c); setShowConsultationForm(true); }} 
               />
            )}
           </div>
        )}

        {/* TREATMENTS */}
        {activeTab === 'treatment' && (
   <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
    {showTreatmentForm ? (
       <TreatmentForm initialData={selectedTreatment} onSuccess={() => { setShowTreatmentForm(false); setSelectedTreatment(null); setRefreshKey(k => k + 1); }} />
    ) : (
       <TreatmentList 
          key={refreshKey} 
          patientId={selectedPatient?.id || 0} 
          patients={patients}  // ADD THIS
          onUpdate={(t) => { setSelectedTreatment(t); setShowTreatmentForm(true); }} 
       />
    )}
   </div>
)}

        {/* MEDICAL RECORDS */}
        {activeTab === 'medical_records' && (
   <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
    {showMedicalRecordForm ? (
       <MedicalRecordsForm 
          record={selectedMedicalRecord} 
          patients={patients}
          onSuccess={() => { 
            setShowMedicalRecordForm(false); 
            setSelectedMedicalRecord(null); 
            setRefreshKey(k => k + 1); 
          }} 
          onCancel={() => {
            setShowMedicalRecordForm(false);
            setSelectedMedicalRecord(null);
          }}
       />
    ) : (
       <MedicalRecordsList 
          key={refreshKey} 
          patients={patients}
          onUpdate={(record) => { 
            setSelectedMedicalRecord(record); 
            setShowMedicalRecordForm(true); 
          }} 
       />
    )}
   </div>
)}

        {/* PATIENTS */}
        {activeTab === 'patients' && (
          <PatientList patients={patients} onUpdate={(p) => {setSelectedPatient(p); setShowPatientForm(true);}} onDelete={(id) => deletePatient(id).then(() => setRefreshKey(k => k + 1))} onTrack={handleTrackTreatment} />
        )}

        {/* DOCTORS */}
        {activeTab === 'doctors' && (
          <DoctorList doctors={doctors} onUpdate={(d) => { setSelectedDoctor(d); setShowDoctorForm(true); }} onDelete={(id) => deleteDoctor(id).then(() => setRefreshKey(k => k + 1))} />
        )}

        {/* PRESCRIPTIONS */}
        {activeTab === 'prescriptions' && (
          <PrescriptionList onUpdate={(p) => { setSelectedPrescription(p); setShowPrescriptionForm(true); }} />
        )}

        {/* MODAL OVERLAYS */}
        {showDoctorForm && <DoctorForm doctor={selectedDoctor} onSubmit={() => { setShowDoctorForm(false); setRefreshKey(k => k + 1); }} onCancel={() => setShowDoctorForm(false)} />}
        {showPatientForm && <PatientForm patient={selectedPatient} onSubmit={() => { setShowPatientForm(false); setRefreshKey(k => k + 1); }} onCancel={() => setShowPatientForm(false)} />}
        {showPrescriptionForm && (
            <PrescriptionForm 
                consultationId={null} 
                initialData={selectedPrescription}
                onSuccess={() => { setShowPrescriptionForm(false); setRefreshKey(k => k + 1); }} 
                onCancel={() => setShowPrescriptionForm(false)} 
            />
        )}
      </main>
    </div>
  );
}

export default App;