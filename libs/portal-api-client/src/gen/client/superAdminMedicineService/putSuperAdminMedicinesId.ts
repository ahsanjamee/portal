import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PutSuperAdminMedicinesIdMutationRequest,
  PutSuperAdminMedicinesIdMutationResponse,
  PutSuperAdminMedicinesIdPathParams,
} from "../../types/PutSuperAdminMedicinesId";

/**
 * @link /super-admin/medicines/:id
 */
export async function putSuperAdminMedicinesId(
  id: PutSuperAdminMedicinesIdPathParams["id"],
  data: PutSuperAdminMedicinesIdMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PutSuperAdminMedicinesIdMutationResponse>> {
  const res = await client<
    PutSuperAdminMedicinesIdMutationResponse,
    PutSuperAdminMedicinesIdMutationRequest
  >({ method: "put", url: `/super-admin/medicines/${id}`, data, ...options });
  return res;
}
