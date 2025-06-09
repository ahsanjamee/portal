import { setGlobalStoreCookie } from '@/stores/global.store';
import { useMutation } from '@tanstack/react-query';
import { BaseResponse, processResponse } from '../entities/base-response.entity';
import { LoginResponse } from '../entities/login.entity';
import { createAuthAxios } from '../http/axios.hook';

import { UserEntity } from '@/stores/types';
import { makeAuthMutation, makePublicAuthMutation } from '@/utils/factory';

export const authService = {
    useGetProfile: () => {
        return useMutation({
            mutationFn: (tokens: { accessToken: string; refreshToken: string }) => {
                const axios = createAuthAxios({
                    getAccessToken: () => tokens.accessToken,
                    getRefreshToken: () => tokens.refreshToken,
                    setAccessToken: () => {
                        setGlobalStoreCookie((p) => {
                            if (!p) {
                                return null;
                            }
                            return {
                                ...p,
                                accessToken: tokens.accessToken,
                            };
                        });
                    },
                    onLogout: () => {
                        setGlobalStoreCookie(() => null);
                    },
                });

                return processResponse(() => axios.get<BaseResponse<UserEntity>>('/profile/me', {}));
            },
        });
    },

    useLogin: makePublicAuthMutation((ax, dto: { email: string; password: string }) =>
        ax.post<LoginResponse>('/user/auth/super-admin/login', dto),
    ),

    useLogout: makeAuthMutation((ax) => ax.post<string>('/auth/logout')),

};
