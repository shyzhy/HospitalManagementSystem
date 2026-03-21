import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MedicalRecord, Patient } from '../types';

interface MedicalRecordsListProps {
  onUpdate: (record: MedicalRecord) => void;
  patients: Patient[];
}

const MedicalRecordsList: React.FC<MedicalRecordsListProps> = ({ onUpdate, patients }) => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const fetchMedicalRecords = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/v1/medical-records/');
      setMedicalRecords(res.data);
    } catch (e) { 
      console.error(e); 
    }
  };

  useEffect(() => { 
    fetchMedicalRecords(); 
  }, []);

  const getPatientName = (patientId: number) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      return patient.first_name + ' ' + patient.last_name;
    }
    return 'Patient #' + patientId;
  };

  const handleRemove = async (id: number) => {
    if (window.confirm("Remove this medical record? This will also remove associated treatments and prescriptions.")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/v1/medical-records/${id}/`);
        fetchMedicalRecords();
      } catch (e) { 
        alert("Failed to remove record."); 
      }
    }
  };

  const truncateText = (text: string, maxLength: number = 15) => {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const toggleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-3 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
            <th className="px-3 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood</th>
            <th className="px-3 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Allergies</th>
            <th className="px-3 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Conditions</th>
            <th className="px-3 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">History</th>
            <th className="px-3 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Treatments</th>
            <th className="px-3 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Prescriptions</th>
            <th className="px-3 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Files</th>
            <th className="px-3 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {medicalRecords.map((record) => (
            <React.Fragment key={record.id}>
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="px-3 py-4 text-sm font-black text-slate-800">
                  <button 
                    onClick={() => toggleExpand(record.id!)}
                    className="flex items-center gap-2 hover:text-emerald-600 transition-colors"
                  >
                    <span>{expandedRow === record.id ? '▼' : '▶'}</span>
                    {getPatientName(record.patient)}
                  </button>
                </td>
                
                <td className="px-3 py-4 text-sm text-slate-600 font-mono">
                  {record.blood_type || '-'}
                </td>
                
                <td className="px-3 py-4 text-sm text-slate-600 max-w-xs" title={record.allergies}>
                  {truncateText(record.allergies, 12)}
                </td>
                
                <td className="px-3 py-4 text-sm text-slate-600 max-w-xs" title={record.chronic_conditions}>
                  {truncateText(record.chronic_conditions, 12)}
                </td>

                <td className="px-3 py-4 text-sm text-slate-600 max-w-xs" title={record.medical_history}>
                  {truncateText(record.medical_history, 15)}
                </td>

                {/* Treatments Count & Summary */}
                <td className="px-3 py-4 text-center">
                  {record.treatments && record.treatments.length > 0 ? (
                    <div className="flex flex-col items-center">
                      <span className="inline-flex items-center justify-center px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                        {record.treatments.length}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 truncate max-w-[80px]">
                        {record.treatments.map(t => t.treatment_name).join(', ')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-300 text-xs">-</span>
                  )}
                </td>

                {/* Prescriptions Count & Summary */}
                <td className="px-3 py-4 text-center">
                  {record.prescriptions && record.prescriptions.length > 0 ? (
                    <div className="flex flex-col items-center">
                      <span className="inline-flex items-center justify-center px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                        {record.prescriptions.length}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 truncate max-w-[80px]">
                        {record.prescriptions.map(p => p.medication).join(', ')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-300 text-xs">-</span>
                  )}
                </td>

                <td className="px-3 py-4 text-center">
                  {record.attachment ? (
                    <a 
                      href={record.attachment} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors text-xs"
                      title="View Attachment"
                      onClick={(e) => e.stopPropagation()}
                    >
                      📎
                    </a>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>
                
                <td className="px-3 py-4 text-right space-x-2">
                  <button 
                    onClick={() => onUpdate(record)} 
                    className="text-emerald-500 hover:text-emerald-700 font-black text-[10px] uppercase tracking-widest transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => record.id && handleRemove(record.id)} 
                    className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase tracking-widest transition-colors"
                  >
                    Remove
                  </button>
                </td>
              </tr>

              {/* Expanded Details Section */}
              {expandedRow === record.id && (
                <tr className="bg-slate-50/50">
                  <td colSpan={9} className="px-6 py-4 border-b border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Treatments Detail */}
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          Treatments ({record.treatments?.length || 0})
                        </h4>
                        {record.treatments && record.treatments.length > 0 ? (
                          <ul className="space-y-2">
                            {record.treatments.map((treatment, idx) => (
                              <li key={idx} className="text-sm text-slate-700 border-l-2 border-purple-200 pl-3">
                                <span className="font-bold text-slate-800">{treatment.treatment_name}</span>
                                <span className="text-slate-400 text-xs ml-2">({treatment.treatment_date})</span>
                                {treatment.description && (
                                  <p className="text-xs text-slate-500 mt-1">{treatment.description}</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-400 italic">No treatments recorded</p>
                        )}
                      </div>

                      {/* Prescriptions Detail */}
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          Prescriptions ({record.prescriptions?.length || 0})
                        </h4>
                        {record.prescriptions && record.prescriptions.length > 0 ? (
                          <ul className="space-y-2">
                            {record.prescriptions.map((prescription, idx) => (
                              <li key={idx} className="text-sm text-slate-700 border-l-2 border-amber-200 pl-3">
                                <span className="font-bold text-slate-800">{prescription.medication}</span>
                                <span className="text-slate-400 text-xs ml-2">({prescription.date_prescribed})</span>
                                <div className="text-xs text-slate-500 mt-1">
                                  {prescription.dosage} • {prescription.frequency} • {prescription.duration}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-400 italic">No prescriptions recorded</p>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {medicalRecords.length === 0 && (
        <div className="px-6 py-12 text-center text-slate-400 text-sm">
          No medical records found.
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsList;