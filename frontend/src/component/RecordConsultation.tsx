import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface RecordConsultationProps {
  initialData?: any | null;
  onSuccess: () => void;
}

const RecordConsultation: React.FC<RecordConsultationProps> = ({ initialData, onSuccess }) => {
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // MATCHING YOUR DJANGO MODEL: patient, doctor, diagnosis, symptoms
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    diagnosis: '',
    symptoms: '' 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patRes, docRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/v1/patients/'),
          axios.get('http://127.0.0.1:8000/api/v1/doctors/')
        ]);
        setPatients(patRes.data);
        setDoctors(docRes.data.filter((d: any) => d.is_available || (initialData && d.id === initialData.doctor)));
      } catch (e) { console.error("Fetch Error:", e); }
    };
    fetchData();

    if (initialData) {
      setFormData({
        patient: String(initialData.patient),
        doctor: String(initialData.doctor),
        diagnosis: initialData.diagnosis || '',
        symptoms: initialData.symptoms || '' // Updated from consultation_notes
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        patient: Number(formData.patient),
        doctor: Number(formData.doctor),
        diagnosis: formData.diagnosis,
        symptoms: formData.symptoms // Updated key
      };

      if (initialData?.id) {
        await axios.put(`http://127.0.0.1:8000/api/v1/consultations/${initialData.id}/`, payload);
      } else {
        await axios.post('http://127.0.0.1:8000/api/v1/consultations/', payload);
      }
      onSuccess();
    } catch (err: any) {
      console.error("Save Error:", err.response?.data);
      alert("Error saving record: " + JSON.stringify(err.response?.data));
    } finally { setLoading(false); }
  };

  return (
    <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
          {initialData ? '📝 Edit Consultation' : '➕ Record New Consultation'}
        </h3>
        <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">Clinical Data Entry</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient</label>
            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none" 
              value={formData.patient} onChange={(e) => setFormData({...formData, patient: e.target.value})} required>
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Attending Doctor</label>
            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600 focus:ring-2 focus:ring-emerald-500 outline-none" 
              value={formData.doctor} onChange={(e) => setFormData({...formData, doctor: e.target.value})} required>
              <option value="">Select Doctor</option>
              {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.user_details?.first_name} {d.user_details?.last_name}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diagnosis</label>
          <input 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
            placeholder="e.g. Hypertension, Type 2 Diabetes"
            value={formData.diagnosis} 
            onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} 
            required 
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient Symptoms</label>
          <textarea 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-32 focus:ring-2 focus:ring-emerald-500 outline-none" 
            placeholder="Describe the symptoms reported by the patient..."
            value={formData.symptoms} 
            onChange={(e) => setFormData({...formData, symptoms: e.target.value})} 
            required
          />
        </div>

        <div className="pt-4">
          <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 text-white font-black rounded-xl uppercase tracking-widest shadow-lg shadow-emerald-50 active:scale-95 transition-all">
            {loading ? 'Syncing with Database...' : initialData ? 'Update Consultation' : 'Save Consultation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecordConsultation;