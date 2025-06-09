import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PostUserAuthRefreshMutationRequest,
  PostUserAuthRefreshMutationResponse,
} from "../../types/PostUserAuthRefresh";

/**
 * @description Refresh Token
 * @summary Refresh access token using refresh token
 * @link /user/auth/refresh
 */
export async function postUserAuthRefresh(
  data: PostUserAuthRefreshMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PostUserAuthRefreshMutationResponse>> {
  const res = await client<
    PostUserAuthRefreshMutationResponse,
    PostUserAuthRefreshMutationRequest
  >({ method: "post", url: `/user/auth/refresh`, data, ...options });
  return res;
}
