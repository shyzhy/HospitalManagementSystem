import React, { useState } from 'react';
import TreatmentForm from './TreatmentForm'; 
import TreatmentList from './TreatmentList'; 

const TreatmentPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);

  
  const patientId = 2; 

  const handleRefresh = () => {

    setRefreshKey(prev => prev + 1); 
    setShowForm(false); 
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-teal-800 uppercase tracking-tight">
            Patient Treatment Records
          </h2>
          <p className="text-gray-500 mt-1">Viewing records for: <span className="font-bold text-gray-700">Marynel Wacan</span></p>
        </div>
        
        <button  
          onClick={() => setShowForm(!showForm)}
          className={`${
            showForm ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-800 hover:bg-slate-900'
          } text-white px-6 py-2 rounded-lg font-bold transition-all shadow-md`}
        >
          {showForm ? 'CANCEL' : 'ADD NEW RECORD'}
        </button>
      </div>

      {/* 1. form */}
      {showForm && (
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <TreatmentForm patientId={patientId} onSuccess={handleRefresh} />
        </div>
      )}

      {/* 2. the list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <TreatmentList key={refreshKey} patientId={patientId} />
      </div>
    </div>
  );
};

export default TreatmentPage;