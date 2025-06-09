import type { LogoutDto } from "./LogoutDto";

export type PostUserAuthLogout201 = {
  /**
   * @type string
   */
  message: string;
};
export type PostUserAuthLogoutMutationRequest = LogoutDto;
export type PostUserAuthLogoutMutationResponse = {
  /**
   * @type string
   */
  message: string;
};
export type PostUserAuthLogoutMutation = {
  Response: PostUserAuthLogoutMutationResponse;
  Request: PostUserAuthLogoutMutationRequest;
};
