import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PostSuperAdminMedicinesMutationRequest,
  PostSuperAdminMedicinesMutationResponse,
} from "../../types/PostSuperAdminMedicines";

/**
 * @link /super-admin/medicines
 */
export async function postSuperAdminMedicines(
  data: PostSuperAdminMedicinesMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PostSuperAdminMedicinesMutationResponse>> {
  const res = await client<
    PostSuperAdminMedicinesMutationResponse,
    PostSuperAdminMedicinesMutationRequest
  >({ method: "post", url: `/super-admin/medicines`, data, ...options });
  return res;
}
