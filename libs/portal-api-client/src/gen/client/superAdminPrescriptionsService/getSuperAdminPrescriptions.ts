import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetSuperAdminPrescriptionsQueryResponse,
  GetSuperAdminPrescriptionsQueryParams,
} from "../../types/GetSuperAdminPrescriptions";

/**
 * @description Get all prescriptions
 * @summary Get all prescriptions in the system (Super Admin only)
 * @link /super-admin/prescriptions
 */
export async function getSuperAdminPrescriptions(
  params?: GetSuperAdminPrescriptionsQueryParams,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetSuperAdminPrescriptionsQueryResponse>> {
  const res = await client<GetSuperAdminPrescriptionsQueryResponse>({
    method: "get",
    url: `/super-admin/prescriptions`,
    params,
    ...options,
  });
  return res;
}
