import type { SuperAdminLoginDto } from "./SuperAdminLoginDto";

export type PostUserAuthSuperAdminLogin201 = {
  /**
   * @type string
   */
  accessToken: string;
  /**
   * @type string
   */
  refreshToken: string;
  /**
   * @type number
   */
  expiresIn: number;
  /**
   * @type string
   */
  id: string;
  authType: "SUPER_ADMIN";
  email: null | string;
  isVerified: null | boolean;
};
export type PostUserAuthSuperAdminLoginMutationRequest = SuperAdminLoginDto;
export type PostUserAuthSuperAdminLoginMutationResponse = {
  /**
   * @type string
   */
  accessToken: string;
  /**
   * @type string
   */
  refreshToken: string;
  /**
   * @type number
   */
  expiresIn: number;
  /**
   * @type string
   */
  id: string;
  authType: "SUPER_ADMIN";
  email: null | string;
  isVerified: null | boolean;
};
export type PostUserAuthSuperAdminLoginMutation = {
  Response: PostUserAuthSuperAdminLoginMutationResponse;
  Request: PostUserAuthSuperAdminLoginMutationRequest;
};
