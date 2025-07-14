import type { PrescriptionResponseDto } from "./PrescriptionResponseDto";
import type { UpdatePrescriptionDto } from "./UpdatePrescriptionDto";

export type PutPrescriptionIdPathParams = {
  /**
   * @type string
   */
  id: string;
};
export type PutPrescriptionId200 = PrescriptionResponseDto;
export type PutPrescriptionIdMutationRequest = UpdatePrescriptionDto;
export type PutPrescriptionIdMutationResponse = PrescriptionResponseDto;
export type PutPrescriptionIdMutation = {
  Response: PutPrescriptionIdMutationResponse;
  Request: PutPrescriptionIdMutationRequest;
  PathParams: PutPrescriptionIdPathParams;
};
