import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PutUserProfileEndUserIdMutationRequest,
  PutUserProfileEndUserIdMutationResponse,
  PutUserProfileEndUserIdPathParams,
} from "../../types/PutUserProfileEndUserId";

/**
 * @description Update End User Profile
 * @summary Update end user (farmer) profile information
 * @link /user/profile/end-user/:id
 */
export async function putUserProfileEndUserId(
  id: PutUserProfileEndUserIdPathParams["id"],
  data?: PutUserProfileEndUserIdMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PutUserProfileEndUserIdMutationResponse>> {
  const res = await client<
    PutUserProfileEndUserIdMutationResponse,
    PutUserProfileEndUserIdMutationRequest
  >({ method: "put", url: `/user/profile/end-user/${id}`, data, ...options });
  return res;
}
