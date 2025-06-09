import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PostUserAuthLoginMutationRequest,
  PostUserAuthLoginMutationResponse,
} from "../../types/PostUserAuthLogin";

/**
 * @description Login
 * @summary Login with mobile number and auth type - sends OTP
 * @link /user/auth/login
 */
export async function postUserAuthLogin(
  data: PostUserAuthLoginMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PostUserAuthLoginMutationResponse>> {
  const res = await client<
    PostUserAuthLoginMutationResponse,
    PostUserAuthLoginMutationRequest
  >({ method: "post", url: `/user/auth/login`, data, ...options });
  return res;
}
