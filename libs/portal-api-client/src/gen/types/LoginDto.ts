export type LoginDto = {
  /**
   * @type string
   */
  mobileNumber: string;
  authType: "END_USER" | "ADMIN";
};
