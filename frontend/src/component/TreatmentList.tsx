import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Treatment {
  id: number;
  diagnosis: string;
  medication: string;
  treatment_date: string;
  patient: number;
}

interface TreatmentListProps {
  patientId: string | number;
}

const TreatmentList: React.FC<TreatmentListProps> = ({ patientId }) => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  
  const fetchTreatments = async () => {
    try {
      
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/treatments/?patient=${patientId}`);
      setTreatments(response.data);
    } catch (error) {
      console.error("Error fetching treatments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, [patientId]);

  if (loading) return <p className="p-4 text-gray-500">Loading records...</p>;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Past Treatment Records</h3>
      
      {treatments.length === 0 ? (
        <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg border">
          No treatment records found for this patient.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Diagnosis</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Medication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {treatments.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-700">{t.treatment_date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.diagnosis}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{t.medication}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TreatmentList;