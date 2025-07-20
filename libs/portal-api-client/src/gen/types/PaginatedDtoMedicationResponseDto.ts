import type { MedicationResponseDto } from "./MedicationResponseDto";
import type { PaginationDto } from "./PaginationDto";

export type PaginatedDtoMedicationResponseDto = {
  /**
   * @type array
   */
  items: MedicationResponseDto[];
  /**
   * @type object
   */
  pagination: PaginationDto;
};
