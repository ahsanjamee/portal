export type UpdatePoultryFarmDataDto = {
  farmType?: "LAYER" | "BROILER";
  /**
   * @type number | undefined
   */
  totalBird?: number;
  /**
   * @type number | undefined
   */
  totalEggProductionPerDay?: number;
};
