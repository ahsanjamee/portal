import type { ProfileUpdateResponseDto } from "./ProfileUpdateResponseDto";
import type { UpdateEndUserProfileDto } from "./UpdateEndUserProfileDto";

export type PutUserProfileEndUser200 = ProfileUpdateResponseDto;
export type PutUserProfileEndUserMutationRequest = UpdateEndUserProfileDto;
export type PutUserProfileEndUserMutationResponse = ProfileUpdateResponseDto;
export type PutUserProfileEndUserMutation = {
  Response: PutUserProfileEndUserMutationResponse;
  Request: PutUserProfileEndUserMutationRequest;
};
