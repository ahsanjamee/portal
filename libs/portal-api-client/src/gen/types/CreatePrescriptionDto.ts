import type { MedicationDto } from "./MedicationDto";

export type CreatePrescriptionDto = {
  /**
   * @type string
   */
  patientId: string;
  /**
   * @type string
   */
  animalType: string;
  /**
   * @type string | undefined
   */
  animalPicture?: string;
  /**
   * @type number | undefined
   */
  patientNumber?: number;
  /**
   * @type string | undefined
   */
  age?: string;
  /**
   * @type string | undefined
   */
  sex?: string;
  /**
   * @type number | undefined
   */
  weight?: number;
  /**
   * @type string | undefined
   */
  temperature?: string;
  /**
   * @type string | undefined
   */
  spo2?: string;
  /**
   * @type string | undefined
   */
  respirationRate?: string;
  /**
   * @type string | undefined
   */
  fecesStatus?: string;
  /**
   * @type string | undefined
   */
  nasalSecretion?: string;
  /**
   * @type string | undefined
   */
  feedingHistory?: string;
  /**
   * @type string | undefined
   */
  medicationHistory?: string;
  /**
   * @type string | undefined
   */
  investigation?: string;
  /**
   * @type array
   */
  medications: MedicationDto[];
  /**
   * @type string | undefined
   */
  advice?: string;
  /**
   * @type number | undefined
   */
  consultancyFee?: number;
  /**
   * @type string | undefined, date-time
   */
  followUpDate?: string;
};
