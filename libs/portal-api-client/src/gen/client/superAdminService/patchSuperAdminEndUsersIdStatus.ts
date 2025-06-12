import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PatchSuperAdminEndUsersIdStatusMutationRequest,
  PatchSuperAdminEndUsersIdStatusMutationResponse,
  PatchSuperAdminEndUsersIdStatusPathParams,
} from "../../types/PatchSuperAdminEndUsersIdStatus";

/**
 * @link /super-admin/end-users/:id/status
 */
export async function patchSuperAdminEndUsersIdStatus(
  id: PatchSuperAdminEndUsersIdStatusPathParams["id"],
  data: PatchSuperAdminEndUsersIdStatusMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PatchSuperAdminEndUsersIdStatusMutationResponse>> {
  const res = await client<
    PatchSuperAdminEndUsersIdStatusMutationResponse,
    PatchSuperAdminEndUsersIdStatusMutationRequest
  >({
    method: "patch",
    url: `/super-admin/end-users/${id}/status`,
    data,
    ...options,
  });
  return res;
}
