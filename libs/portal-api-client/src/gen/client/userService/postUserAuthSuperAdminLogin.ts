import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  PostUserAuthSuperAdminLoginMutationRequest,
  PostUserAuthSuperAdminLoginMutationResponse,
} from "../../types/PostUserAuthSuperAdminLogin";

/**
 * @description Super Admin Login
 * @summary Login for super admin using email and password
 * @link /user/auth/super-admin/login
 */
export async function postUserAuthSuperAdminLogin(
  data: PostUserAuthSuperAdminLoginMutationRequest,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<PostUserAuthSuperAdminLoginMutationResponse>> {
  const res = await client<
    PostUserAuthSuperAdminLoginMutationResponse,
    PostUserAuthSuperAdminLoginMutationRequest
  >({ method: "post", url: `/user/auth/super-admin/login`, data, ...options });
  return res;
}
