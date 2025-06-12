import type { PaginatedDtoUserWithProfileResponseDto } from "./PaginatedDtoUserWithProfileResponseDto";

export type GetSuperAdminAdminsQueryParams = {
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
export type GetSuperAdminAdmins200 = PaginatedDtoUserWithProfileResponseDto;
export type GetSuperAdminAdminsQueryResponse =
  PaginatedDtoUserWithProfileResponseDto;
export type GetSuperAdminAdminsQuery = {
  Response: GetSuperAdminAdminsQueryResponse;
  QueryParams: GetSuperAdminAdminsQueryParams;
};
