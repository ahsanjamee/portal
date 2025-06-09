import type { LoginDto } from "./LoginDto";

export type PostUserAuthLogin201 = {
  /**
   * @type string
   */
  message: string;
  /**
   * @type string
   */
  mobileNumber: string;
  authType: "END_USER" | "ADMIN";
};
export type PostUserAuthLoginMutationRequest = LoginDto;
export type PostUserAuthLoginMutationResponse = {
  /**
   * @type string
   */
  message: string;
  /**
   * @type string
   */
  mobileNumber: string;
  authType: "END_USER" | "ADMIN";
};
export type PostUserAuthLoginMutation = {
  Response: PostUserAuthLoginMutationResponse;
  Request: PostUserAuthLoginMutationRequest;
};
