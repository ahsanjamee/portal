export type UpdateAdminUserProfileDto = {
  userType?: "SERVICE_PROVIDER" | "TRADER_CHEMIST";
  /**
   * @type string | undefined
   */
  name?: string;
  /**
   * @type string | undefined
   */
  address?: string;
  /**
   * @type string | undefined
   */
  lastDegree?: string;
  /**
   * @type string | undefined
   */
  areaOfExpertise?: string;
  /**
   * @type number | undefined
   */
  serviceExperience?: number;
  /**
   * @type string | undefined
   */
  jobPosition?: string;
  /**
   * @type string | undefined, email
   */
  email?: string;
  /**
   * @type string | undefined
   */
  photo?: string;
};
