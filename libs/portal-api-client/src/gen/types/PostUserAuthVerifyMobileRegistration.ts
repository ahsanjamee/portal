import type { VerifyOtpDto } from "./VerifyOtpDto";

export type PostUserAuthVerifyMobileRegistration201 = {
  /**
   * @type boolean
   */
  success: boolean;
  /**
   * @type string
   */
  message: string;
  /**
   * @type boolean
   */
  phoneVerified: boolean;
  /**
   * @type string
   */
  mobileNumber: string;
};
export type PostUserAuthVerifyMobileRegistrationMutationRequest = VerifyOtpDto;
export type PostUserAuthVerifyMobileRegistrationMutationResponse = {
  /**
   * @type boolean
   */
  success: boolean;
  /**
   * @type string
   */
  message: string;
  /**
   * @type boolean
   */
  phoneVerified: boolean;
  /**
   * @type string
   */
  mobileNumber: string;
};
export type PostUserAuthVerifyMobileRegistrationMutation = {
  Response: PostUserAuthVerifyMobileRegistrationMutationResponse;
  Request: PostUserAuthVerifyMobileRegistrationMutationRequest;
};
