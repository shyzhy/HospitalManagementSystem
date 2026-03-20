import React, { useState } from 'react';
import TreatmentForm from './TreatmentForm'; 
import TreatmentList from './TreatmentList'; 
import { Treatment } from '../types';

const TreatmentPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1); 
    setShowForm(false); 
    setSelectedTreatment(null);
  };

  const handleEdit = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200">
        <h2 className="text-2xl font-black text-pink-600 uppercase">Treatment Registry</h2>
        <button   
          onClick={() => { setSelectedTreatment(null); setShowForm(!showForm); }}
          className={`${showForm ? 'bg-slate-200 text-slate-700' : 'bg-pink-600 text-white'} px-6 py-2 rounded-lg font-bold`}
        >
          {showForm ? 'VIEW LIST' : 'ADD NEW RECORD'}
        </button>
      </div>

      {showForm ? (
          <TreatmentForm initialData={selectedTreatment} onSuccess={handleRefresh} />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <TreatmentList key={refreshKey} patientId={0} onUpdate={handleEdit} />
        </div>
      )}
    </div>
  );
};

export default TreatmentPage;