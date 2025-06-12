import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PatchSuperAdminAdminsIdStatusMutationRequest,
  PatchSuperAdminAdminsIdStatusMutationResponse,
  PatchSuperAdminAdminsIdStatusPathParams,
} from "../../types/PatchSuperAdminAdminsIdStatus";

/**
 * @link /super-admin/admins/:id/status
 */
export async function patchSuperAdminAdminsIdStatus(
  id: PatchSuperAdminAdminsIdStatusPathParams["id"],
  data: PatchSuperAdminAdminsIdStatusMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PatchSuperAdminAdminsIdStatusMutationResponse>> {
  const res = await client<
    PatchSuperAdminAdminsIdStatusMutationResponse,
    PatchSuperAdminAdminsIdStatusMutationRequest
  >({
    method: "patch",
    url: `/super-admin/admins/${id}/status`,
    data,
    ...options,
  });
  return res;
}
