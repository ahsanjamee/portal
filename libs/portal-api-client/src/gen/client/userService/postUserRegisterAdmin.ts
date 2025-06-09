import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PostUserRegisterAdminMutationRequest,
  PostUserRegisterAdminMutationResponse,
} from "../../types/PostUserRegisterAdmin";

/**
 * @description Register Admin User
 * @summary Register a new admin user (service provider or trader/chemist) and send OTP
 * @link /user/register/admin
 */
export async function postUserRegisterAdmin(
  data: PostUserRegisterAdminMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PostUserRegisterAdminMutationResponse>> {
  const res = await client<
    PostUserRegisterAdminMutationResponse,
    PostUserRegisterAdminMutationRequest
  >({ method: "post", url: `/user/register/admin`, data, ...options });
  return res;
}
