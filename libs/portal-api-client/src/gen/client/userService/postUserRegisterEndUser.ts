import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PostUserRegisterEndUserMutationRequest,
  PostUserRegisterEndUserMutationResponse,
} from "../../types/PostUserRegisterEndUser";

/**
 * @description Register End User (Farmers)
 * @summary Register a new end user (dairy, poultry, fish, or agriculture farmer) and send OTP
 * @link /user/register/end-user
 */
export async function postUserRegisterEndUser(
  data: PostUserRegisterEndUserMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PostUserRegisterEndUserMutationResponse>> {
  const res = await client<
    PostUserRegisterEndUserMutationResponse,
    PostUserRegisterEndUserMutationRequest
  >({ method: "post", url: `/user/register/end-user`, data, ...options });
  return res;
}
