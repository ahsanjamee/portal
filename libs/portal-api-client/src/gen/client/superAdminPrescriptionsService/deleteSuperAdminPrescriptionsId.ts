import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  DeleteSuperAdminPrescriptionsIdMutationResponse,
  DeleteSuperAdminPrescriptionsIdPathParams,
} from "../../types/DeleteSuperAdminPrescriptionsId";

/**
 * @link /super-admin/prescriptions/:id
 */
export async function deleteSuperAdminPrescriptionsId(
  id: DeleteSuperAdminPrescriptionsIdPathParams["id"],
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<DeleteSuperAdminPrescriptionsIdMutationResponse>> {
  const res = await client<DeleteSuperAdminPrescriptionsIdMutationResponse>({
    method: "delete",
    url: `/super-admin/prescriptions/${id}`,
    ...options,
  });
  return res;
}
