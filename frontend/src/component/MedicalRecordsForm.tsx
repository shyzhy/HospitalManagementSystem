import React, { useState, useEffect } from 'react';
import { MedicalRecord, Patient } from '../types';
import { createMedicalRecord, updateMedicalRecord } from '../api';

interface MedicalRecordFormProps {
  record?: MedicalRecord | null;  // If provided = Edit mode, null = Create mode
  patients: Patient[];            // List of patients to select from
  onSuccess: () => void;          // Callback after successful save
  onCancel: () => void;           // Callback to close form
}

const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({ 
  record, 
  patients, 
  onSuccess, 
  onCancel 
}) => {
  const isEditMode = !!record;
  
  const [formData, setFormData] = useState({
    patient: record?.patient || '',
    blood_type: record?.blood_type || '',
    allergies: record?.allergies || '',
    chronic_conditions: record?.chronic_conditions || '',
    medical_history: record?.medical_history || '',
    emergency_contact_name: record?.emergency_contact_name || '',
    emergency_contact_phone: record?.emergency_contact_phone || '',
    attachment: null as File | null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, attachment: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Build FormData for file upload support
      const submitData = new FormData();
      submitData.append('patient', formData.patient.toString());
      submitData.append('blood_type', formData.blood_type);
      submitData.append('allergies', formData.allergies);
      submitData.append('chronic_conditions', formData.chronic_conditions);
      submitData.append('medical_history', formData.medical_history);
      submitData.append('emergency_contact_name', formData.emergency_contact_name);
      submitData.append('emergency_contact_phone', formData.emergency_contact_phone);
      
      if (formData.attachment) {
        submitData.append('attachment', formData.attachment);
      }

      if (isEditMode && record?.id) {
        await updateMedicalRecord(record.id, submitData);
      } else {
        await createMedicalRecord(submitData);
      }
      
      onSuccess();
    } catch (err) {
      setError('Failed to save medical record. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 mb-6">
      <h3 className="text-lg font-black text-slate-800 mb-4 uppercase tracking-widest">
        {isEditMode ? 'Edit Medical Record' : 'Create Medical Record'}
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Patient Select */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Patient
            </label>
            <select
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              required
              disabled={isEditMode} // Can't change patient in edit mode (OneToOne)
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name} (ID: {p.patient_id})
                </option>
              ))}
            </select>
          </div>

          {/* Blood Type */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Blood Type
            </label>
            <input
              type="text"
              name="blood_type"
              value={formData.blood_type}
              onChange={handleChange}
              placeholder="O+, A-, etc."
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Emergency Contact Name */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Emergency Contact
            </label>
            <input
              type="text"
              name="emergency_contact_name"
              value={formData.emergency_contact_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Emergency Contact Phone */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Emergency Phone
            </label>
            <input
              type="text"
              name="emergency_contact_phone"
              value={formData.emergency_contact_phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Allergies */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Allergies
          </label>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Chronic Conditions */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Chronic Conditions
          </label>
          <textarea
            name="chronic_conditions"
            value={formData.chronic_conditions}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Medical History */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Medical History
          </label>
          <textarea
            name="medical_history"
            value={formData.medical_history}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* File Attachment */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Attachment {isEditMode && record?.attachment && '(Current file will be replaced)'}
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-slate-200 rounded text-sm text-slate-600"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded hover:bg-slate-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalRecordForm;