import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Treatment } from '../types';

interface TreatmentFormProps {
  initialData?: Treatment | null;
  onSuccess: () => void; 
}

const TreatmentForm: React.FC<TreatmentFormProps> = ({ initialData, onSuccess }) => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [treatmentName, setTreatmentName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, patRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/v1/doctors/'),
          axios.get('http://127.0.0.1:8000/api/v1/patients/')
        ]);
        setDoctors(docRes.data);
        setPatients(patRes.data);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (initialData) {
      setSelectedDoctor(String(initialData.doctor));
      setSelectedPatient(String(initialData.patient));
      setTreatmentName(initialData.treatment_name);
      setDescription(initialData.description);
    } else {
      setSelectedDoctor('');
      setSelectedPatient('');
      setTreatmentName('');
      setDescription('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        patient: Number(selectedPatient), 
        doctor: Number(selectedDoctor),
        treatment_name: treatmentName,
        description: description,
      };

      if (initialData?.id) {
        await axios.put(`http://127.0.0.1:8000/api/v1/treatments/${initialData.id}/`, payload);
      } else {
        await axios.post(`http://127.0.0.1:8000/api/v1/treatments/`, payload);
      }

      alert(initialData ? "Record Updated Successfully!" : "New Record Saved!");
      onSuccess(); 
    } catch (error: any) {
      alert("Error: " + JSON.stringify(error.response?.data));
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
          {initialData ? '📝 Edit Treatment Record' : '➕ New Treatment Record'}
        </h3>
        <p className="text-slate-500 text-xs font-bold uppercase mt-1">Please ensure all medical details are accurate</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PATIENT FIELD */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient Name</label>
          <select 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-slate-700 font-medium" 
            value={selectedPatient} 
            onChange={(e) => setSelectedPatient(e.target.value)} 
            required
          >
            <option value="">Select Patient...</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
          </select>
        </div>

        {/* DOCTOR FIELD */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Attending Physician</label>
          <select 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-slate-700 font-medium" 
            value={selectedDoctor} 
            onChange={(e) => setSelectedDoctor(e.target.value)} 
            required
          >
            <option value="">Select Doctor...</option>
            {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.user_details?.first_name} {d.user_details?.last_name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DIAGNOSIS FIELD */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diagnosis / Condition</label>
          <input 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all placeholder:text-slate-300" 
            placeholder="e.g. Acute Bronchitis" 
            value={treatmentName} 
            onChange={(e) => setTreatmentName(e.target.value)} 
            required 
          />
        </div>

        {/* MEDICATION FIELD */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medication / Treatment Plan</label>
          <input 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all placeholder:text-slate-300" 
            placeholder="e.g. 500mg Paracetamol every 4 hours" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </div>
      </div>
      
      <div className="pt-4">
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 rounded-xl font-black text-white uppercase tracking-widest shadow-lg transition-all active:scale-[0.98] ${
            loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 shadow-teal-100'
          }`}
        >
          {loading ? 'Processing...' : initialData ? 'Update Clinical Record' : 'Save Clinical Record'}
        </button>
      </div>
    </form>
  );
};

export default TreatmentForm;