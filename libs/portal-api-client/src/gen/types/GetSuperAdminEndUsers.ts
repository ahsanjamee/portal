import type { PaginatedDtoUserWithProfileResponseDto } from "./PaginatedDtoUserWithProfileResponseDto";

export type GetSuperAdminEndUsersQueryParams = {
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
export type GetSuperAdminEndUsers200 = PaginatedDtoUserWithProfileResponseDto;
export type GetSuperAdminEndUsersQueryResponse =
  PaginatedDtoUserWithProfileResponseDto;
export type GetSuperAdminEndUsersQuery = {
  Response: GetSuperAdminEndUsersQueryResponse;
  QueryParams: GetSuperAdminEndUsersQueryParams;
};
