import type { UpdateUserStatusDto } from "./UpdateUserStatusDto";

export type PatchSuperAdminEndUsersIdStatusPathParams = {
  /**
   * @type string
   */
  id: string;
};
export type PatchSuperAdminEndUsersIdStatus200 = {
  /**
   * @type string
   */
  message: string;
  /**
   * @type string
   */
  userId: string;
  /**
   * @type boolean
   */
  isActive: boolean;
};
export type PatchSuperAdminEndUsersIdStatusMutationRequest =
  UpdateUserStatusDto;
export type PatchSuperAdminEndUsersIdStatusMutationResponse = {
  /**
   * @type string
   */
  message: string;
  /**
   * @type string
   */
  userId: string;
  /**
   * @type boolean
   */
  isActive: boolean;
};
export type PatchSuperAdminEndUsersIdStatusMutation = {
  Response: PatchSuperAdminEndUsersIdStatusMutationResponse;
  Request: PatchSuperAdminEndUsersIdStatusMutationRequest;
  PathParams: PatchSuperAdminEndUsersIdStatusPathParams;
};
