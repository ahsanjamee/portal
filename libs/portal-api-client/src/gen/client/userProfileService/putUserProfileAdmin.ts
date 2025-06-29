import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PutUserProfileAdminMutationRequest,
  PutUserProfileAdminMutationResponse,
} from "../../types/PutUserProfileAdmin";

/**
 * @description Update Admin User Profile
 * @summary Update admin user profile information
 * @link /user/profile/admin
 */
export async function putUserProfileAdmin(
  data?: PutUserProfileAdminMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PutUserProfileAdminMutationResponse>> {
  const res = await client<
    PutUserProfileAdminMutationResponse,
    PutUserProfileAdminMutationRequest
  >({ method: "put", url: `/user/profile/admin`, data, ...options });
  return res;
}
