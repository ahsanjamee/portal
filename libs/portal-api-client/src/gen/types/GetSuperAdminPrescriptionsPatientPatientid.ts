import type { PaginatedDtoPrescriptionListResponseDto } from "./PaginatedDtoPrescriptionListResponseDto";

export type GetSuperAdminPrescriptionsPatientPatientidPathParams = {
  /**
   * @type string
   */
  patientId: string;
};
export type GetSuperAdminPrescriptionsPatientPatientidQueryParams = {
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
export type GetSuperAdminPrescriptionsPatientPatientid200 =
  PaginatedDtoPrescriptionListResponseDto;
export type GetSuperAdminPrescriptionsPatientPatientidQueryResponse =
  PaginatedDtoPrescriptionListResponseDto;
export type GetSuperAdminPrescriptionsPatientPatientidQuery = {
  Response: GetSuperAdminPrescriptionsPatientPatientidQueryResponse;
  PathParams: GetSuperAdminPrescriptionsPatientPatientidPathParams;
  QueryParams: GetSuperAdminPrescriptionsPatientPatientidQueryParams;
};
