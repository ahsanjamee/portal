
import { makeMutation, makeQuery } from '@/lib/makeQuery/makeQuery';
import type {
    DeletePrescriptionIdMutationResponse,
    GetFarmersPrescriptionsIdQueryResponse,
    GetFarmersPrescriptionsQueryParams,
    GetFarmersPrescriptionsQueryResponse,
    GetPrescriptionIdQueryResponse,
    GetPrescriptionPatientsQueryParams,
    GetPrescriptionPatientsQueryResponse,
    GetSuperAdminPrescriptionsIdQueryResponse,
    PostPrescriptionMutationRequest,
    PostPrescriptionMutationResponse,
    PutPrescriptionIdMutationRequest,
    PutPrescriptionIdMutationResponse
} from '@portal/portal-api-client';
import {
    prescriptionService as prescriptionApiService,
    superAdminPrescriptionsService as superAdminPrescriptionsApiService,
    userPrescriptionsService as userPrescriptionsApiService
} from '@portal/portal-api-client';
import { useQuery } from '@tanstack/react-query';

export const prescriptionServiceHooks = {
    // Get all prescriptions (paginated)
    useGetPrescriptions: makeQuery(prescriptionApiService.getPrescription, 'replace'),

    // Get prescription by ID
    useGetPrescription: (id: string, options?: any) => {
        return useQuery<GetPrescriptionIdQueryResponse>({
            queryKey: ['prescription', id],
            queryFn: () => prescriptionApiService.getPrescriptionId(id),
            ...options,
        });
    },

    // Get patients for prescription creation
    useGetPatients: makeQuery<
        GetPrescriptionPatientsQueryResponse,
        [GetPrescriptionPatientsQueryParams?]
    >(
        (params) => prescriptionApiService.getPrescriptionPatients(params),
        ['prescription', 'patients']
    ),

    // Create prescription
    useCreatePrescription: makeMutation<
        PostPrescriptionMutationResponse,
        PostPrescriptionMutationRequest
    >(
        (data) => prescriptionApiService.postPrescription(data)
    ),

    // Update prescription
    useUpdatePrescription: makeMutation<
        PutPrescriptionIdMutationResponse,
        { id: string; data: PutPrescriptionIdMutationRequest }
    >(
        ({ id, data }) => prescriptionApiService.putPrescriptionId(id, data)
    ),

    // Delete prescription
    useDeletePrescription: makeMutation<
        DeletePrescriptionIdMutationResponse,
        string
    >(
        (id) => prescriptionApiService.deletePrescriptionId(id)
    ),


} as const;

export const userPrescriptionServiceHooks = {
    // Get farmer's prescriptions
    useGetFarmersPrescriptions: makeQuery<
        GetFarmersPrescriptionsQueryResponse,
        [GetFarmersPrescriptionsQueryParams?]
    >(
        (params) => userPrescriptionsApiService.getFarmersPrescriptions(params),
        ['farmers', 'prescriptions']
    ),

    // Get farmer's prescription by ID
    useGetFarmersPrescription: makeQuery<
        GetFarmersPrescriptionsIdQueryResponse,
        [string]
    >(
        (id) => userPrescriptionsApiService.getFarmersPrescriptionsId(id),
        ['farmers', 'prescription']
    ),
} as const;

export const superAdminPrescriptionServiceHooks = {
    // Get all prescriptions (super admin view)
    useGetSuperAdminPrescriptions: makeQuery(superAdminPrescriptionsApiService.getSuperAdminPrescriptions, 'replace'),

    useGetSuperAdminPrescription: (id: string, options?: any) => {
        return useQuery<GetSuperAdminPrescriptionsIdQueryResponse>({
            queryKey: ['super-admin', 'prescription', id],
            queryFn: () => superAdminPrescriptionsApiService.getSuperAdminPrescriptionsId(id),
            ...options,
        });
    },

    useDeletePrescriptionFromSuperAdmin: makeMutation<
        Boolean,
        string
    >(
        (id) => superAdminPrescriptionsApiService.deleteSuperAdminPrescriptionsId(id)
    ),

} as const;

// Export a combined service object for convenience
export const prescriptionService = {
    ...prescriptionServiceHooks,
    ...userPrescriptionServiceHooks,
    ...superAdminPrescriptionServiceHooks,
} as const; 