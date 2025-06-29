import type { _Object } from "./_Object";

export type EndUserProfileResponseDto = {
  /**
   * @type string
   */
  id: string;
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
  /**
   * @type string | undefined
   */
  email?: string;
  /**
   * @type string | undefined
   */
  photo?: string;
  /**
   * @type object
   */
  farmData: _Object;
};
