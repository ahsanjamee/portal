import type { PaginatedDtoMedicationResponseDto } from "./PaginatedDtoMedicationResponseDto";

export type GetSuperAdminMedicinesPublicQueryParams = {
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
export type GetSuperAdminMedicinesPublic200 = PaginatedDtoMedicationResponseDto;
export type GetSuperAdminMedicinesPublicQueryResponse =
  PaginatedDtoMedicationResponseDto;
export type GetSuperAdminMedicinesPublicQuery = {
  Response: GetSuperAdminMedicinesPublicQueryResponse;
  QueryParams: GetSuperAdminMedicinesPublicQueryParams;
};
