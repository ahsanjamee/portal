import client from "@/client";
import type { ResponseConfig } from "@/client";
import type { GetUserProfileQueryResponse } from "../../types/GetUserProfile";

/**
 * @description Get Current User Profile
 * @summary Get the current user's profile information
 * @link /user/profile
 */
export async function getUserProfile(
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetUserProfileQueryResponse>> {
  const res = await client<GetUserProfileQueryResponse>({
    method: "get",
    url: `/user/profile`,
    ...options,
  });
  return res;
}
