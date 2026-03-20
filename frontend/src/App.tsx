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

import { getPatients, createPatients, updatePatient, deletePatients } from './api';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from './api';
import { Patient, Doctor, Prescription } from './types'; 
import RecordConsultation from './component/RecordConsultation'; 
import ConsultationList from './component/ConsultationList';

function App() {
  const [activeTab, setActiveTab] = useState<'patients' | 'doctors' | 'consultations' | 'prescriptions' | 'treatment'>('patients');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (activeTab === 'patients') fetchPatients();
    else if (activeTab === 'doctors') fetchDoctors();
  }, [activeTab, refreshKey]);

  const fetchPatients = async () => {
    setLoading(true);
    try { setPatients(await getPatients()); } 
    catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try { setDoctors(await getDoctors()); } 
    catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  const handleTrackTreatment = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab('treatment');
    setShowTreatmentForm(false); 
  };

  const handlePatientSubmit = async (data: any) => {
    if (selectedPatient?.id) await updatePatient(selectedPatient.id, data);
    else await createPatients(data);
    setShowPatientForm(false);
    fetchPatients();
  };

  const handleDoctorSubmit = async (data: any) => {
    if (selectedDoctor?.id) await updateDoctor(selectedDoctor.id, data);
    else await createDoctor(data);
    setShowDoctorForm(false);
    fetchDoctors();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
            <span className="font-bold text-xl text-emerald-600 cursor-pointer" onClick={() => setActiveTab('patients')}>MED FLOW</span>
            <div className="flex space-x-2">
                <button onClick={() => setActiveTab('patients')} className={`px-4 py-2 rounded-lg font-bold text-xs ${activeTab === 'patients' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>PATIENTS</button>
                <button onClick={() => setActiveTab('doctors')} className={`px-4 py-2 rounded-lg font-bold text-xs ${activeTab === 'doctors' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>DOCTORS</button>
                <button onClick={() => { setActiveTab('consultations'); setShowConsultationForm(false); }} className={`px-4 py-2 rounded-lg font-bold text-xs ${activeTab === 'consultations' ? 'bg-orange-600 text-white' : 'text-slate-500'}`}>CONSULTATIONS</button>
                <button onClick={() => setActiveTab('prescriptions')} className={`px-4 py-2 rounded-lg font-bold text-xs ${activeTab === 'prescriptions' ? 'bg-purple-600 text-white' : 'text-slate-500'}`}>PRESCRIPTIONS</button>
                <button onClick={() => setActiveTab('treatment')} className={`px-4 py-2 rounded-lg font-bold text-xs ${activeTab === 'treatment' ? 'bg-pink-600 text-white' : 'text-slate-500'}`}>TREATMENTS</button>
            </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            {activeTab === 'treatment' && (
              <button onClick={() => setActiveTab('patients')} className="text-slate-400 hover:text-slate-600 font-bold">← BACK</button>
            )}
            <h1 className="text-2xl font-black uppercase text-slate-800">
              {activeTab === 'treatment' 
                ? `TREATMENT: ${selectedPatient?.first_name || ''} ${selectedPatient?.last_name || ''}` 
                : activeTab}
            </h1>
          </div>

          <button 
            onClick={() => {
              if(activeTab === 'patients') setShowPatientForm(true);
              else if(activeTab === 'doctors') setShowDoctorForm(true);
              else if(activeTab === 'prescriptions') setShowPrescriptionForm(true);
              else if(activeTab === 'treatment') setShowTreatmentForm(!showTreatmentForm);
              else setShowConsultationForm(!showConsultationForm);
            }}
            className="px-6 py-2 rounded-lg bg-slate-800 text-white font-bold transition-all hover:bg-slate-700 shadow-md active:scale-95"
          >
            {activeTab === 'treatment' ? (showTreatmentForm ? 'VIEW LIST' : 'ADD RECORD') : 'ADD NEW'}
          </button>
        </div>

        {loading && <div className="text-center py-10 font-bold text-slate-400 italic">Loading records...</div>}

        {activeTab === 'patients' && (
          <PatientList 
            patients={patients} 
            onUpdate={(p) => {setSelectedPatient(p); setShowPatientForm(true);}} 
            onDelete={(id) => deletePatients(id).then(fetchPatients)} 
            onTrack={handleTrackTreatment} 
          />
        )}
        
        {activeTab === 'doctors' && <DoctorList doctors={doctors} onUpdate={(d) => {setSelectedDoctor(d); setShowDoctorForm(true);}} onDelete={(id) => deleteDoctor(id).then(fetchDoctors)} />}
        {activeTab === 'consultations' && (showConsultationForm ? <RecordConsultation /> : <ConsultationList />)}
        {activeTab === 'prescriptions' && <PrescriptionList key={refreshKey} onUpdate={(p) => { setSelectedPrescription(p); setShowPrescriptionForm(true); }} />}

        {/* --- TREATMENT SECTION --- */}
        {activeTab === 'treatment' && selectedPatient ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-h-[400px]">
            {showTreatmentForm ? (
              <TreatmentForm 
                patientId={selectedPatient.id || 0} 
                onSuccess={() => {
                  setShowTreatmentForm(false); 
                  setRefreshKey(prev => prev + 1); 
                }} 
              />
            ) : (
              <TreatmentList 
                key={refreshKey} 
                patientId={selectedPatient.id || 0} 
              />
            )}
          </div>
        ) : activeTab === 'treatment' && (
          <div className="bg-orange-50 border border-orange-200 p-10 text-center rounded-xl text-orange-700">
            <p className="font-bold">No patient selected.</p>
            <p className="text-sm">Please go to the Patients tab and click "TRACK" to manage treatments.</p>
            <button onClick={() => setActiveTab('patients')} className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-xs">GO TO PATIENTS</button>
          </div>
        )}

        {showPatientForm && <PatientForm patient={selectedPatient} onSubmit={handlePatientSubmit} onCancel={() => setShowPatientForm(false)} />}
        {showDoctorForm && <DoctorForm doctor={selectedDoctor} onSubmit={(data: any) => handleDoctorSubmit(data)} onCancel={() => setShowDoctorForm(false)} />}
        {showPrescriptionForm && (
            <PrescriptionForm 
                consultationId={selectedPrescription?.visit || selectedPrescription?.consultation || null} 
                initialData={selectedPrescription}
                onSuccess={() => {
                    setShowPrescriptionForm(false);
                    setRefreshKey(prev => prev + 1);
                }} 
                onCancel={() => setShowPrescriptionForm(false)} 
            />
        )}
      </main>
    </div>
  );
}

export default App;