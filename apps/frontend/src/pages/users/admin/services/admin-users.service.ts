import { BaseResponse, processResponse } from '@/lib/entities/base-response.entity';
import { useAuthAxios } from '@/lib/http/axios.hook';
import { makeAuthMutation } from '@/utils/factory';
import { useMutation, useQuery } from '@tanstack/react-query';
import { GetUsersDTO } from './types';

export const FETCH_ADMIN_USERS = 'FETCH_ADMIN_USERS';

export const adminUsersService = {
    useGetAdminUsers: ({ page, pageSize = 10, panelType, search, sortBy, sort, role, statusFilter }: GetUsersDTO & { authPanel?: string }) => {
        const axios = useAuthAxios();
        const params = new URLSearchParams();

        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());

        if (search) {
            params.append('search', search);
        }

        if (sortBy) {
            params.append('sortBy', sortBy);
        }

        if (sort) {
            params.append('sort', sort);
        }

        if (panelType) {
            params.append('panelType', panelType);
        }

        if (role) {
            params.append('role', role);
        }
        if (statusFilter) {
            const status = statusFilter === 'Active' ? 'true' : 'false';
            params.append('isActive', status);
        }



        const query = params.toString();

        return useQuery({
            queryKey: [FETCH_ADMIN_USERS, page, pageSize, panelType, search, sortBy, sort, statusFilter],
            queryFn: async () => {
                return processResponse(() => axios.get<BaseResponse<any>>(`admin/company/users?${query}`));
            },
        });
    },

    useInviteAdminUser: makeAuthMutation((ax, data: { email: string, firstName: string, lastName: string, role: 'ADMIN' | 'MANAGER' }) =>
        ax.post<any>(`admin/company/invite`, data),
    ),

    useUpdateAdminUser: makeAuthMutation((ax, dto: { active: boolean; id: string }) =>
        ax.patch<any>(`admin/company/users/${dto.id}/manage`, { isActive: dto.active }),
    ),

    useEditAdmin: makeAuthMutation((ax, dto: { data: { name: string, logo?: string } }) =>
        ax.patch<any>(`admin/company`, dto.data),
    ),

    useDeleteAdmin: makeAuthMutation((ax, id: string) =>
        ax.delete<any>(`admin/company/users/${id}`),
    ),

    useUpdateCompanyUserRole: makeAuthMutation((ax, dto: { id: string, role: 'ADMIN' | 'MANAGER' }) =>
        ax.patch<any>(`admin/company/users/${dto.id}/role`, { role: dto.role }),
    ),

    useGetAdminCompanyDetails: () => {
        const axios = useAuthAxios();
        return useQuery({
            queryKey: ['admin-company-details'],
            queryFn: async () => {
                return processResponse(() => axios.get<BaseResponse<any>>(`admin/company`));
            },
        });
    },

    useUpdateAdminCompany: makeAuthMutation((ax, dto: { logo?: string, address: string, phone: string }) =>
        ax.patch<any>(`admin/company`, dto),
    ),

    useUploadAdminCompanyLogo: makeAuthMutation((ax, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return ax.post<any>(`admin/company/upload`, formData);
    }),

    useExportAdminUsers: () => {
        const axios = useAuthAxios();
        return useMutation({
            mutationFn: async (dto: { panelType: 'ADMIN' | 'USER'; }) => {
                const response = await axios.post<Blob>(
                    `admin/company/users/export?${new URLSearchParams(dto).toString()}`,
                    null,
                    {
                        responseType: 'blob',
                        headers: {
                            'Accept': 'application/vnd.ms-excel'
                        }
                    }
                );

                if (response.status === 201) {
                    return response.data;
                } else {
                    throw new Error('Export failed');
                }
            },
        });
    },
};
