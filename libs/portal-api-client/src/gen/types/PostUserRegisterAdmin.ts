import type { CreateAdminUserDto } from "./CreateAdminUserDto";

export type PostUserRegisterAdmin201 = {
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
  authType: "END_USER" | "ADMIN" | "SUPER_ADMIN";
  mobileNumber: null | string;
  /**
   * @type object
   */
  profile: {
    /**
     * @type string
     */
    name: string;
    /**
     * @type string
     */
    id: string;
    /**
     * @type string
     */
    userId: string;
    userType: "SERVICE_PROVIDER" | "TRADER_CHEMIST";
    /**
     * @type string
     */
    address: string;
    photo: null | string;
    /**
     * @type string
     */
    lastDegree: string;
    /**
     * @type string
     */
    areaOfExpertise: string;
    /**
     * @type number
     */
    serviceExperience: number;
    jobPosition: null | string;
  };
  /**
   * @type string
   */
  message: string;
};
export type PostUserRegisterAdminMutationRequest = CreateAdminUserDto;
export type PostUserRegisterAdminMutationResponse = {
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
  authType: "END_USER" | "ADMIN" | "SUPER_ADMIN";
  mobileNumber: null | string;
  /**
   * @type object
   */
  profile: {
    /**
     * @type string
     */
    name: string;
    /**
     * @type string
     */
    id: string;
    /**
     * @type string
     */
    userId: string;
    userType: "SERVICE_PROVIDER" | "TRADER_CHEMIST";
    /**
     * @type string
     */
    address: string;
    photo: null | string;
    /**
     * @type string
     */
    lastDegree: string;
    /**
     * @type string
     */
    areaOfExpertise: string;
    /**
     * @type number
     */
    serviceExperience: number;
    jobPosition: null | string;
  };
  /**
   * @type string
   */
  message: string;
};
export type PostUserRegisterAdminMutation = {
  Response: PostUserRegisterAdminMutationResponse;
  Request: PostUserRegisterAdminMutationRequest;
};
