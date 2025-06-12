import type { EndUserProfileResponseDto } from "./EndUserProfileResponseDto";
import type { AdminUserProfileResponseDto } from "./AdminUserProfileResponseDto";

export type UserWithProfileResponseDto = {
  profile?: EndUserProfileResponseDto | AdminUserProfileResponseDto;
  /**
   * @type string
   */
  id: string;
  authType: "END_USER" | "ADMIN" | "SUPER_ADMIN";
  /**
   * @type string | undefined
   */
  mobileNumber?: string;
  /**
   * @type string | undefined
   */
  email?: string;
  /**
   * @type boolean
   */
  isVerified: boolean;
  /**
   * @type boolean
   */
  isActive: boolean;
  /**
   * @type string, date-time
   */
  createdAt: string;
  /**
   * @type string, date-time
   */
  updatedAt: string;
};
