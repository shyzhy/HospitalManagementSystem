// --- USER DETAILS ---
export interface UserDetails {
    username: string;
    first_name: string;
    last_name: string;
}

// --- PATIENT ---
export interface Patient {
    id?: number;
    first_name: string;
    last_name: string;
    gender: string;
    address?: string;
    dob: string;
    phone?: string;
    username?: string;
    password?: string;

    user_details?: {
        username: string;
    };
}

// --- DOCTOR ---
export interface Doctor {
    id: number;
    first_name: string;
    last_name: string;
    specialization: string;
    license_number: string;
    is_available: boolean;
    username?: string;
    password?: string;
}

// --- CONSULTATION / VISIT ---
export interface Consultation {
    id: number;
    patient: number;
    patient_name?: string;
    patient_first_name?: string;
    patient_last_name?: string;
    doctor: number;
    doctor_name?: string;
    consultation_date: string;
    symptoms: string;
    diagnosis: string;
    notes?: string;
}

// --- TREATMENT ---
export interface Treatment {
    id?: number;
    patient: number;
    doctor: number;
    treatment_name: string;
    description?: string;
    patient_name?: string;
    patient_first_name?: string;
    patient_last_name?: string;
    doctor_name?: string;
    treatment_date?: string;
}

// --- PRESCRIPTION ---
export interface Prescription {
    id?: number;
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    patient: number;
    patient_name?: string;
    patient_first_name?: string;
    patient_last_name?: string;
    doctor: number;
    doctor_name?: string;
    date_prescribed?: string;
}

// --- API RESPONSE TYPES ---
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: string;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// --- FORM DATA TYPES ---
export interface MedicalRecord {
    id?: number;
    patient: number;
    patient_name?: string;
    patient_details?: Patient;
    blood_type: string;
    allergies: string;
    chronic_conditions: string;
    medical_history: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    attachment?: string;
    created_at?: string;
    updated_at?: string;
    treatments?: Treatment[];
    prescriptions?: Prescription[];
}