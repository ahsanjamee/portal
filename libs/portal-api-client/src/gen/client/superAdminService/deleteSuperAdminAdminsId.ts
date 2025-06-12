import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  DeleteSuperAdminAdminsIdMutationResponse,
  DeleteSuperAdminAdminsIdPathParams,
} from "../../types/DeleteSuperAdminAdminsId";

/**
 * @link /super-admin/admins/:id
 */
export async function deleteSuperAdminAdminsId(
  id: DeleteSuperAdminAdminsIdPathParams["id"],
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<DeleteSuperAdminAdminsIdMutationResponse>> {
  const res = await client<DeleteSuperAdminAdminsIdMutationResponse>({
    method: "delete",
    url: `/super-admin/admins/${id}`,
    ...options,
  });
  return res;
}
