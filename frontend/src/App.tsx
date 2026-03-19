import React, { useState, useEffect } from 'react';
import './App.css';
import PatientList from './component/PatientList';
import DoctorList from './component/DoctorList';
import PatientForm from './component/PatientForm';
import DoctorForm from './component/DoctorForm';
import { getPatients, createPatients, updatePatient, deletePatients } from './api';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from './api';
import { Patient, Doctor } from './types';
import RecordConsultation from './component/RecordConsultation'; 
import ConsultationList from './component/ConsultationList'; // Import the new list component

function App() {
  const [activeTab, setActiveTab] = useState<'patients' | 'doctors' | 'consultations'>('patients');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  
  // New state to toggle between the Form and the History List
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'patients') {
      fetchPatients();
    } else if (activeTab === 'doctors') {
      fetchDoctors();
    }
  }, [activeTab]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSubmit = async (data: any) => {
    try {
      if (selectedPatient && selectedPatient.id) {
        await updatePatient(selectedPatient.id, data);
      } else {
        await createPatients(data);
      }
      setShowPatientForm(false);
      fetchPatients();
    } catch (error) {
      alert('Error saving patient.');
      console.error(error);
    }
  };

  const handleDoctorSubmit = async (data: any) => {
    try {
      if (selectedDoctor && selectedDoctor.id) {
        await updateDoctor(selectedDoctor.id, data);
      } else {
        await createDoctor(data);
      }
      setShowDoctorForm(false);
      fetchDoctors();
    } catch (error) {
      alert('Error saving doctor.');
      console.error(error);
    }
  };

  const handleDeletePatient = async (id: number) => {
    if (window.confirm("Are you sure?")) {
        await deletePatients(id);
        fetchPatients();
    }
  };

  const handleDeleteDoctor = async (id: number) => {
    if (window.confirm("Are you sure?")) {
        await deleteDoctor(id);
        fetchDoctors();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
            <span className="font-bold text-xl text-emerald-600 tracking-tight">MED FLOW</span>
            <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveTab('patients')} 
                  className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${activeTab === 'patients' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  PATIENTS
                </button>
                <button 
                  onClick={() => setActiveTab('doctors')} 
                  className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${activeTab === 'doctors' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  DOCTORS
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('consultations');
                    setShowConsultationForm(false); // Reset to history view when clicking tab
                  }} 
                  className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${activeTab === 'consultations' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  RECORD CONSULTATION
                </button>
            </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black uppercase text-slate-800">
            {activeTab === 'patients' && 'Patient Directory'}
            {activeTab === 'doctors' && 'Doctor Directory'}
            {activeTab === 'consultations' && (showConsultationForm ? 'New Consultation' : 'Consultation History')}
          </h1>
          
          <button 
            onClick={() => {
              if(activeTab === 'patients') { setShowPatientForm(true); setSelectedPatient(null); }
              else if(activeTab === 'doctors') { setShowDoctorForm(true); setSelectedDoctor(null); }
              else { setShowConsultationForm(!showConsultationForm); } // Toggle between list and form
            }}
            className={`px-6 py-2 rounded-lg text-white font-bold shadow-lg transition-transform active:scale-95 
              ${activeTab === 'patients' ? 'bg-emerald-600' : activeTab === 'doctors' ? 'bg-blue-600' : 'bg-orange-600'}`}
          >
            {activeTab === 'consultations' ? (showConsultationForm ? 'BACK TO HISTORY' : 'ADD NEW RECORD') : 'ADD NEW'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading...</div>
        ) : (
          <>
            {activeTab === 'patients' && <PatientList patients={patients} onUpdate={(p) => {setSelectedPatient(p); setShowPatientForm(true);}} onDelete={handleDeletePatient} />}
            {activeTab === 'doctors' && <DoctorList doctors={doctors} onUpdate={(d) => {setSelectedDoctor(d); setShowDoctorForm(true);}} onDelete={handleDeleteDoctor} />}
            
            {activeTab === 'consultations' && (
              showConsultationForm ? <RecordConsultation /> : <ConsultationList />
            )}
          </>
        )}

        {/* Modals */}
        {showPatientForm && <PatientForm patient={selectedPatient} onSubmit={handlePatientSubmit} onCancel={() => setShowPatientForm(false)} />}
        {showDoctorForm && <DoctorForm doctor={selectedDoctor} onSubmit={handleDoctorSubmit} onCancel={() => setShowDoctorForm(false)} />}
      </main>
    </div>
  );
}

export default App;