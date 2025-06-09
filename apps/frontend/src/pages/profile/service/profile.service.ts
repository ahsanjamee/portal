import { makeAuthMutation } from '@/utils/factory';
import { UpdatePasswordDTO, UpdateProfileDTO } from './types';

export const FETCH_COUNTRY_DATA = 'FETCH_COUNTRY_DATA';

export const profileService = {
    useUpdateAvatar: makeAuthMutation((ax, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return ax.post<any>(`profile/me/avatar`, formData);
    }),

    useUpdateProfile: makeAuthMutation((ax, dto: UpdateProfileDTO) => ax.patch<any>(`profile/me`, dto)),

    useSuperAdminUpdatePassword: makeAuthMutation((ax, dto: UpdatePasswordDTO) =>
        ax.post<any>(`super-admin/auth/password/change`, dto),
    ),

    useAdminUpdatePassword: makeAuthMutation((ax, dto: UpdatePasswordDTO) =>
        ax.post<any>(`admin/auth/password/change`, dto),
    ),
};
