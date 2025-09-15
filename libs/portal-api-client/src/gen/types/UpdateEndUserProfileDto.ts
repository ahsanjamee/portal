import type { UpdateDairyFarmDataDto } from "./UpdateDairyFarmDataDto";
import type { UpdatePoultryFarmDataDto } from "./UpdatePoultryFarmDataDto";
import type { UpdateFishFarmDataDto } from "./UpdateFishFarmDataDto";
import type { UpdateAgricultureFarmDataDto } from "./UpdateAgricultureFarmDataDto";
import type { UpdatePetOwnerDataDto } from "./UpdatePetOwnerDataDto";

export type UpdateEndUserProfileDto = {
  userType?:
    | "DAIRY_FARMER"
    | "POULTRY_FARMER"
    | "FISH_FARMER"
    | "AGRICULTURE_FARMER"
    | "PET_OWNER";
  /**
   * @type string | undefined
   */
  name?: string;
  /**
   * @type string | undefined
   */
  address?: string;
  /**
   * @type string | undefined, email
   */
  email?: string;
  /**
   * @type string | undefined
   */
  photo?: string;
  farmData?:
    | UpdateDairyFarmDataDto
    | UpdatePoultryFarmDataDto
    | UpdateFishFarmDataDto
    | UpdateAgricultureFarmDataDto
    | UpdatePetOwnerDataDto;
};
