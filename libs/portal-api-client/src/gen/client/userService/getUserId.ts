import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetUserIdQueryResponse,
  GetUserIdPathParams,
} from "../../types/GetUserId";

/**
 * @description Get User by ID
 * @summary Get user details by user ID
 * @link /user/:id
 */
export async function getUserId(
  id: GetUserIdPathParams["id"],
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetUserIdQueryResponse>> {
  const res = await client<GetUserIdQueryResponse>({
    method: "get",
    url: `/user/${id}`,
    ...options,
  });
  return res;
}
