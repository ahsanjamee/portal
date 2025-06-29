import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PutUserProfileImageMutationRequest,
  PutUserProfileImageMutationResponse,
} from "../../types/PutUserProfileImage";

/**
 * @description Update Profile Image
 * @summary Update profile image URL for both end users and admin users
 * @link /user/profile/image
 */
export async function putUserProfileImage(
  data: PutUserProfileImageMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PutUserProfileImageMutationResponse>> {
  const res = await client<
    PutUserProfileImageMutationResponse,
    PutUserProfileImageMutationRequest
  >({ method: "put", url: `/user/profile/image`, data, ...options });
  return res;
}
