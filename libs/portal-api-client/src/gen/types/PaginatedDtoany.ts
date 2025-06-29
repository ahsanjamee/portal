import type { PaginationDto } from "./PaginationDto";

export type PaginatedDtoany = {
  /**
   * @type array
   */
  items: any[];
  /**
   * @type object
   */
  pagination: PaginationDto;
};
