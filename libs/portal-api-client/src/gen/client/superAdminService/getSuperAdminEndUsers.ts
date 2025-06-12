import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetSuperAdminEndUsersQueryResponse,
  GetSuperAdminEndUsersQueryParams,
} from "../../types/GetSuperAdminEndUsers";

/**
 * @link /super-admin/end-users
 */
export async function getSuperAdminEndUsers(
  params?: GetSuperAdminEndUsersQueryParams,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetSuperAdminEndUsersQueryResponse>> {
  const res = await client<GetSuperAdminEndUsersQueryResponse>({
    method: "get",
    url: `/super-admin/end-users`,
    params,
    ...options,
  });
  return res;
}
