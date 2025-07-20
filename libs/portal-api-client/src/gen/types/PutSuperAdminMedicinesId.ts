import type { MedicationResponseDto } from "./MedicationResponseDto";
import type { MedicationDto } from "./MedicationDto";

export type PutSuperAdminMedicinesIdPathParams = {
  /**
   * @type string
   */
  id: string;
};
export type PutSuperAdminMedicinesId200 = MedicationResponseDto;
export type PutSuperAdminMedicinesIdMutationRequest = MedicationDto;
export type PutSuperAdminMedicinesIdMutationResponse = MedicationResponseDto;
export type PutSuperAdminMedicinesIdMutation = {
  Response: PutSuperAdminMedicinesIdMutationResponse;
  Request: PutSuperAdminMedicinesIdMutationRequest;
  PathParams: PutSuperAdminMedicinesIdPathParams;
};
