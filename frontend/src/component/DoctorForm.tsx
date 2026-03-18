import React, { useState, useEffect } from 'react';
import { Doctor } from '../types';

interface Props {
  doctor?: Doctor | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const DoctorForm: React.FC<Props> = ({ doctor, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    specialization: '',
    license_number: '',
    is_available: true
  });

  useEffect(() => {
    if (doctor) {
      setFormData({
        username: doctor.user?.username || '',
        password: '', // Leave blank on edit
        first_name: doctor.user?.first_name || '',
        last_name: doctor.user?.last_name || '',
        specialization: doctor.specialization || '',
        license_number: doctor.license_number || '',
        is_available: doctor.is_available ?? true
      });
    }
  }, [doctor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If editing, we remove password so we don't accidentally overwrite it with blank
    const submissionData = {...formData};
    if (doctor) delete (submissionData as any).password;
    onSubmit(submissionData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 p-4 text-white font-bold text-lg">
          {doctor ? 'Update Doctor Profile' : 'Register New Doctor'}
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!doctor && (
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="border p-2 rounded" required />
              <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="border p-2 rounded" required />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="First Name" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="border p-2 rounded" />
            <input placeholder="Last Name" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="border p-2 rounded" />
          </div>
          <input placeholder="Specialization" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full border p-2 rounded" required />
          <input placeholder="License Number" value={formData.license_number} onChange={e => setFormData({...formData, license_number: e.target.value})} className="w-full border p-2 rounded" required />
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={formData.is_available} onChange={e => setFormData({...formData, is_available: e.target.checked})} className="w-4 h-4" />
            <span className="text-sm font-medium text-slate-700">Available for Consultations</span>
          </label>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-400 font-bold">CANCEL</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">SAVE DOCTOR</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorForm;