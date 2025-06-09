import type { JsonArray } from "./JsonArray";
import type { JsonObject } from "./JsonObject";
import type { VerifyOtpDto } from "./VerifyOtpDto";

export type PostUserAuthVerifyOtp201 = {
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
   * @type boolean
   */
  isVerified: boolean;
  profile:
    | null
    | {
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
        userType:
          | "DAIRY_FARMER"
          | "POULTRY_FARMER"
          | "FISH_FARMER"
          | "AGRICULTURE_FARMER";
        /**
         * @type string
         */
        address: string;
        farmData: null | string | number | boolean | JsonArray | JsonObject;
      }
    | {
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
export type PostUserAuthVerifyOtpMutationRequest = VerifyOtpDto;
export type PostUserAuthVerifyOtpMutationResponse = {
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
   * @type boolean
   */
  isVerified: boolean;
  profile:
    | null
    | {
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
        userType:
          | "DAIRY_FARMER"
          | "POULTRY_FARMER"
          | "FISH_FARMER"
          | "AGRICULTURE_FARMER";
        /**
         * @type string
         */
        address: string;
        farmData: null | string | number | boolean | JsonArray | JsonObject;
      }
    | {
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
export type PostUserAuthVerifyOtpMutation = {
  Response: PostUserAuthVerifyOtpMutationResponse;
  Request: PostUserAuthVerifyOtpMutationRequest;
};
