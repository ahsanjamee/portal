import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetSuperAdminMedicinesPublicQueryResponse,
  GetSuperAdminMedicinesPublicQueryParams,
} from "../../types/GetSuperAdminMedicinesPublic";

/**
 * @link /super-admin/medicines/public
 */
export async function getSuperAdminMedicinesPublic(
  params?: GetSuperAdminMedicinesPublicQueryParams,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetSuperAdminMedicinesPublicQueryResponse>> {
  const res = await client<GetSuperAdminMedicinesPublicQueryResponse>({
    method: "get",
    url: `/super-admin/medicines/public`,
    params,
    ...options,
  });
  return res;
}
