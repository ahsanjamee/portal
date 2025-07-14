import type { PrescriptionListResponseDto } from "./PrescriptionListResponseDto";
import type { PaginationDto } from "./PaginationDto";

export type PaginatedDtoPrescriptionListResponseDto = {
  /**
   * @type array
   */
  items: PrescriptionListResponseDto[];
  /**
   * @type object
   */
  pagination: PaginationDto;
};
