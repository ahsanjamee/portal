import type { PaginatedDtoPrescriptionListResponseDto } from "./PaginatedDtoPrescriptionListResponseDto";

export type GetFarmersPrescriptionsQueryParams = {
  /**
   * @type string | undefined
   */
  doctorId?: string;
  /**
   * @type string | undefined
   */
  patientId?: string;
  /**
   * @type string | undefined
   */
  animalType?: string;
  /**
   * @type string | undefined, date-time
   */
  startDate?: string;
  /**
   * @type string | undefined, date-time
   */
  endDate?: string;
  /**
   * @type boolean | undefined
   */
  hasFollowUp?: boolean;
  /**
   * @type number | undefined
   */
  page?: number;
  /**
   * @type number | undefined
   */
  pageSize?: number;
  /**
   * @type string | undefined
   */
  search?: string;
  /**
   * @type string | undefined
   */
  sortBy?: string;
  sort?: "asc" | "desc";
};
export type GetFarmersPrescriptions200 =
  PaginatedDtoPrescriptionListResponseDto;
export type GetFarmersPrescriptionsQueryResponse =
  PaginatedDtoPrescriptionListResponseDto;
export type GetFarmersPrescriptionsQuery = {
  Response: GetFarmersPrescriptionsQueryResponse;
  QueryParams: GetFarmersPrescriptionsQueryParams;
};
