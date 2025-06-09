export type PoultryFarmDataDto = {
  farmType: "LAYER" | "BROILER";
  /**
   * @type number
   */
  totalBird: number;
  /**
   * @type number
   */
  totalEggProductionPerDay: number;
};
