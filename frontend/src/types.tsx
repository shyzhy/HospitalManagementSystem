// --- USER DETAILS (Used inside Doctor) ---
export interface UserDetails {
  username: string;
  first_name: string;
  last_name: string;
}

// --- PATIENT ---
export interface Patient {
    id?: number;            // DB Primary Key
    patient_id: string;     // Hospital ID
    first_name: string;
    last_name: string;
    dob: string;            // Matches backend 'dob'
    gender: string;
    phone: string;          // Matches backend 'phone'
    address: string;
}

// --- DOCTOR ---
export interface Doctor { 
    id?: number;
    specialization: string;
    license_number: string;
    is_available: boolean;
    
    // This allows the frontend to see the name sent by Django!
    user_details?: UserDetails; 
    
    // Kept just in case older components still reference it
    user?: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
    };
}

// --- CONSULTATION / VISIT ---
export interface Consultation {
    id: number;
    patient: number;
    patient_name?: string;
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
    patient: number;         // Patient ID
    doctor: number;          // Doctor ID
    treatment_name: string;  // Matches your Django field (Diagnosis)
    description: string;     // Matches your Django field (Medication/Plan)
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
    patient_name?: string; // Add this
    doctor: number;
    doctor_name?: string;  // Add this
    date_prescribed?: string;
}

// --- API RESPONSE TYPES (Optional but useful) ---
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

// --- FORM DATA TYPES (For creating/updating) ---
export interface MedicalRecord {
    id?: number;
    patient: number;                    // Patient ID
    patient_name?: string;              // Added: Display name from backend (like Consultation)
    patient_details?: Patient;          // Optional: Full nested patient object
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