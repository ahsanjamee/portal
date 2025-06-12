import type { UpdateUserStatusDto } from "./UpdateUserStatusDto";

export type PatchSuperAdminAdminsIdStatusPathParams = {
  /**
   * @type string
   */
  id: string;
};
export type PatchSuperAdminAdminsIdStatus200 = {
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
export type PatchSuperAdminAdminsIdStatusMutationRequest = UpdateUserStatusDto;
export type PatchSuperAdminAdminsIdStatusMutationResponse = {
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
export type PatchSuperAdminAdminsIdStatusMutation = {
  Response: PatchSuperAdminAdminsIdStatusMutationResponse;
  Request: PatchSuperAdminAdminsIdStatusMutationRequest;
  PathParams: PatchSuperAdminAdminsIdStatusPathParams;
};
