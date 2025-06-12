import type { UserWithProfileResponseDto } from "./UserWithProfileResponseDto";
import type { PaginationDto } from "./PaginationDto";

export type PaginatedDtoUserWithProfileResponseDto = {
  /**
   * @type array
   */
  items: UserWithProfileResponseDto[];
  /**
   * @type object
   */
  pagination: PaginationDto;
};
