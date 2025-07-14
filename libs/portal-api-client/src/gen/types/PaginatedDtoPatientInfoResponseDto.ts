import type { PatientInfoResponseDto } from "./PatientInfoResponseDto";
import type { PaginationDto } from "./PaginationDto";

export type PaginatedDtoPatientInfoResponseDto = {
  /**
   * @type array
   */
  items: PatientInfoResponseDto[];
  /**
   * @type object
   */
  pagination: PaginationDto;
};
