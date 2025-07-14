import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetPrescriptionIdQueryResponse,
  GetPrescriptionIdPathParams,
} from "../../types/GetPrescriptionId";

/**
 * @description Get prescription by ID
 * @summary Get a specific prescription by ID
 * @link /prescription/:id
 */
export async function getPrescriptionId(
  id: GetPrescriptionIdPathParams["id"],
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetPrescriptionIdQueryResponse>> {
  const res = await client<GetPrescriptionIdQueryResponse>({
    method: "get",
    url: `/prescription/${id}`,
    ...options,
  });
  return res;
}
