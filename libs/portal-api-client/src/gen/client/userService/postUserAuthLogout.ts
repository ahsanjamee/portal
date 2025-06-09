import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PostUserAuthLogoutMutationRequest,
  PostUserAuthLogoutMutationResponse,
} from "../../types/PostUserAuthLogout";

/**
 * @description Logout
 * @summary Logout and invalidate refresh token
 * @link /user/auth/logout
 */
export async function postUserAuthLogout(
  data: PostUserAuthLogoutMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PostUserAuthLogoutMutationResponse>> {
  const res = await client<
    PostUserAuthLogoutMutationResponse,
    PostUserAuthLogoutMutationRequest
  >({ method: "post", url: `/user/auth/logout`, data, ...options });
  return res;
}
