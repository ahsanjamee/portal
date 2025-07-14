import { Prescription } from "@prisma/client";
import { tags } from "typia";

export interface MedicationDto {
    name: string & tags.MinLength<1>;
    dosage: string & tags.MinLength<1>;
    instructions: string & tags.MinLength<1>;
    duration: string & tags.MinLength<1>;
}

export type CreatePrescriptionDto = Omit<Prescription, "id" | "createdAt" | "updatedAt" | "doctor" | "patient" | "reference" | "doctorId" | "followUpDate"> & {
    followUpDate?: string & tags.Format<"date-time">;
}


export type UpdatePrescriptionDto = Omit<Prescription, "id" | "createdAt" | "updatedAt" | "doctor" | "patient" | "reference" | "doctorId" | "followUpDate"> & {
    followUpDate?: string & tags.Format<"date-time">;
}