import React, { useState, useEffect } from 'react';
import './App.css';

// Component Imports
import PatientList from './component/PatientList';
import DoctorList from './component/DoctorList';
import PatientForm from './component/PatientForm';
import DoctorForm from './component/DoctorForm';
import PrescriptionForm from './component/PrescriptionForm';
import PrescriptionList from './component/PrescriptionList';
import PrescriptionDetails from './component/PrescriptionDetails';
import TreatmentForm from './component/TreatmentForm';
import TreatmentList from './component/TreatmentList';
import TreatmentDetails from './component/TreatmentDetails';
import RecordConsultation from './component/RecordConsultation';
import ConsultationList from './component/ConsultationList';
import ConsultationDetails from './component/ConsultationDetails';
import MedicalRecordsList from './component/MedicalRecordsList';
import MedicalRecordsForm from './component/MedicalRecordsForm';
import MedicalRecordDetails from './component/MedicalRecordDetails';
import PatientDetails from './component/PatientDetails';
import Login from './component/Login';

// API & Types
import { getPatients, deletePatient, getDoctors, deleteDoctor, deleteConsultation, deleteMedicalRecord, deleteTreatment, deletePrescription } from './api';
import { Patient, Doctor, Prescription, Consultation, Treatment, MedicalRecord } from './types'; 

