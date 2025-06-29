import type { ProfileUpdateResponseDto } from "./ProfileUpdateResponseDto";
import type { UpdateAdminUserProfileDto } from "./UpdateAdminUserProfileDto";

export type PutUserProfileAdmin200 = ProfileUpdateResponseDto;
export type PutUserProfileAdminMutationRequest = UpdateAdminUserProfileDto;
export type PutUserProfileAdminMutationResponse = ProfileUpdateResponseDto;
export type PutUserProfileAdminMutation = {
  Response: PutUserProfileAdminMutationResponse;
  Request: PutUserProfileAdminMutationRequest;
};
