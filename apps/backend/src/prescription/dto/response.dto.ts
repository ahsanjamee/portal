import { tags } from "typia";

export interface MedicationResponseDto {
    name: string;
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface MedicineResponseDto {
    name: string;
    dosage: string;
    instructions: string;
    duration: string;
}

export interface DoctorInfoResponseDto {
    id: string;
    name: string;
    address: string;
    photo?: string;
    lastDegree: string;
    areaOfExpertise: string;
    serviceExperience: number;
    jobPosition?: string;
}

export interface PatientInfoResponseDto {
    id: string;
    name: string;
    address: string;
    photo?: string;
    userType: string;
    farmData: any;
    mobileNumber?: string;
    email?: string;
}

export interface PrescriptionResponseDto {
    id: string;
    reference: string;

    // Doctor Information
    doctorId: string;
    doctor: DoctorInfoResponseDto;

    // Patient Information
    patientId: string;
    patient: PatientInfoResponseDto;

    // Animal Information
    animalType: string;
    animalPicture?: string;
    patientNumber: string;
    age?: string;
    sex?: string;
    weight?: number;

    // Vital Signs
    temperature?: string;
    spo2?: string;
    respirationRate?: string;
    fecesStatus?: string;
    nasalSecretion?: string;
    feedingHistory?: string;

    // Medical History
    medicationHistory?: string;
    investigation?: string;

    // Prescription Details
    medications: MedicineResponseDto[];
    advice?: string;

    // Consultation Details
    consultancyFee?: number;
    followUpDate?: string & tags.Format<"date-time">;
    td?: string;

    createdAt: string & tags.Format<"date-time">;
    updatedAt: string & tags.Format<"date-time">;
}

export interface PrescriptionListResponseDto {
    id: string;
    reference: string;
    doctorName: string;
    patientName: string;
    animalType: string;
    consultancyFee?: number;
    followUpDate?: string & tags.Format<"date-time">;
    createdAt: string & tags.Format<"date-time">;
} 