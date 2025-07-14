import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetFarmersPrescriptionsQueryResponse,
  GetFarmersPrescriptionsQueryParams,
} from "../../types/GetFarmersPrescriptions";

/**
 * @description Get my prescriptions as an end user
 * @summary Get prescriptions for the authenticated end user
 * @link /farmers/prescriptions
 */
export async function getFarmersPrescriptions(
  params?: GetFarmersPrescriptionsQueryParams,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetFarmersPrescriptionsQueryResponse>> {
  const res = await client<GetFarmersPrescriptionsQueryResponse>({
    method: "get",
    url: `/farmers/prescriptions`,
    params,
    ...options,
  });
  return res;
}
