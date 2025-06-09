import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PostUserAuthVerifyMobileRegistrationMutationRequest,
  PostUserAuthVerifyMobileRegistrationMutationResponse,
} from "../../types/PostUserAuthVerifyMobileRegistration";

/**
 * @description Verify Mobile for Registration
 * @summary Verify mobile number during registration process using OTP
 * @link /user/auth/verify-mobile-registration
 */
export async function postUserAuthVerifyMobileRegistration(
  data: PostUserAuthVerifyMobileRegistrationMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<
  ResponseConfig<PostUserAuthVerifyMobileRegistrationMutationResponse>
> {
  const res = await client<
    PostUserAuthVerifyMobileRegistrationMutationResponse,
    PostUserAuthVerifyMobileRegistrationMutationRequest
  >({
    method: "post",
    url: `/user/auth/verify-mobile-registration`,
    data,
    ...options,
  });
  return res;
}
