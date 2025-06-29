import type { ProfileUpdateResponseDto } from "./ProfileUpdateResponseDto";
import type { UpdateAdminUserProfileDto } from "./UpdateAdminUserProfileDto";

export type PutUserProfileAdminIdPathParams = {
  /**
   * @type string
   */
  id: string;
};
export type PutUserProfileAdminId200 = ProfileUpdateResponseDto;
export type PutUserProfileAdminIdMutationRequest = UpdateAdminUserProfileDto;
export type PutUserProfileAdminIdMutationResponse = ProfileUpdateResponseDto;
export type PutUserProfileAdminIdMutation = {
  Response: PutUserProfileAdminIdMutationResponse;
  Request: PutUserProfileAdminIdMutationRequest;
  PathParams: PutUserProfileAdminIdPathParams;
};
