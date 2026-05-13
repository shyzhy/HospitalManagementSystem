import React, { useState } from 'react';
import PatientProfile from '../component/PatientProfile';
import DoctorProfile from '../component/DoctorProfile';
import { Patient, Doctor } from '../types';

interface AccountViewProps {
  userRole: string | null;
  patients: Patient[];
  doctors: Doctor[];
  onRefresh: () => void;
}

const AccountView: React.FC<AccountViewProps> = ({ userRole, patients, doctors, onRefresh }) => {
  if (userRole === 'doctor') {
      const myDoctorRecord = doctors.find(d => d.id === parseInt(localStorage.getItem('doctorId') || '0'));
      return (
          <DoctorProfile 
              doctor={myDoctorRecord} 
              onUpdate={(d) => { 
                  localStorage.setItem('userName', `Dr. ${d.first_name} ${d.last_name}`);
                  onRefresh(); 
              }} 
          />
      );
  } else if (userRole === 'patient') {
      const myPatientRecord = patients.find(p => p.id === parseInt(localStorage.getItem('patientId') || '0'));
      return (
          <PatientProfile 
              patient={myPatientRecord} 
              onUpdate={() => onRefresh()} 
          />
      );
  }

  return <div>Account details not available for this role.</div>;
};

export default AccountView;
