import type { PaginatedDtoany } from "./PaginatedDtoany";

export type GetSuperAdminSmsStatsQueryParams = {
  /**
   * @type string | undefined, date-time
   */
  startDate?: string;
  /**
   * @type string | undefined, date-time
   */
  endDate?: string;
  /**
   * @type string | undefined
   */
  messageType?: string;
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
export type GetSuperAdminSmsStats200 = PaginatedDtoany;
export type GetSuperAdminSmsStatsQueryResponse = PaginatedDtoany;
export type GetSuperAdminSmsStatsQuery = {
  Response: GetSuperAdminSmsStatsQueryResponse;
  QueryParams: GetSuperAdminSmsStatsQueryParams;
};
