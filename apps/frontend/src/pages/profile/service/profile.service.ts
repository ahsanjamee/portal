import { makeMutation } from '@/lib/makeQuery/makeQuery';
import { makeAuthMutation } from '@/utils/factory';
import type {
    PutUserProfileAdminMutationRequest,
    PutUserProfileAdminMutationResponse,
    PutUserProfileEndUserMutationRequest,
    PutUserProfileEndUserMutationResponse,
} from '@portal/portal-api-client';
import { userProfileService } from '@portal/portal-api-client';
import { UpdatePasswordDTO } from './types';

export const FETCH_COUNTRY_DATA = 'FETCH_COUNTRY_DATA';

export const profileService = {
    useUpdateAvatar: makeAuthMutation((ax, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return ax.post<any>(`profile/me/avatar`, formData);
    }),

    // Update end user profile (farmers)
    useUpdateEndUserProfile: makeMutation<
        PutUserProfileEndUserMutationResponse,
        PutUserProfileEndUserMutationRequest & { id: string }
    >(
        ({ id, ...data }) =>
            userProfileService.putUserProfileEndUser(data, {
                url: `/user/profile/end-user/${id}`
            })
    ),

    // Update admin user profile
    useUpdateAdminProfile: makeMutation<
        PutUserProfileAdminMutationResponse,
        PutUserProfileAdminMutationRequest & { id: string }
    >(
        ({ id, ...data }) =>
            userProfileService.putUserProfileAdmin(data, {
                url: `/user/profile/admin/${id}`
            })
    ),

    useSuperAdminUpdatePassword: makeAuthMutation((ax, dto: UpdatePasswordDTO) =>
        ax.post<any>(`super-admin/auth/password/change`, dto),
    ),

    useAdminUpdatePassword: makeAuthMutation((ax, dto: UpdatePasswordDTO) =>
        ax.post<any>(`admin/auth/password/change`, dto),
    ),
};
