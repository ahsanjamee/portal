import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetSuperAdminAdminsQueryResponse,
  GetSuperAdminAdminsQueryParams,
} from "../../types/GetSuperAdminAdmins";

/**
 * @link /super-admin/admins
 */
export async function getSuperAdminAdmins(
  params?: GetSuperAdminAdminsQueryParams,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetSuperAdminAdminsQueryResponse>> {
  const res = await client<GetSuperAdminAdminsQueryResponse>({
    method: "get",
    url: `/super-admin/admins`,
    params,
    ...options,
  });
  return res;
}
