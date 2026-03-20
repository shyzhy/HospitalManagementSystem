import axios from "axios";
import { Patient, Doctor, Consultation, Prescription } from "./types";

const API_URL = "http://127.0.0.1:8000/api/v1";

const API = axios.create({
    baseURL: API_URL, 
});

// ==================== PATIENTS ====================
export const getPatients = async (): Promise<Patient[]> => {
    const response = await API.get<Patient[]>("patients/");
    return response.data;
};

export const createPatients = async (data: Partial<Patient>): Promise<Patient> => {
    const response = await API.post<Patient>("patients/", data);
    return response.data;
};

export const updatePatient = async (id: number, data: Partial<Patient>): Promise<Patient> => {
    const response = await API.put<Patient>(`patients/${id}/`, data);
    return response.data;
};

export const deletePatients = async (id: number): Promise<void> => {
    await API.delete(`patients/${id}/`);
};

// ==================== DOCTORS ====================
export const getDoctors = async (): Promise<Doctor[]> => {
    const response = await API.get<Doctor[]>("doctors/");
    return response.data;
};

export const createDoctor = async (data: any): Promise<Doctor> => {
    const response = await API.post<Doctor>("doctors/", data);
    return response.data;
};

export const updateDoctor = async (id: number, data: any): Promise<Doctor> => {
    const response = await API.put<Doctor>(`doctors/${id}/`, data);
    return response.data;
};

export const deleteDoctor = async (id: number): Promise<void> => {
    await API.delete(`doctors/${id}/`);
};

// ==================== CONSULTATIONS ====================
export const createConsultation = async (data: any) => {
    try {
        const response = await API.post("consultations/", data);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const getConsultations = async (): Promise<Consultation[]> => {
    const response = await API.get<Consultation[]>("consultations/");
    return response.data;
};

// ==================== PRESCRIPTIONS ====================

// 1. Get all prescriptions
export const getPrescriptions = async (): Promise<Prescription[]> => {
    const response = await API.get<Prescription[]>("prescriptions/");
    return response.data;
};

// 2. Get prescriptions for a specific consultation
export const getPrescriptionsByConsultation = async (consultationId: number): Promise<Prescription[]> => {
    const response = await API.get<Prescription[]>(`prescriptions/?consultation=${consultationId}`);
    return response.data;
};

// 3. Create a new prescription
export const createPrescription = async (data: Partial<Prescription>): Promise<Prescription> => {
    try {
        const response = await API.post<Prescription>("prescriptions/", data);
        return response.data;
    } catch (error) {
        console.error("Prescription API Error:", error);
        throw error;
    }
};

// 4. UPDATE prescription (FIX: Added this to remove red errors in App.tsx)
export const updatePrescription = async (id: number, data: Partial<Prescription>): Promise<Prescription> => {
    try {
        const response = await API.put<Prescription>(`prescriptions/${id}/`, data);
        return response.data;
    } catch (error) {
        console.error("Update Prescription Error:", error);
        throw error;
    }
};

// 5. Delete a prescription
export const deletePrescription = async (id: number): Promise<void> => {
    await API.delete(`prescriptions/${id}/`);
};