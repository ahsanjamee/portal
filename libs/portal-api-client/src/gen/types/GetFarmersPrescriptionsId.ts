import type { PrescriptionResponseDto } from "./PrescriptionResponseDto";

export type GetFarmersPrescriptionsIdPathParams = {
  /**
   * @type string
   */
  id: string;
};
export type GetFarmersPrescriptionsId200 = PrescriptionResponseDto;
export type GetFarmersPrescriptionsIdQueryResponse = PrescriptionResponseDto;
export type GetFarmersPrescriptionsIdQuery = {
  Response: GetFarmersPrescriptionsIdQueryResponse;
  PathParams: GetFarmersPrescriptionsIdPathParams;
};
