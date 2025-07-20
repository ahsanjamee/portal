import type { PaginatedDtoMedicationResponseDto } from "./PaginatedDtoMedicationResponseDto";

export type GetSuperAdminMedicinesQueryParams = {
  /**
   * @type string | undefined
   */
  name?: string;
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
export type GetSuperAdminMedicines200 = PaginatedDtoMedicationResponseDto;
export type GetSuperAdminMedicinesQueryResponse =
  PaginatedDtoMedicationResponseDto;
export type GetSuperAdminMedicinesQuery = {
  Response: GetSuperAdminMedicinesQueryResponse;
  QueryParams: GetSuperAdminMedicinesQueryParams;
};
