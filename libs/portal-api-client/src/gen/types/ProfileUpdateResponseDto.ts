export type ProfileUpdateResponseDto = {
  /**
   * @type string
   */
  message: string;
  /**
   * @type object
   */
  user: {
    /**
     * @type string
     */
    id: string;
    /**
     * @type string
     */
    authType: string;
    /**
     * @type string | undefined
     */
    mobileNumber?: string;
    /**
     * @type string | undefined
     */
    email?: string;
    /**
     * @type boolean
     */
    isVerified: boolean;
    /**
     * @type boolean
     */
    isActive: boolean;
    /**
     * @type string
     */
    createdAt: string;
    /**
     * @type string
     */
    updatedAt: string;
  };
  profile: any;
};
