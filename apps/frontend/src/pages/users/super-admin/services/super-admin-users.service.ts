import { makeQuery, makeMutation } from '@/lib/makeQuery/makeQuery';
import { superAdminService } from '@portal/portal-api-client';
import type {
    GetSuperAdminEndUsersQueryParams,
    GetSuperAdminEndUsersQueryResponse,
    GetSuperAdminAdminsQueryParams,
    GetSuperAdminAdminsQueryResponse,
    PatchSuperAdminEndUsersIdStatusMutationRequest,
    PatchSuperAdminEndUsersIdStatusMutationResponse,
    PatchSuperAdminAdminsIdStatusMutationRequest,
    PatchSuperAdminAdminsIdStatusMutationResponse,
    DeleteSuperAdminEndUsersIdMutationResponse,
    DeleteSuperAdminAdminsIdMutationResponse,
} from '@portal/portal-api-client';

export const superAdminUsersService = {
    // Get all end users (farmers)
    useGetEndUsers: makeQuery<
        GetSuperAdminEndUsersQueryResponse,
        [GetSuperAdminEndUsersQueryParams?]
    >(
        (params) => superAdminService.getSuperAdminEndUsers(params),
        ['super-admin', 'end-users']
    ),

    // Get all admin users
    useGetAdmins: makeQuery<
        GetSuperAdminAdminsQueryResponse,
        [GetSuperAdminAdminsQueryParams?]
    >(
        (params) => superAdminService.getSuperAdminAdmins(params),
        ['super-admin', 'admins']
    ),

    // Update end user status
    useUpdateEndUserStatus: makeMutation<
        PatchSuperAdminEndUsersIdStatusMutationResponse,
        { id: string; data: PatchSuperAdminEndUsersIdStatusMutationRequest }
    >(
        ({ id, data }) => superAdminService.patchSuperAdminEndUsersIdStatus(id, data)
    ),

    // Update admin user status
    useUpdateAdminStatus: makeMutation<
        PatchSuperAdminAdminsIdStatusMutationResponse,
        { id: string; data: PatchSuperAdminAdminsIdStatusMutationRequest }
    >(
        ({ id, data }) => superAdminService.patchSuperAdminAdminsIdStatus(id, data)
    ),

    // Delete end user
    useDeleteEndUser: makeMutation<
        DeleteSuperAdminEndUsersIdMutationResponse,
        string
    >(
        (id) => superAdminService.deleteSuperAdminEndUsersId(id)
    ),

    // Delete admin user
    useDeleteAdmin: makeMutation<
        DeleteSuperAdminAdminsIdMutationResponse,
        string
    >(
        (id) => superAdminService.deleteSuperAdminAdminsId(id)
    ),
}; 