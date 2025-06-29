import type { ProfileUpdateResponseDto } from "./ProfileUpdateResponseDto";

export type PutUserProfileImage200 = ProfileUpdateResponseDto;
export type PutUserProfileImageMutationRequest = {
  /**
   * @type string
   */
  imageUrl: string;
};
export type PutUserProfileImageMutationResponse = ProfileUpdateResponseDto;
export type PutUserProfileImageMutation = {
  Response: PutUserProfileImageMutationResponse;
  Request: PutUserProfileImageMutationRequest;
};
