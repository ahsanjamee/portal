import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetPrescriptionQueryResponse,
  GetPrescriptionQueryParams,
} from "../../types/GetPrescription";

/**
 * @description Get all prescriptions for the current admin
 * @summary Get all prescriptions created by the current admin
 * @link /prescription
 */
export async function getPrescription(
  params?: GetPrescriptionQueryParams,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetPrescriptionQueryResponse>> {
  const res = await client<GetPrescriptionQueryResponse>({
    method: "get",
    url: `/prescription`,
    params,
    ...options,
  });
  return res;
}
