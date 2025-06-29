import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetSuperAdminSmsStatsQueryResponse,
  GetSuperAdminSmsStatsQueryParams,
} from "../../types/GetSuperAdminSmsStats";

/**
 * @link /super-admin/sms-stats
 */
export async function getSuperAdminSmsStats(
  params?: GetSuperAdminSmsStatsQueryParams,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetSuperAdminSmsStatsQueryResponse>> {
  const res = await client<GetSuperAdminSmsStatsQueryResponse>({
    method: "get",
    url: `/super-admin/sms-stats`,
    params,
    ...options,
  });
  return res;
}
