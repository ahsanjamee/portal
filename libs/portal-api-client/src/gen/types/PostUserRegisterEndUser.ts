import type { JsonArray } from "./JsonArray";
import type { JsonObject } from "./JsonObject";
import type { CreateEndUserDto } from "./CreateEndUserDto";

export type PostUserRegisterEndUser201 = {
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
   * @type string | undefined
   */
  email?: string;
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
    userType:
      | "DAIRY_FARMER"
      | "POULTRY_FARMER"
      | "FISH_FARMER"
      | "AGRICULTURE_FARMER";
    /**
     * @type string
     */
    userId: string;
    /**
     * @type string
     */
    address: string;
    photo: null | string;
    farmData: null | string | number | boolean | JsonArray | JsonObject;
  };
  /**
   * @type string
   */
  message: string;
};
export type PostUserRegisterEndUserMutationRequest = CreateEndUserDto;
export type PostUserRegisterEndUserMutationResponse = {
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
   * @type string | undefined
   */
  email?: string;
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
    userType:
      | "DAIRY_FARMER"
      | "POULTRY_FARMER"
      | "FISH_FARMER"
      | "AGRICULTURE_FARMER";
    /**
     * @type string
     */
    userId: string;
    /**
     * @type string
     */
    address: string;
    photo: null | string;
    farmData: null | string | number | boolean | JsonArray | JsonObject;
  };
  /**
   * @type string
   */
  message: string;
};
export type PostUserRegisterEndUserMutation = {
  Response: PostUserRegisterEndUserMutationResponse;
  Request: PostUserRegisterEndUserMutationRequest;
};
