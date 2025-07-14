import type { PaginatedDtoPatientInfoResponseDto } from "./PaginatedDtoPatientInfoResponseDto";

export type GetPrescriptionPatientsQueryParams = {
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
export type GetPrescriptionPatients200 = PaginatedDtoPatientInfoResponseDto;
export type GetPrescriptionPatientsQueryResponse =
  PaginatedDtoPatientInfoResponseDto;
export type GetPrescriptionPatientsQuery = {
  Response: GetPrescriptionPatientsQueryResponse;
  QueryParams: GetPrescriptionPatientsQueryParams;
};
