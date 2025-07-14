import client from "@/client";
import type { ResponseConfig } from "@/client";
import type { PostSuperAdminExportUsersMutationResponse } from "../../types/PostSuperAdminExportUsers";

/**
 * @link /super-admin/export/users
 */
export async function postSuperAdminExportUsers(
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PostSuperAdminExportUsersMutationResponse>> {
  const res = await client<PostSuperAdminExportUsersMutationResponse>({
    method: "post",
    url: `/super-admin/export/users`,
    ...options,
  });
  return res;
}
