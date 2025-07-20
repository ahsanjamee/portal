import { Medication, Prescription } from "@prisma/client";
import { tags } from "typia";

export type CreatePrescriptionDto = Omit<Prescription, "id" | "createdAt" | "updatedAt" | "doctor" | "patient" | "reference" | "doctorId" | "followUpDate"> & {
    followUpDate?: string & tags.Format<"date-time">;
}

export type UpdatePrescriptionDto = Omit<Prescription, "id" | "createdAt" | "updatedAt" | "doctor" | "patient" | "reference" | "doctorId" | "followUpDate"> & {
    followUpDate?: string & tags.Format<"date-time">;
}

export type MedicationDto = {
    name: string & tags.MinLength<1>;
}