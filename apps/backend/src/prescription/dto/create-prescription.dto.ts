import { Medication, Prescription } from "@prisma/client";
import { tags } from "typia";

export type CreatePrescriptionDto = Omit<Prescription, "id" | "createdAt" | "updatedAt" | "doctor" | "patient" | "reference" | "doctorId" | "followUpDate" | "ownersComplaints"> & {
    followUpDate?: string & tags.Format<"date-time">;
    ownersComplaints?: string | null;
}

export type UpdatePrescriptionDto = Omit<Prescription, "id" | "createdAt" | "updatedAt" | "doctor" | "patient" | "reference" | "doctorId" | "followUpDate" | "ownersComplaints"> & {
    followUpDate?: string & tags.Format<"date-time">;
    ownersComplaints?: string | null;
}

export type MedicationDto = {
    name: string & tags.MinLength<1>;
}