import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { createPatient, updatePatient } from '../api';

interface PatientFormProps {
  patient: Patient | null;  // null = Create, Patient = Update
  onSubmit: () => void;
  onCancel: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onSubmit, onCancel }) => {
  const isEditMode = !!patient?.id;
  
  const [formData, setFormData] = useState({
    patient_id: '',
    first_name: '',
    last_name: '',
    dob: '',
    gender: 'M',
    phone: '',
    address: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-populate form when editing existing patient
  useEffect(() => {
    if (patient) {
      setFormData({
        patient_id: patient.patient_id || '',
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        dob: patient.dob || '',
        gender: patient.gender || 'M',
        phone: patient.phone || '',
        address: patient.address || ''
      });
    } else {
      // Reset for create mode
      setFormData({
        patient_id: '',
        first_name: '',
        last_name: '',
        dob: '',
        gender: 'M',
        phone: '',
        address: ''
      });
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode && patient?.id) {
        // UPDATE: Use existing patient ID
        await updatePatient(patient.id, formData);
        console.log('Patient updated successfully');
      } else {
        // CREATE: New patient
        await createPatient(formData);
        console.log('Patient created successfully');
      }
      onSubmit(); // Close form and refresh list
    } catch (err: any) {
      console.error('Save error:', err);
      const errorMsg = err.response?.data 
        ? JSON.stringify(err.response.data) 
        : 'Failed to save patient';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                {isEditMode ? 'Edit Patient' : 'Register New Patient'}
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                {isEditMode ? `Updating: ${formData.first_name} ${formData.last_name}` : 'Enter patient details below'}
              </p>
            </div>
            <button 
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hospital ID */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Hospital ID *
                </label>
                <input
                  type="text"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  required
                  disabled={isEditMode} // Usually can't change ID when editing
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:opacity-50"
                  placeholder="e.g. HOSP-001"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>

              {/* First Name */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              {/* DOB */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="e.g. 09123456789"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                placeholder="Full address..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onCancel}
                className="px-8 py-3 bg-slate-200 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-8 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 disabled:opacity-50 transition-all"
              >
                {loading ? 'Saving...' : (isEditMode ? 'Update Patient' : 'Register Patient')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;