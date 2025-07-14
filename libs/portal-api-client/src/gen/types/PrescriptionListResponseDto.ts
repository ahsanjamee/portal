export type PrescriptionListResponseDto = {
  /**
   * @type string
   */
  id: string;
  /**
   * @type string
   */
  reference: string;
  /**
   * @type string
   */
  doctorName: string;
  /**
   * @type string
   */
  patientName: string;
  /**
   * @type string
   */
  animalType: string;
  /**
   * @type number | undefined
   */
  consultancyFee?: number;
  /**
   * @type string, date-time
   */
  date: string;
  /**
   * @type string | undefined, date-time
   */
  followUpDate?: string;
  /**
   * @type string, date-time
   */
  createdAt: string;
};
