import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PutPrescriptionIdMutationRequest,
  PutPrescriptionIdMutationResponse,
  PutPrescriptionIdPathParams,
} from "../../types/PutPrescriptionId";

/**
 * @description Update prescription
 * @summary Update a prescription (Admin only - own prescriptions)
 * @link /prescription/:id
 */
export async function putPrescriptionId(
  id: PutPrescriptionIdPathParams["id"],
  data: PutPrescriptionIdMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PutPrescriptionIdMutationResponse>> {
  const res = await client<
    PutPrescriptionIdMutationResponse,
    PutPrescriptionIdMutationRequest
  >({ method: "put", url: `/prescription/${id}`, data, ...options });
  return res;
}
