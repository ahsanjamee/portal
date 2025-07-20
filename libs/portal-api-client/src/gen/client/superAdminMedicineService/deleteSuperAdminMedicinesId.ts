import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  DeleteSuperAdminMedicinesIdMutationResponse,
  DeleteSuperAdminMedicinesIdPathParams,
} from "../../types/DeleteSuperAdminMedicinesId";

/**
 * @link /super-admin/medicines/:id
 */
export async function deleteSuperAdminMedicinesId(
  id: DeleteSuperAdminMedicinesIdPathParams["id"],
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<DeleteSuperAdminMedicinesIdMutationResponse>> {
  const res = await client<DeleteSuperAdminMedicinesIdMutationResponse>({
    method: "delete",
    url: `/super-admin/medicines/${id}`,
    ...options,
  });
  return res;
}
