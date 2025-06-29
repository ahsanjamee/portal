import type { EndUserProfileResponseDto } from "./EndUserProfileResponseDto";
import type { AdminUserProfileResponseDto } from "./AdminUserProfileResponseDto";

export type GetUserProfile200 =
  | EndUserProfileResponseDto
  | AdminUserProfileResponseDto;
export type GetUserProfileQueryResponse =
  | EndUserProfileResponseDto
  | AdminUserProfileResponseDto;
export type GetUserProfileQuery = {
  Response: GetUserProfileQueryResponse;
};
