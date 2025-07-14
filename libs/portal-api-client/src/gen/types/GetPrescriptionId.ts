import type { PrescriptionResponseDto } from "./PrescriptionResponseDto";

export type GetPrescriptionIdPathParams = {
  /**
   * @type string
   */
  id: string;
};
export type GetPrescriptionId200 = PrescriptionResponseDto;
export type GetPrescriptionIdQueryResponse = PrescriptionResponseDto;
export type GetPrescriptionIdQuery = {
  Response: GetPrescriptionIdQueryResponse;
  PathParams: GetPrescriptionIdPathParams;
};
