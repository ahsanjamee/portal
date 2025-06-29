import { makeMutation } from '@/lib/makeQuery/makeQuery';
import { makeAuthMutation } from '@/utils/factory';
import type {
    PutUserProfileAdminIdMutationRequest,
    PutUserProfileAdminIdMutationResponse,
    PutUserProfileEndUserIdMutationRequest,
    PutUserProfileEndUserIdMutationResponse,
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
        PutUserProfileEndUserIdMutationResponse,
        PutUserProfileEndUserIdMutationRequest & { id: string }
    >(
        ({ id, ...data }) =>
            userProfileService.putUserProfileEndUserId(id, data, {
                url: `/user/profile/end-user/${id}`
            })
    ),

    // Update admin user profile
    useUpdateAdminProfile: makeMutation<
        PutUserProfileAdminIdMutationResponse,
        PutUserProfileAdminIdMutationRequest & { id: string }
    >(
        ({ id, ...data }) =>
            userProfileService.putUserProfileAdminId(id, data, {
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
