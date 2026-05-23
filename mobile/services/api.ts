import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const API_URL = 'https://esteemed-filter-glutton.ngrok-free.dev';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
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

export const getPatient = async (id: number) => {
  return api.get(`/api/v1/patients/${id}/`);
};

export const getDoctors = async () => {
  return api.get('/api/v1/doctors/');
};

export const getAvailableDoctors = async () => {
    return api.get('/api/v1/doctors/?available=true');
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

export const getNotifications = async () => {
  return api.get('/api/v1/notifications/');
};

export const updateNotification = async (id: number, data: any) => {
  return api.patch(`/api/v1/notifications/${id}/`, data);
};

export const updatePatient = async (id: number, data: any) => {
  return api.patch(`/api/v1/patients/${id}/`, data);
};

export const uploadProfilePicture = async (type: 'patient' | 'doctor', id: number, file: any) => {
  const formData = new FormData();
  // In React Native, the file object usually looks like { uri, name, type }
  formData.append('profile_picture', file);
  return api.post(`/api/v1/${type}s/${id}/upload_picture/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const changePassword = async (data: any) => {
  return api.post('/auth/users/set_password/', data);
};

export const updatePatientProfile = async (id: number, data: any) => {
  return api.patch(`/api/v1/patients/${id}/`, data);
};



export default api;
