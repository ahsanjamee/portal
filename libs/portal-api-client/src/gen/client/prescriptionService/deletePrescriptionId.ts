import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  DeletePrescriptionIdMutationResponse,
  DeletePrescriptionIdPathParams,
} from "../../types/DeletePrescriptionId";

/**
 * @description Delete prescription
 * @summary Delete a prescription (Admin only - own prescriptions)
 * @link /prescription/:id
 */
export async function deletePrescriptionId(
  id: DeletePrescriptionIdPathParams["id"],
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<DeletePrescriptionIdMutationResponse>> {
  const res = await client<DeletePrescriptionIdMutationResponse>({
    method: "delete",
    url: `/prescription/${id}`,
    ...options,
  });
  return res;
}
