import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://esteemed-filter-glutton.ngrok-free.dev';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token && config.headers) {
        config.headers.Authorization = `Token ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (username: string, password: string) => {
  return api.post('/auth/token/login/', { username, password });
};

export const getUser = async () => {
  return api.get('/auth/users/me/');
};

export const register = async (data: any) => {
  return api.post('/api/v1/register/', data);
};

export const getPatients = async () => {
  return api.get('/api/v1/patients/');
};

export const getDoctors = async () => {
  return api.get('/api/v1/doctors/');
};

export const getConsultations = async () => {
  return api.get('/api/v1/consultations/');
};

export const createConsultation = async (data: any) => {
  return api.post('/api/v1/consultations/', data);
};

export const updateConsultation = async (id: number, data: any) => {
  return api.put(`/api/v1/consultations/${id}/`, data);
};

export const getTreatments = async () => {
  return api.get('/api/v1/treatments/');
};

export const createTreatment = async (data: any) => {
  return api.post('/api/v1/treatments/', data);
};

export const getPrescriptions = async () => {
  return api.get('/api/v1/prescriptions/');
};

export const createPrescription = async (data: any) => {
  return api.post('/api/v1/prescriptions/', data);
};

export const getMedicalRecords = async () => {
  return api.get('/api/v1/medical-records/');
};

export default api;
