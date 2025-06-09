import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PostUserAuthVerifyOtpMutationRequest,
  PostUserAuthVerifyOtpMutationResponse,
} from "../../types/PostUserAuthVerifyOtp";

/**
 * @description Verify OTP
 * @summary Verify OTP for authentication and get JWT tokens
 * @link /user/auth/verify-otp
 */
export async function postUserAuthVerifyOtp(
  data: PostUserAuthVerifyOtpMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PostUserAuthVerifyOtpMutationResponse>> {
  const res = await client<
    PostUserAuthVerifyOtpMutationResponse,
    PostUserAuthVerifyOtpMutationRequest
  >({ method: "post", url: `/user/auth/verify-otp`, data, ...options });
  return res;
}
