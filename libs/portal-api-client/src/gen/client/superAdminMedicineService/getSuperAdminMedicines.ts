import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetSuperAdminMedicinesQueryResponse,
  GetSuperAdminMedicinesQueryParams,
} from "../../types/GetSuperAdminMedicines";

/**
 * @link /super-admin/medicines
 */
export async function getSuperAdminMedicines(
  params?: GetSuperAdminMedicinesQueryParams,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetSuperAdminMedicinesQueryResponse>> {
  const res = await client<GetSuperAdminMedicinesQueryResponse>({
    method: "get",
    url: `/super-admin/medicines`,
    params,
    ...options,
  });
  return res;
}
