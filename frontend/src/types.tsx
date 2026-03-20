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

export interface Doctor { 
    id?: number;
    user?: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    specialization: string;
    license_number: string;
    is_available: boolean;
}

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

// types.ts
export interface Prescription {
    id?: number;
    medication_name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    visit?: number | null;        // Allow null here
    consultation?: number | null; // Allow null here
}