function App() {
  // --- AUTH & ROLES ---
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('role') || 'patient'); 
  const userName = localStorage.getItem('userName') || 'User';

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'patients' | 'doctors' | 'consultations' | 'prescriptions' | 'treatment' | 'medical_records' | 'account'>('consultations');
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  // Form & Modal Visibility
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false); 
  const [showConsultationDetails, setShowConsultationDetails] = useState(false);
  const [showTreatmentDetails, setShowTreatmentDetails] = useState(false);
  const [showPrescriptionDetails, setShowPrescriptionDetails] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [showMedicalRecordForm, setShowMedicalRecordForm] = useState(false);
  const [showMedicalRecordDetails, setShowMedicalRecordDetails] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);


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
        if (activeTab === 'account') return false;
        if (userRole === 'admin') return true;
        if (userRole === 'doctor') {
            if (activeTab === 'patients') return false;
            return true;
        } 
        if (userRole === 'patient') return activeTab === 'consultations';
        return false;
    };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#F0F2F5] font-sans">
      
      {/* --- TOP NAVBAR --- */}
      <header className="h-14 bg-[#3b5998] text-white flex items-center justify-between px-5 shrink-0 shadow-sm z-30">
          <div className="flex items-center gap-4">
              {/* Traffic Lights (Mac style) */}
              <div className="flex items-center gap-1.5 mr-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <h1 className="text-sm font-black tracking-wide uppercase">MedFlow</h1>
          </div>
          
          <div className="flex items-center gap-6">
              <div className="flex flex-col text-right">
                  <span className="text-xs font-bold leading-tight">
                      {userRole === 'doctor' && !userName.startsWith('Dr.') ? `Dr. ${userName}` : userName}
                  </span>
                  <span className="text-[9px] text-white/70 capitalize">{userRole}</span>
              </div>
              <div 
                  className={`w-8 h-8 rounded-full bg-[#2A3F6D] border border-white/20 flex items-center justify-center font-bold text-xs ${userRole === 'doctor' ? 'cursor-pointer hover:bg-white/20 transition-colors' : ''}`}
                  onClick={() => {
                      if (userRole === 'doctor') {
                          setActiveTab('account');
                          setShowConsultationForm(false);
                          setShowConsultationDetails(false);
                          setShowTreatmentForm(false);
                          setShowMedicalRecordForm(false);
                      }
                  }}
                  title={userRole === 'doctor' ? "Account Settings" : "Profile"}
              >
                  {userName.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase()}
              </div>
              
              <div className="w-px h-5 bg-white/20"></div>
 
              <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white transition-colors"
                  title="Logout"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>LOGOUT</span>
              </button>
          </div>
      </header>

      {/* --- BOTTOM SECTION (SIDEBAR + MAIN CONTENT) --- */}
      <div className="flex flex-1 overflow-hidden relative">
          
          {/* --- SIDEBAR --- */}
          <aside className="w-[260px] bg-[#2b3240] text-[#9ba5b7] flex flex-col shrink-0 shadow-[4px_0_15px_rgba(0,0,0,0.05)] z-20 py-4 overflow-y-auto">
              <div className="px-6 mb-4 mt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#6c7a93]">Main Navigation</span>
              </div>
              <nav className="flex flex-col space-y-1">
                  {(['patients', 'doctors', 'consultations', 'prescriptions', 'treatment', 'medical_records', 'account'] as const)
                  .filter(tab => {
                      if (userRole === 'admin') return tab !== 'account';
                      if (userRole === 'doctor') return tab !== 'doctors'; 
                      if (userRole === 'patient') return tab === 'consultations' || tab === 'prescriptions';
                      return false;
                  })
                  .map((tab) => {
                      const isActive = activeTab === tab;
                      
                      // Assign an icon based on the tab
                      let iconPath = "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"; // Default
                      if(tab === 'patients') iconPath = "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z";
                      if(tab === 'doctors') iconPath = "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z";
                      if(tab === 'consultations') iconPath = "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z";
                      if(tab === 'prescriptions') iconPath = "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4";
                      if(tab === 'treatment') iconPath = "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z";
                      if(tab === 'medical_records') iconPath = "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z";
                      if(tab === 'account') iconPath = "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z";
 
                      return (
                          <button key={tab} 
                              onClick={() => { 
                                  setActiveTab(tab); 
                                  setShowConsultationForm(false); 
                                  setShowConsultationDetails(false);
                                  setShowTreatmentForm(false); 
                                  setShowTreatmentDetails(false);
                                  setShowPrescriptionForm(false);
                                  setShowPrescriptionDetails(false);
                                  setShowMedicalRecordForm(false); 
                                  setShowMedicalRecordDetails(false);
                              }} 
                              className={`flex items-center gap-4 px-6 py-3.5 text-sm font-semibold tracking-wide transition-all ${isActive ? 'bg-[#556ee6] text-white border-l-4 border-white' : 'hover:bg-[#323947] hover:text-[#d3d9e3] border-l-4 border-transparent'}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                              </svg>
                              <span className="capitalize">{tab.replace('_', ' ')}</span>
                          </button>
                      )
                  })}
              </nav>
          </aside>
 
          {/* --- MAIN PAGE CONTENT --- */}
          <main className="flex-1 overflow-y-auto p-8 relative">
              
              {/* PAGE HEADER SECTION */}
              <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-4">
                      {/* Icon for Header */}
                      <div className="w-12 h-12 rounded-full bg-[#f4f5f9] text-[#556ee6] flex items-center justify-center font-black text-2xl shadow-inner">
                         📋
                      </div>
                      <div>
                          <h1 className="text-xl font-black text-[#495057] tracking-tight capitalize">
                              {activeTab.replace('_', ' ')} Directory
                          </h1>
                          <p className="text-[12px] font-semibold text-[#74788d] mt-0.5 uppercase tracking-wider">
                              MedFlow &gt; {activeTab.replace('_', ' ')}
                          </p>
                      </div>
                  </div>
              
                  {canRegisterNew() && (
                      <button onClick={() => {
                          if(activeTab === 'patients') { setSelectedPatient(null); setShowPatientForm(true); }
                          else if(activeTab === 'doctors') { setSelectedDoctor(null); setShowDoctorForm(true); }
                          else if(activeTab === 'prescriptions') { setSelectedPrescription(null); setShowPrescriptionForm(true); }
                          else if(activeTab === 'treatment') { setSelectedTreatment(null); setShowTreatmentForm(!showTreatmentForm); }
                          else if(activeTab === 'consultations') { setSelectedConsultation(null); setShowConsultationForm(!showConsultationForm); }
                          else if(activeTab === 'medical_records') { setSelectedMedicalRecord(null); setShowMedicalRecordForm(!showMedicalRecordForm); }
                      }} 
                      className="px-6 py-2.5 rounded shadow-sm bg-[#556ee6] hover:bg-[#485ec4] text-white font-bold text-[13px] transition-all flex items-center gap-2"
                      >
                          <span className="text-lg leading-none">+</span>
                          Add New
                      </button>
                  )}
              </div>
 
              {/* MAIN DATA CARD */}
              <div className="bg-transparent min-h-[60vh]">
 
          {/* --- ACCOUNT VIEW --- */}
         {activeTab === 'account' && userRole === 'doctor' && (() => {
             const myDoctorRecord = doctors.find(d => d.id === parseInt(localStorage.getItem('doctorId') || '0'));
             return (
                 <div className="flex justify-center mt-2">
                      <DoctorForm 
                           doctor={myDoctorRecord} 
                           onSubmit={(d) => { 
                                localStorage.setItem('userName', `Dr. ${d.first_name} ${d.last_name}`);
                                setRefreshKey(k => k + 1); 
                            }} 
                           isInline={true} 
                      />
                 </div>
             );
         })()}
 
          {/* --- CONSULTATIONS VIEW --- */}
         {activeTab === 'consultations' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
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
         )}
 
         {/* --- OTHER VIEWS --- */}
         {activeTab === 'treatment' && userRole !== 'patient' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
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
                     patientId={selectedPatient?.id || 0} 
                     patients={patients} 
                     onUpdate={(t) => { setSelectedTreatment(t); setShowTreatmentDetails(true); }} 
                 />
             )}
            </div>
         )}
 
         {activeTab === 'medical_records' && userRole !== 'patient' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
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
         )}
 
         {activeTab === 'patients' && userRole !== 'patient' && (
             <div className={showPatientDetails || showPatientForm ? "bg-white rounded-xl shadow-sm border border-slate-200" : ""}>
                 {showPatientDetails && selectedPatient ? (
                     <PatientDetails 
                         patient={selectedPatient} 
                         onClose={() => setShowPatientDetails(false)} 
                         onEdit={() => { setShowPatientDetails(false); setShowPatientForm(true); }}
                     />
                 ) : showPatientForm ? (
                     <PatientForm patient={selectedPatient} onSubmit={() => { setShowPatientForm(false); setRefreshKey(k => k + 1); }} onCancel={() => setShowPatientForm(false)} />
                 ) : (
                     <PatientList patients={patients} onUpdate={(p) => {setSelectedPatient(p); setShowPatientForm(true);}} onDelete={(id) => deletePatient(id).then(() => setRefreshKey(k => k + 1))} onTrack={(p) => { setSelectedPatient(p); setShowPatientDetails(true); }} />
                 )}
             </div>
         )}
 
         {activeTab === 'doctors' && userRole === 'admin' && (
             <DoctorList doctors={doctors} onUpdate={(d) => { setSelectedDoctor(d); setShowDoctorForm(true); }} onDelete={(id) => deleteDoctor(id).then(() => setRefreshKey(k => k + 1))} />
         )}
 
         {activeTab === 'prescriptions' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
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
                     onUpdate={(p) => { setSelectedPrescription(p); setShowPrescriptionForm(true); }} 
                     onView={(p) => { setSelectedPrescription(p); setShowPrescriptionDetails(true); }}
                 />
             )}
            </div>
         )}
 
         {/* --- SHARED MODALS --- */}
         {showDoctorForm && !activeTab && <DoctorForm doctor={selectedDoctor} onSubmit={() => { setShowDoctorForm(false); setRefreshKey(k => k + 1); }} onCancel={() => setShowDoctorForm(false)} />}
 
         {/* --- CLOSE MAIN CONTAINER DIV --- */}
         </div>
       </main>
       </div>
     </div>
   );
 }
 
 export default App;