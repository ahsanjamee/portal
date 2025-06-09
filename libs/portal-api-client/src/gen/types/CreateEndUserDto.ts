import type { DairyFarmDataDto } from "./DairyFarmDataDto";
import type { PoultryFarmDataDto } from "./PoultryFarmDataDto";
import type { FishFarmDataDto } from "./FishFarmDataDto";
import type { AgricultureFarmDataDto } from "./AgricultureFarmDataDto";

export type CreateEndUserDto = {
  userType:
    | "DAIRY_FARMER"
    | "POULTRY_FARMER"
    | "FISH_FARMER"
    | "AGRICULTURE_FARMER";
  /**
   * @type string
   */
  name: string;
  /**
   * @type string
   */
  address: string;
  farmData:
    | DairyFarmDataDto
    | PoultryFarmDataDto
    | FishFarmDataDto
    | AgricultureFarmDataDto;
  authType: "END_USER" | "ADMIN" | "SUPER_ADMIN";
  /**
   * @type string
   */
  mobileNumber: string;
};
