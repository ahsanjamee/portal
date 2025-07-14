import type { PrescriptionResponseDto } from "./PrescriptionResponseDto";
import type { CreatePrescriptionDto } from "./CreatePrescriptionDto";

export type PostPrescription201 = PrescriptionResponseDto;
export type PostPrescriptionMutationRequest = CreatePrescriptionDto;
export type PostPrescriptionMutationResponse = PrescriptionResponseDto;
export type PostPrescriptionMutation = {
  Response: PostPrescriptionMutationResponse;
  Request: PostPrescriptionMutationRequest;
};
