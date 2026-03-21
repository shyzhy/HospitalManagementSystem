import React, { useState, useEffect } from 'react';
import './App.css';

// Component Imports
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
import ConsultationDetails from './component/ConsultationDetails'; // <-- NEW IMPORT
import MedicalRecordsList from './component/MedicalRecordsList';
import MedicalRecordsForm from './component/MedicalRecordsForm';
import Login from './component/Login';

// API & Types
import { getPatients, deletePatient, getDoctors, deleteDoctor, deleteConsultation } from './api';
import { Patient, Doctor, Prescription, Consultation, Treatment, MedicalRecord } from './types'; 

function App() {
  // --- AUTH & ROLES ---
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('role') || 'patient'); 
  const userName = localStorage.getItem('userName') || 'User';

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'patients' | 'doctors' | 'consultations' | 'prescriptions' | 'treatment' | 'medical_records'>('consultations');
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  // Form & Modal Visibility
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false); 
  const [showConsultationDetails, setShowConsultationDetails] = useState(false); // <-- NEW STATE
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [showMedicalRecordForm, setShowMedicalRecordForm] = useState(false);

  // Selected Items for Editing/Viewing
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<MedicalRecord | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  // --- DATA FETCHING ---
  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        if (userRole === 'admin' || userRole === 'doctor') {
            setPatients(await getPatients());
            setDoctors(await getDoctors());
        }
      } catch (e) { 
          console.error("Data Fetch Error:", e); 
      }
    };
    fetchData();
  }, [activeTab, refreshKey, token, userRole]);

  // --- HANDLERS ---
  const handleLoginSuccess = (t: string, r: string) => {
    setToken(t);
    setUserRole(r);
    localStorage.setItem('token', t);
    localStorage.setItem('role', r);
    if (r === 'admin') setActiveTab('patients');
    if (r === 'doctor' || r === 'patient') setActiveTab('consultations');
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUserRole(null);
    window.location.reload();
  };

  if (!token) return <Login onLoginSuccess={handleLoginSuccess} />;

    const canRegisterNew = () => {
        if (userRole === 'admin') return true;
        if (userRole === 'doctor') return true; 
        if (userRole === 'patient') return activeTab === 'consultations';
        return false;
    };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-emerald-600 tracking-tighter uppercase">MED FLOW</h1>
                <span className="hidden md:inline-block px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-emerald-100 shadow-sm">
                    {userRole}
                </span>
            </div>

            <div className="flex items-center space-x-1 overflow-x-auto hide-scrollbar">
                {(['patients', 'doctors', 'consultations', 'prescriptions', 'treatment', 'medical_records'] as const)
                .filter(tab => {
                    if (userRole === 'admin') return true;
                    if (userRole === 'doctor' && tab !== 'doctors') return true; 
                    if (userRole === 'patient') return tab === 'consultations' || tab === 'prescriptions';
                    return false;
                })
                .map((tab) => (
                  <button key={tab} 
                    onClick={() => { 
                        setActiveTab(tab); 
                        setShowConsultationForm(false); 
                        setShowConsultationDetails(false);
                        setShowTreatmentForm(false); 
                        setShowMedicalRecordForm(false); 
                    }} 
                    className={`px-3 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
                    {tab.replace('_', ' ')}
                  </button>
                ))}
            </div>

            <div className="flex items-center gap-4 border-l border-slate-200 pl-4 ml-2">
                <div className="hidden lg:flex flex-col text-right">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Welcome,</span>
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{userName}</span>
                </div>
                <button onClick={handleLogout} className="text-[10px] font-black text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg uppercase tracking-widest transition-all">Logout</button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tight">{activeTab.replace('_', ' ')}</h1>
          
          {canRegisterNew() && (
            <button onClick={() => {
                if(activeTab === 'patients') { setSelectedPatient(null); setShowPatientForm(true); }
                else if(activeTab === 'doctors') { setSelectedDoctor(null); setShowDoctorForm(true); }
                else if(activeTab === 'prescriptions') { setSelectedPrescription(null); setShowPrescriptionForm(true); }
                else if(activeTab === 'treatment') { setSelectedTreatment(null); setShowTreatmentForm(!showTreatmentForm); }
                else if(activeTab === 'consultations') { setSelectedConsultation(null); setShowConsultationForm(!showConsultationForm); }
                else if(activeTab === 'medical_records') { setSelectedMedicalRecord(null); setShowMedicalRecordForm(!showMedicalRecordForm); }
              }} className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">
              {(showConsultationForm || showTreatmentForm || showMedicalRecordForm || showPatientForm || showDoctorForm || showPrescriptionForm) ? 'BACK TO LIST' : 'REGISTER NEW'}
            </button>
          )}
        </div>

        {/* --- CONSULTATIONS VIEW --- */}
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
                    patients={patients} 
                    onUpdate={(c) => { 
                      setSelectedConsultation(c); 
                      setShowConsultationDetails(true); // Open Details Modal first
                    }} 
                />
            )}

            {/* CONSULTATION DETAILS MODAL */}
            {showConsultationDetails && selectedConsultation && (
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
            )}
           </div>
        )}

        {/* --- OTHER VIEWS --- */}
        {activeTab === 'treatment' && userRole !== 'patient' && (
           <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            {showTreatmentForm ? (
                <TreatmentForm 
                    initialData={selectedTreatment} 
                    patients={patients} doctors={doctors} 
                    onSuccess={() => { setShowTreatmentForm(false); setSelectedTreatment(null); setRefreshKey(k => k + 1); }} 
                />
            ) : (
                <TreatmentList key={refreshKey} patientId={selectedPatient?.id || 0} patients={patients} onUpdate={(t) => { setSelectedTreatment(t); setShowTreatmentForm(true); }} />
            )}
           </div>
        )}

        {activeTab === 'medical_records' && userRole !== 'patient' && (
           <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            {showMedicalRecordForm ? (
                  <MedicalRecordsForm initialData={selectedMedicalRecord} patients={patients} onSuccess={() => { setShowMedicalRecordForm(false); setSelectedMedicalRecord(null); setRefreshKey(k => k + 1); }} onCancel={() => setShowMedicalRecordForm(false)} />
            ) : (
                <MedicalRecordsList key={refreshKey} patients={patients} onUpdate={(r) => { setSelectedMedicalRecord(r); setShowMedicalRecordForm(true); }} />
            )}
           </div>
        )}

        {activeTab === 'patients' && userRole !== 'patient' && (
            <PatientList patients={patients} onUpdate={(p) => {setSelectedPatient(p); setShowPatientForm(true);}} onDelete={(id) => deletePatient(id).then(() => setRefreshKey(k => k + 1))} onTrack={(p) => { setSelectedPatient(p); setActiveTab('treatment'); setShowTreatmentForm(false); }} />
        )}

        {activeTab === 'doctors' && userRole === 'admin' && (
            <DoctorList doctors={doctors} onUpdate={(d) => { setSelectedDoctor(d); setShowDoctorForm(true); }} onDelete={(id) => deleteDoctor(id).then(() => setRefreshKey(k => k + 1))} />
        )}

        {activeTab === 'prescriptions' && (
            <PrescriptionList onUpdate={(p) => { setSelectedPrescription(p); setShowPrescriptionForm(true); }} />
        )}

        {/* --- SHARED MODALS --- */}
        {showDoctorForm && <DoctorForm doctor={selectedDoctor} onSubmit={() => { setShowDoctorForm(false); setRefreshKey(k => k + 1); }} onCancel={() => setShowDoctorForm(false)} />}
        {showPatientForm && <PatientForm patient={selectedPatient} onSubmit={() => { setShowPatientForm(false); setRefreshKey(k => k + 1); }} onCancel={() => setShowPatientForm(false)} />}
        {showPrescriptionForm && (
              <PrescriptionForm initialData={selectedPrescription} patients={patients} doctors={doctors} onSuccess={() => { setShowPrescriptionForm(false); setRefreshKey(k => k + 1); }} onCancel={() => setShowPrescriptionForm(false)} />
        )}
      </main>
    </div>
  );
}

export default App;