import type { TokenResponse } from "./TokenResponse";
import type { RefreshTokenDto } from "./RefreshTokenDto";

export type PostUserAuthRefresh201 = TokenResponse;
export type PostUserAuthRefreshMutationRequest = RefreshTokenDto;
export type PostUserAuthRefreshMutationResponse = TokenResponse;
export type PostUserAuthRefreshMutation = {
  Response: PostUserAuthRefreshMutationResponse;
  Request: PostUserAuthRefreshMutationRequest;
};
