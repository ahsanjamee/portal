import type { MedicationResponseDto } from "./MedicationResponseDto";
import type { MedicationDto } from "./MedicationDto";

export type PostSuperAdminMedicines201 = MedicationResponseDto;
export type PostSuperAdminMedicinesMutationRequest = MedicationDto;
export type PostSuperAdminMedicinesMutationResponse = MedicationResponseDto;
export type PostSuperAdminMedicinesMutation = {
  Response: PostSuperAdminMedicinesMutationResponse;
  Request: PostSuperAdminMedicinesMutationRequest;
};
