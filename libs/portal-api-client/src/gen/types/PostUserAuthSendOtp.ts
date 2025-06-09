import type { SendOtpDto } from "./SendOtpDto";

export type PostUserAuthSendOtp201 = {
  /**
   * @type string
   */
  message: string;
  /**
   * @type string
   */
  mobileNumber: string;
};
export type PostUserAuthSendOtpMutationRequest = SendOtpDto;
export type PostUserAuthSendOtpMutationResponse = {
  /**
   * @type string
   */
  message: string;
  /**
   * @type string
   */
  mobileNumber: string;
};
export type PostUserAuthSendOtpMutation = {
  Response: PostUserAuthSendOtpMutationResponse;
  Request: PostUserAuthSendOtpMutationRequest;
};
