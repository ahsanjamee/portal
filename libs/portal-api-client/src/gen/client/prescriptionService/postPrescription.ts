import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PostPrescriptionMutationRequest,
  PostPrescriptionMutationResponse,
} from "../../types/PostPrescription";

/**
 * @description Create a new prescription
 * @summary Create a new prescription (Admin only)
 * @link /prescription
 */
export async function postPrescription(
  data: PostPrescriptionMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PostPrescriptionMutationResponse>> {
  const res = await client<
    PostPrescriptionMutationResponse,
    PostPrescriptionMutationRequest
  >({ method: "post", url: `/prescription`, data, ...options });
  return res;
}
