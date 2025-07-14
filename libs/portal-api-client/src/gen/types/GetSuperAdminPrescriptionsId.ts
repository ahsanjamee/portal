import type { PrescriptionResponseDto } from "./PrescriptionResponseDto";

export type GetSuperAdminPrescriptionsIdPathParams = {
  /**
   * @type string
   */
  id: string;
};
export type GetSuperAdminPrescriptionsId200 = PrescriptionResponseDto;
export type GetSuperAdminPrescriptionsIdQueryResponse = PrescriptionResponseDto;
export type GetSuperAdminPrescriptionsIdQuery = {
  Response: GetSuperAdminPrescriptionsIdQueryResponse;
  PathParams: GetSuperAdminPrescriptionsIdPathParams;
};
