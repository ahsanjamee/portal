import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetSuperAdminPrescriptionsIdQueryResponse,
  GetSuperAdminPrescriptionsIdPathParams,
} from "../../types/GetSuperAdminPrescriptionsId";

/**
 * @link /super-admin/prescriptions/:id
 */
export async function getSuperAdminPrescriptionsId(
  id: GetSuperAdminPrescriptionsIdPathParams["id"],
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetSuperAdminPrescriptionsIdQueryResponse>> {
  const res = await client<GetSuperAdminPrescriptionsIdQueryResponse>({
    method: "get",
    url: `/super-admin/prescriptions/${id}`,
    ...options,
  });
  return res;
}
