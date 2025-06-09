import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PostUserAuthSendOtpMutationRequest,
  PostUserAuthSendOtpMutationResponse,
} from "../../types/PostUserAuthSendOtp";

/**
 * @description Resend OTP
 * @summary Resend OTP to mobile number
 * @link /user/auth/send-otp
 */
export async function postUserAuthSendOtp(
  data: PostUserAuthSendOtpMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PostUserAuthSendOtpMutationResponse>> {
  const res = await client<
    PostUserAuthSendOtpMutationResponse,
    PostUserAuthSendOtpMutationRequest
  >({ method: "post", url: `/user/auth/send-otp`, data, ...options });
  return res;
}
