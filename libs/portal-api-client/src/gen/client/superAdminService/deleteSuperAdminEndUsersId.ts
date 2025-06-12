import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  DeleteSuperAdminEndUsersIdMutationResponse,
  DeleteSuperAdminEndUsersIdPathParams,
} from "../../types/DeleteSuperAdminEndUsersId";

/**
 * @link /super-admin/end-users/:id
 */
export async function deleteSuperAdminEndUsersId(
  id: DeleteSuperAdminEndUsersIdPathParams["id"],
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<DeleteSuperAdminEndUsersIdMutationResponse>> {
  const res = await client<DeleteSuperAdminEndUsersIdMutationResponse>({
    method: "delete",
    url: `/super-admin/end-users/${id}`,
    ...options,
  });
  return res;
}
