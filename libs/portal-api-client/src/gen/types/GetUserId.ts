import type { JsonArray } from "./JsonArray";
import type { JsonObject } from "./JsonObject";

export type GetUserIdPathParams = {
  /**
   * @type string
   */
  id: string;
};
export type GetUserId200 = {
  /**
   * @type string
   */
  id: string;
  authType: "END_USER" | "ADMIN" | "SUPER_ADMIN";
  mobileNumber: null | string;
  email: null | string;
  isVerified: null | boolean;
  /**
   * @type boolean
   */
  isActive: boolean;
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
};
export type GetUserIdQueryResponse = {
  /**
   * @type string
   */
  id: string;
  authType: "END_USER" | "ADMIN" | "SUPER_ADMIN";
  mobileNumber: null | string;
  email: null | string;
  isVerified: null | boolean;
  /**
   * @type boolean
   */
  isActive: boolean;
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
};
export type GetUserIdQuery = {
  Response: GetUserIdQueryResponse;
  PathParams: GetUserIdPathParams;
};
