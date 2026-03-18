import React, { useState, useEffect } from 'react';
import { Patient } from '../types';

interface Props {
  patient?: Patient | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const PatientForm: React.FC<Props> = ({ patient, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patient_id: '', 
    first_name: '',
    last_name: '',
    dob: '', 
    gender: 'M',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        patient_id: patient.patient_id || '',
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        dob: (patient as any).dob || '', 
        gender: patient.gender || 'M',
        phone: (patient as any).phone || '', 
        address: patient.address || '',
      });
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">
            {patient ? 'Edit Patient' : 'Add New Patient'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Hospital ID (patient_id) *</label>
              <input type="text" name="patient_id" value={formData.patient_id} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. PAT-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700">
              {patient ? 'Update Patient' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;