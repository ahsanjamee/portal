import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PutUserProfileEndUserMutationRequest,
  PutUserProfileEndUserMutationResponse,
} from "../../types/PutUserProfileEndUser";

/**
 * @description Update End User Profile
 * @summary Update end user (farmer) profile information
 * @link /user/profile/end-user
 */
export async function putUserProfileEndUser(
  data?: PutUserProfileEndUserMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PutUserProfileEndUserMutationResponse>> {
  const res = await client<
    PutUserProfileEndUserMutationResponse,
    PutUserProfileEndUserMutationRequest
  >({ method: "put", url: `/user/profile/end-user`, data, ...options });
  return res;
}
