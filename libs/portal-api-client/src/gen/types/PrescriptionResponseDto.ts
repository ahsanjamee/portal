import type { DoctorInfoResponseDto } from "./DoctorInfoResponseDto";
import type { PatientInfoResponseDto } from "./PatientInfoResponseDto";
import type { MedicationResponseDto } from "./MedicationResponseDto";

export type PrescriptionResponseDto = {
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
  doctorId: string;
  /**
   * @type object
   */
  doctor: DoctorInfoResponseDto;
  /**
   * @type string
   */
  patientId: string;
  /**
   * @type object
   */
  patient: PatientInfoResponseDto;
  /**
   * @type string
   */
  animalType: string;
  /**
   * @type string | undefined
   */
  animalPicture?: string;
  /**
   * @type number
   */
  patientNumber: number;
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
  medications: MedicationResponseDto[];
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
  /**
   * @type string, date-time
   */
  createdAt: string;
  /**
   * @type string, date-time
   */
  updatedAt: string;
};
