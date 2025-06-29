import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PutUserProfileAdminIdMutationRequest,
  PutUserProfileAdminIdMutationResponse,
  PutUserProfileAdminIdPathParams,
} from "../../types/PutUserProfileAdminId";

/**
 * @description Update Admin User Profile
 * @summary Update admin user profile information
 * @link /user/profile/admin/:id
 */
export async function putUserProfileAdminId(
  id: PutUserProfileAdminIdPathParams["id"],
  data?: PutUserProfileAdminIdMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PutUserProfileAdminIdMutationResponse>> {
  const res = await client<
    PutUserProfileAdminIdMutationResponse,
    PutUserProfileAdminIdMutationRequest
  >({ method: "put", url: `/user/profile/admin/${id}`, data, ...options });
  return res;
}
