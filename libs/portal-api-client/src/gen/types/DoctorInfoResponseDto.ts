export type DoctorInfoResponseDto = {
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
  lastDegree: string;
  /**
   * @type string
   */
  areaOfExpertise: string;
  /**
   * @type number
   */
  serviceExperience: number;
  /**
   * @type string | undefined
   */
  jobPosition?: string;
};
