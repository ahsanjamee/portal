import type { ProfileUpdateResponseDto } from "./ProfileUpdateResponseDto";
import type { UpdateEndUserProfileDto } from "./UpdateEndUserProfileDto";

export type PutUserProfileEndUserIdPathParams = {
  /**
   * @type string
   */
  id: string;
};
export type PutUserProfileEndUserId200 = ProfileUpdateResponseDto;
export type PutUserProfileEndUserIdMutationRequest = UpdateEndUserProfileDto;
export type PutUserProfileEndUserIdMutationResponse = ProfileUpdateResponseDto;
export type PutUserProfileEndUserIdMutation = {
  Response: PutUserProfileEndUserIdMutationResponse;
  Request: PutUserProfileEndUserIdMutationRequest;
  PathParams: PutUserProfileEndUserIdPathParams;
};
