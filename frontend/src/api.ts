import axios from "axios";
import { Patient, Doctor } from "./types";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1", 
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
    // Note: Creating a doctor often requires custom backend logic to create the User first.
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

export default API;