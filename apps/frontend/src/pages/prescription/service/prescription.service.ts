
import { makeQuery, makeMutation } from '@/lib/makeQuery/makeQuery';
import {
    prescriptionService as prescriptionApiService,
    userPrescriptionsService as userPrescriptionsApiService,
    superAdminPrescriptionsService as superAdminPrescriptionsApiService
} from '@portal/portal-api-client';
import type {
    GetPrescriptionQueryParams,
    GetPrescriptionQueryResponse,
    GetPrescriptionIdQueryResponse,
    GetPrescriptionPatientsQueryParams,
    GetPrescriptionPatientsQueryResponse,
    PostPrescriptionMutationRequest,
    PostPrescriptionMutationResponse,
    PutPrescriptionIdMutationRequest,
    PutPrescriptionIdMutationResponse,
    DeletePrescriptionIdMutationResponse,
    GetFarmersPrescriptionsQueryParams,
    GetFarmersPrescriptionsQueryResponse,
    GetFarmersPrescriptionsIdQueryResponse,
    GetSuperAdminPrescriptionsQueryParams,
    GetSuperAdminPrescriptionsQueryResponse,
    GetSuperAdminPrescriptionsIdQueryResponse,
    GetSuperAdminPrescriptionsPatientPatientidQueryParams,
    GetSuperAdminPrescriptionsPatientPatientidQueryResponse,
    GetSuperAdminPrescriptionsDoctorDoctoridQueryParams,
    GetSuperAdminPrescriptionsDoctorDoctoridQueryResponse,
} from '@portal/portal-api-client';
import { useMutation, useQuery } from '@tanstack/react-query';

export const prescriptionServiceHooks = {
    // Get all prescriptions (paginated)
    useGetPrescriptions: makeQuery<
        GetPrescriptionQueryResponse,
        [GetPrescriptionQueryParams?]
    >(
        (params) => prescriptionApiService.getPrescription(params),
        ['prescriptions']
    ),

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

    // Generate PDF
    usePrescriptionPdf: () => {
        return useMutation({
            mutationFn: async (id: string) => {
                return prescriptionApiService.getPrescriptionIdPdf(id, {
                    responseType: 'blob'
                });
            },
        });
    },
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
    useGetSuperAdminPrescriptions: makeQuery<
        GetSuperAdminPrescriptionsQueryResponse,
        [GetSuperAdminPrescriptionsQueryParams?]
    >(
        (params) => superAdminPrescriptionsApiService.getSuperAdminPrescriptions(params),
        ['super-admin', 'prescriptions']
    ),

    // Get prescription by ID (super admin view)
    useGetSuperAdminPrescription: makeQuery<
        GetSuperAdminPrescriptionsIdQueryResponse,
        [string]
    >(
        (id) => superAdminPrescriptionsApiService.getSuperAdminPrescriptionsId(id),
        ['super-admin', 'prescription']
    ),

    // Get prescriptions by patient ID
    useGetSuperAdminPrescriptionsByPatient: makeQuery<
        GetSuperAdminPrescriptionsPatientPatientidQueryResponse,
        [string, GetSuperAdminPrescriptionsPatientPatientidQueryParams?]
    >(
        (patientId, params) => superAdminPrescriptionsApiService.getSuperAdminPrescriptionsPatientPatientid(patientId, params),
        ['super-admin', 'prescriptions', 'patient']
    ),

    // Get prescriptions by doctor ID
    useGetSuperAdminPrescriptionsByDoctor: makeQuery<
        GetSuperAdminPrescriptionsDoctorDoctoridQueryResponse,
        [string, GetSuperAdminPrescriptionsDoctorDoctoridQueryParams?]
    >(
        (doctorId, params) => superAdminPrescriptionsApiService.getSuperAdminPrescriptionsDoctorDoctorid(doctorId, params),
        ['super-admin', 'prescriptions', 'doctor']
    ),
} as const;

// Export a combined service object for convenience
export const prescriptionService = {
    ...prescriptionServiceHooks,
    ...userPrescriptionServiceHooks,
    ...superAdminPrescriptionServiceHooks,
} as const; 