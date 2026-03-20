import React, { useState } from 'react';
import axios from 'axios';

interface TreatmentFormProps {
  patientId: string | number;
  onSuccess: () => void; 
}

const TreatmentForm: React.FC<TreatmentFormProps> = ({ patientId, onSuccess }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [medication, setMedication] = useState('');
  const [notes, setNotes] = useState(''); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    if (!patientId || patientId === 0) {
      alert("Error: No patient selected. Please go back to Patients and click 'TRACK'.");
      return;
    }

    if (!diagnosis || !medication) {
      alert("Palihog og fill-up sa tanan fields!");
      return;
    }

    setLoading(true);

    try {
      
      await axios.post(`http://127.0.0.1:8000/api/v1/treatments/`, {
        patient: patientId, 
        diagnosis: diagnosis,
        medication: medication,
        notes: notes, 
        treatment_date: new Date().toISOString().split('T')[0] 
      });

      alert("Treatment successfully added!");
      
      
      setDiagnosis('');
      setMedication('');
      setNotes('');
      onSuccess(); 
    } catch (error: any) {
      console.error("Error saving treatment:", error.response?.data || error.message);
      
      
      const errorDetail = error.response?.data 
        ? JSON.stringify(error.response.data) 
        : "Check if Django is running on port 8000!";
      
      alert("Failed to save treatment: " + errorDetail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Add New Treatment Record</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Diagnosis</label>
          <input 
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all" 
            placeholder="e.g. Hypertension, Viral Infection" 
            value={diagnosis} 
            onChange={(e) => setDiagnosis(e.target.value)} 
            disabled={loading}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Medication / Plan</label>
          <input 
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all" 
            placeholder="e.g. Amlodipine 5mg, Bed rest" 
            value={medication} 
            onChange={(e) => setMedication(e.target.value)} 
            disabled={loading}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Additional Notes (Optional)</label>
        <textarea 
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all" 
          placeholder="Ibutang diri ang uban detalye..." 
          rows={2}
          value={notes} 
          onChange={(e) => setNotes(e.target.value)} 
          disabled={loading}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-md ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 active:scale-95'
        }`}
      >
        {loading ? 'PROCESSING...' : 'ADD TREATMENT RECORD'}
      </button>
    </form>
  );
};

export default TreatmentForm;