import React, { useState, useEffect } from 'react';
import { getConsultations, deleteConsultation, updateConsultationStatus } from '../api';
import { Consultation, Patient } from '../types';

interface ConsultationListProps {
    patients: Patient[];
    onUpdate: (consultation: Consultation) => void;
}

const ConsultationList: React.FC<ConsultationListProps> = ({ patients, onUpdate }) => {
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

    const userRole = localStorage.getItem('role');

    useEffect(() => {
        fetchConsultations();
    }, []);

    const fetchConsultations = async () => {
        try {
            setLoading(true);
            const data = await getConsultations();
            setConsultations(data);
        } catch (error) {
            console.error("Error fetching consultations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Permanent Action: Are you sure you want to remove this clinical encounter?")) {
            try {
                await deleteConsultation(id);
                fetchConsultations();
            } catch (error) {
                console.error("Error deleting consultation:", error);
            }
        }
    };

    const handleStatusUpdate = async (
        e: React.MouseEvent,
        consultation: Consultation,
        status: 'approved' | 'rejected'
    ) => {
        e.stopPropagation();

        let rejectionReason = '';

        if (status === 'rejected') {
            rejectionReason = window.prompt('Enter rejection reason:') || '';

            if (!rejectionReason.trim()) {
                alert('Rejection reason is required.');
                return;
            }
        }

        try {
            await updateConsultationStatus(
                consultation.id,
                status,
                rejectionReason
            );

            fetchConsultations();
        } catch (error) {
            console.error("Error updating appointment status:", error);
            alert('Failed to update appointment status.');
        }
    };

    const getAppointmentStatus = (consultation: Consultation) => {
        return consultation.appointment_status || 'pending';
    };

    const filteredConsultations = consultations.filter((consultation) => {
        const keyword = searchTerm.toLowerCase();

        const matchesSearch =
            consultation.patient_name?.toLowerCase().includes(keyword) ||
            consultation.doctor_name?.toLowerCase().includes(keyword) ||
            consultation.consultation_date?.toLowerCase().includes(keyword);

        if (userRole === 'doctor') {
            return matchesSearch && getAppointmentStatus(consultation) === activeTab;
        }

        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="p-20 text-center space-y-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#556ee6] border-t-transparent"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Accessing Clinical Ledger...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 px-4 pt-4">
            {/* TOP ACTIONS & TABS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* SEARCH AREA */}
                <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200/80 flex items-center gap-3 transition-all focus-within:shadow-[0_0_0_4px_rgba(85,110,230,0.05)] focus-within:border-[#556ee6]/30">
                    <div className="text-slate-400 pl-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    <input
                        type="text"
                        placeholder="Search clinical encounters..."
                        className="w-full bg-transparent outline-none font-medium text-slate-800 placeholder:text-slate-400 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* APPOINTMENT STATUS TABS - DOCTOR ONLY */}
                {userRole === 'doctor' && (
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === 'pending'
                                    ? 'bg-white text-[#556ee6] shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Pending
                        </button>

                        <button
                            onClick={() => setActiveTab('approved')}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === 'approved'
                                    ? 'bg-white text-emerald-600 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Approved
                        </button>

                        <button
                            onClick={() => setActiveTab('rejected')}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === 'rejected'
                                    ? 'bg-white text-red-600 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Rejected
                        </button>
                    </div>
                )}
            </div>

            <div className="w-full overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Encounter Date
                            </th>

                            <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Patient Identity
                            </th>

                            <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">
                                {userRole === 'doctor' ? 'Appointment Status' : 'Attending Physician'}
                            </th>

                            <th className="px-4 sm:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {filteredConsultations.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-6 py-20 text-center text-slate-300 font-bold text-xs uppercase tracking-[0.2em]"
                                >
                                    No {userRole === 'doctor' ? activeTab : ''} clinical encounters archived
                                </td>
                            </tr>
                        ) : (
                            filteredConsultations.map((consultation) => {
                                const appointmentStatus = getAppointmentStatus(consultation);

                                return (
                                    <tr
                                        key={consultation.id}
                                        className="hover:bg-slate-50/50 transition-all duration-300 group cursor-pointer"
                                        onClick={() => onUpdate(consultation)}
                                    >
                                        <td className="px-4 sm:px-6 py-5">
                                            <div className="text-[10px] font-black text-[#556ee6] bg-[#556ee6]/5 px-2 py-1 rounded inline-block uppercase tracking-widest border border-[#556ee6]/10">
                                                {consultation.consultation_date
                                                    ? new Date(consultation.consultation_date).toLocaleDateString(
                                                        undefined,
                                                        {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        }
                                                    )
                                                    : 'N/A'}
                                            </div>
                                        </td>

                                        <td className="px-4 sm:px-6 py-5">
                                            <div className="font-black text-slate-800 tracking-tight text-sm group-hover:text-[#556ee6] transition-colors">
                                                {consultation.patient_name || 'Unknown Patient'}
                                            </div>

                                            {appointmentStatus === 'rejected' && consultation.rejection_reason && (
                                                <div className="mt-1 text-[10px] text-red-400 font-bold">
                                                    Reason: {consultation.rejection_reason}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 sm:px-6 py-5 hidden sm:table-cell">
                                            {userRole === 'doctor' ? (
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`w-1.5 h-1.5 rounded-full ${
                                                            appointmentStatus === 'approved'
                                                                ? 'bg-emerald-400'
                                                                : appointmentStatus === 'rejected'
                                                                ? 'bg-red-400'
                                                                : 'bg-orange-400'
                                                        }`}
                                                    ></div>

                                                    <span
                                                        className={`text-[10px] font-black uppercase tracking-widest ${
                                                            appointmentStatus === 'approved'
                                                                ? 'text-emerald-600'
                                                                : appointmentStatus === 'rejected'
                                                                ? 'text-red-500'
                                                                : 'text-orange-500'
                                                        }`}
                                                    >
                                                        {appointmentStatus}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                                    <span className="text-[11px] font-bold text-slate-500 italic">
                                                        {consultation.doctor_name}
                                                    </span>
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 sm:px-6 py-5 text-right opacity-60 group-hover:opacity-100 transition-opacity">
                                            <div className="flex items-center justify-end gap-3">
                                                {userRole === 'doctor' && appointmentStatus === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={(e) => handleStatusUpdate(e, consultation, 'approved')}
                                                            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                        >
                                                            Approve
                                                        </button>

                                                        <button
                                                            onClick={(e) => handleStatusUpdate(e, consultation, 'rejected')}
                                                            className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onUpdate(consultation);
                                                    }}
                                                    className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#556ee6] hover:text-white transition-all shadow-sm"
                                                >
                                                    Inspect
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        consultation.id && handleDelete(consultation.id);
                                                    }}
                                                    className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                                    title="Void Encounter"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConsultationList;