export type PatientInfoResponseDto = {
  /**
   * @type string
   */
  id: string;
  /**
   * @type string
   */
  name: string;
  /**
   * @type string
   */
  address: string;
  /**
   * @type string | undefined
   */
  photo?: string;
  /**
   * @type string
   */
  userType: string;
  farmData: any;
  /**
   * @type string | undefined
   */
  mobileNumber?: string;
  /**
   * @type string | undefined
   */
  email?: string;
};
