import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetFarmersPrescriptionsIdQueryResponse,
  GetFarmersPrescriptionsIdPathParams,
} from "../../types/GetFarmersPrescriptionsId";

/**
 * @description Get prescription by ID
 * @summary Get a specific prescription by ID (End User only - own prescriptions)
 * @link /farmers/prescriptions/:id
 */
export async function getFarmersPrescriptionsId(
  id: GetFarmersPrescriptionsIdPathParams["id"],
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetFarmersPrescriptionsIdQueryResponse>> {
  const res = await client<GetFarmersPrescriptionsIdQueryResponse>({
    method: "get",
    url: `/farmers/prescriptions/${id}`,
    ...options,
  });
  return res;
}
