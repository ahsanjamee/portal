import type { JsonArray } from "./JsonArray";
import type { JsonObject } from "./JsonObject";

export type CreatePrescriptionDto = {
  /**
   * @type string
   */
  patientId: string;
  /**
   * @type string
   */
  animalType: string;
  animalPicture: null | string;
  /**
   * @type number
   */
  patientNumber: number;
  age: null | string;
  sex: null | string;
  weight: null | number;
  temperature: null | string;
  spo2: null | string;
  respirationRate: null | string;
  fecesStatus: null | string;
  nasalSecretion: null | string;
  feedingHistory: null | string;
  medicationHistory: null | string;
  investigation: null | string;
  medications: null | string | number | boolean | JsonArray | JsonObject;
  advice: null | string;
  consultancyFee: null | number;
  /**
   * @type string | undefined, date-time
   */
  followUpDate?: string;
};
