import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetSuperAdminSmsStatsSummaryQueryResponse,
  GetSuperAdminSmsStatsSummaryQueryParams,
} from "../../types/GetSuperAdminSmsStatsSummary";

/**
 * @link /super-admin/sms-stats/summary
 */
export async function getSuperAdminSmsStatsSummary(
  params?: GetSuperAdminSmsStatsSummaryQueryParams,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetSuperAdminSmsStatsSummaryQueryResponse>> {
  const res = await client<GetSuperAdminSmsStatsSummaryQueryResponse>({
    method: "get",
    url: `/super-admin/sms-stats/summary`,
    params,
    ...options,
  });
  return res;
}
