import axios from "axios";
import { Patient, Doctor, Consultation } from "./types";

// Defining this variable fixes the 'API_URL is not defined' error in your screenshot
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
        // Using API.post ensures we hit port 8000, not port 3000
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