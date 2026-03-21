import axios from "axios";
import { Patient, Doctor, Consultation, Prescription, Treatment, MedicalRecord } from "./types";

const API_URL = "http://127.0.0.1:8000/api/v1/";

const API = axios.create({
    baseURL: API_URL,
});

// AUTH INTERCEPTOR
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- PATIENTS ---
export const getPatients = async (): Promise<Patient[]> => {
    const response = await API.get<Patient[]>("patients/");
    return response.data;
};
export const createPatient = async (data: Partial<Patient>): Promise<Patient> => {
    const response = await API.post<Patient>("patients/", data);
    return response.data;
};
export const updatePatient = async (id: number, data: Partial<Patient>): Promise<Patient> => {
    const response = await API.put<Patient>(`patients/${id}/`, data);
    return response.data;
};
export const deletePatient = async (id: number): Promise<void> => {
    await API.delete(`patients/${id}/`);
};

// --- DOCTORS ---
export const getDoctors = async (): Promise<Doctor[]> => {
    const response = await API.get<Doctor[]>("doctors/");
    return response.data;
};
export const createDoctor = async (data: Partial<Doctor>): Promise<Doctor> => {
    const response = await API.post<Doctor>("doctors/", data);
    return response.data;
};
export const updateDoctor = async (id: number, data: Partial<Doctor>): Promise<Doctor> => {
    const response = await API.put<Doctor>(`doctors/${id}/`, data);
    return response.data;
};
export const deleteDoctor = async (id: number): Promise<void> => {
    await API.delete(`doctors/${id}/`);
};

// --- CONSULTATIONS ---
export const getConsultations = async (): Promise<Consultation[]> => {
    const response = await API.get<Consultation[]>("consultations/");
    return response.data;
};
export const createConsultation = async (data: Partial<Consultation>): Promise<Consultation> => {
    const response = await API.post<Consultation>("consultations/", data);
    return response.data;
};
export const updateConsultation = async (id: number, data: Partial<Consultation>): Promise<Consultation> => {
    const response = await API.put<Consultation>(`consultations/${id}/`, data);
    return response.data;
};
export const deleteConsultation = async (id: number): Promise<void> => {
    await API.delete(`consultations/${id}/`);
};

// --- PRESCRIPTIONS ---
export const getPrescriptions = async (): Promise<Prescription[]> => {
    const response = await API.get<Prescription[]>("prescriptions/");
    return response.data;
};
export const createPrescription = async (data: Partial<Prescription>): Promise<Prescription> => {
    const response = await API.post<Prescription>("prescriptions/", data);
    return response.data;
};
export const updatePrescription = async (id: number, data: Partial<Prescription>): Promise<Prescription> => {
    const response = await API.put<Prescription>(`prescriptions/${id}/`, data);
    return response.data;
};
export const deletePrescription = async (id: number): Promise<void> => {
    await API.delete(`prescriptions/${id}/`);
};

// --- TREATMENTS ---
export const getTreatments = async (): Promise<Treatment[]> => {
    const response = await API.get<Treatment[]>("treatments/");
    return response.data;
};
export const getTreatmentsByPatient = async (patientId: number): Promise<Treatment[]> => {
    const response = await API.get<Treatment[]>(`treatments/?patient=${patientId}`);
    return response.data;
};
export const createTreatment = async (data: Partial<Treatment>): Promise<Treatment> => {
    const response = await API.post<Treatment>("treatments/", data);
    return response.data;
};
export const updateTreatment = async (id: number, data: Partial<Treatment>): Promise<Treatment> => {
    const response = await API.put<Treatment>(`treatments/${id}/`, data);
    return response.data;
};
export const deleteTreatment = async (id: number): Promise<void> => {
    await API.delete(`treatments/${id}/`);
};

// --- MEDICAL RECORDS ---
export const getMedicalRecords = async (): Promise<MedicalRecord[]> => {
    const response = await API.get<MedicalRecord[]>("medical-records/");
    return response.data;
};
export const getMedicalRecord = async (id: number): Promise<MedicalRecord> => {
    const response = await API.get<MedicalRecord>(`medical-records/${id}/`);
    return response.data;
};
export const getMedicalRecordByPatient = async (patientId: number): Promise<MedicalRecord> => {
    const response = await API.get<MedicalRecord>(`medical-records/?patient=${patientId}`);
    return Array.isArray(response.data) ? response.data[0] : response.data;
};
export const createMedicalRecord = (data: any) => 
    API.post('/medical-records/', data);

export const updateMedicalRecord = (id: number, data: any) => 
    API.patch(`/medical-records/${id}/`, data);

export const deleteMedicalRecord = async (id: number): Promise<void> => {
    await API.delete(`medical-records/${id}/`);
};

export default API;