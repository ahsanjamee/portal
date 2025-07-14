import { tags } from "typia";

export interface MedicationDto {
    name: string & tags.MinLength<1>;
    dosage: string & tags.MinLength<1>;
    instructions: string & tags.MinLength<1>;
    duration: string & tags.MinLength<1>;
}

export interface CreatePrescriptionDto {
    // Patient Information
    patientId: string & tags.MinLength<1>;

    // Animal Information
    animalType: string & tags.MinLength<1>;
    animalPicture?: string | null;
    patientNumber?: number & tags.Minimum<0>;
    age?: string;
    sex?: string;
    weight?: number & tags.Minimum<0>;

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
    medications: MedicationDto[];
    advice?: string;

    // Consultation Details
    consultancyFee?: number & tags.Minimum<0>;
    followUpDate?: string & tags.Format<"date-time">;
}

export interface UpdatePrescriptionDto {
    // Animal Information
    animalType?: string & tags.MinLength<1>;
    animalPicture?: string | null;
    patientNumber?: number & tags.Minimum<0>;
    age?: string;
    sex?: string;
    weight?: number & tags.Minimum<0>;

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
    medications?: MedicationDto[];
    advice?: string;

    // Consultation Details
    consultancyFee?: number & tags.Minimum<0>;
    followUpDate?: string & tags.Format<"date-time">;
} 