import { makeMutation, makeQuery } from "@/lib/makeQuery/makeQuery";
import {
    PostSuperAdminMedicinesMutationRequest,
    PostSuperAdminMedicinesMutationResponse,
    PutSuperAdminMedicinesIdMutationRequest,
    PutSuperAdminMedicinesIdMutationResponse,
    superAdminMedicineService,
    DeleteSuperAdminMedicinesIdMutationResponse
} from "@portal/portal-api-client";

export const FETCH_MEDICINES = 'FETCH_MEDICINES';

export const medicineServiceHooks = {
    useGetMedicines: makeQuery((params) => superAdminMedicineService.getSuperAdminMedicines(params), ['replace']),
    useGetPublicMedicines: makeQuery((params) => superAdminMedicineService.getSuperAdminMedicinesPublic(params), ['replace']),

    useCreateMedicine: makeMutation<PostSuperAdminMedicinesMutationResponse, PostSuperAdminMedicinesMutationRequest>((data) => superAdminMedicineService.postSuperAdminMedicines(data)),

    useUpdateMedicine: makeMutation<PutSuperAdminMedicinesIdMutationResponse, {
        id: string; data: PutSuperAdminMedicinesIdMutationRequest
    }>(({ id, data }) => superAdminMedicineService.putSuperAdminMedicinesId(id, data)),

    useDeleteMedicine: makeMutation<DeleteSuperAdminMedicinesIdMutationResponse, string>((id) => superAdminMedicineService.deleteSuperAdminMedicinesId(id)),
}   