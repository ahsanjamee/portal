/* eslint-disable @typescript-eslint/ban-ts-comment */
import { GenericGetApiDTO } from '@/lib/dto/QueryDto';
import { BaseResponse, processResponse } from '@/lib/entities/base-response.entity';
import { useAuthAxios } from '@/lib/http/axios.hook';
import { makeAuthMutation } from '@/utils/factory';
import { useMutation, useQuery } from '@tanstack/react-query';
import { InviteAdminRequest } from './types';

export const FETCH_SUPER_ADMIN_USERS = 'FETCH_SUPER_ADMIN_USERS';

export const usersSuperAdminService = {
    useGetSuperAdminUsers: ({
        page,
        pageSize = 50,
        panelType,
        search,
        sortBy,
        sort,
        role,
        statusFilter,
        companyId,
    }: GenericGetApiDTO & { panelType: string; role?: string; statusFilter?: string; companyId?: string }) => {
        const axios = useAuthAxios();
        const params = new URLSearchParams();

        if (search) {
            params.append('search', search);
        }
        if (statusFilter) {
            params.append('isActive', statusFilter === 'Active' ? 'true' : 'false');
        }

        const searchQuery = search || statusFilter ? `&${params.toString()}` : '';
        const query = `page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sort=${sort}${searchQuery}${panelType !== '' ? `&panelType=${panelType}` : ''}${role ? `&role=${role}` : ''}${companyId ? `&companyId=${companyId}` : ''}`;

        return useQuery({
            queryKey: [FETCH_SUPER_ADMIN_USERS, page, pageSize, panelType, search, sortBy, sort, role, statusFilter, companyId],
            queryFn: async () => {
                return processResponse(() => axios.get<BaseResponse<any>>(`super-admin/users?${query}`));
            },
        });
    },
    useInviteAdmin: makeAuthMutation((ax, dto: InviteAdminRequest) =>
        ax.post<boolean>(`super-admin/users/invite-admin`, dto),
    ),
    useDeleteAdminUser: makeAuthMutation((ax, id: string) => ax.delete<boolean>(`super-admin/users/${id}`)),

    useUpdateUserStatus: makeAuthMutation((ax, dto: { id: string; active: boolean }) =>
        ax.patch<boolean>(`super-admin/users/${dto.id}`, { active: dto.active }),
    ),

    useExportAdminUsers: () => {
        const axios = useAuthAxios();
        return useMutation({
            mutationFn: async (dto: { companyId: string; panelType: string; }) => {
                const response = await axios.post<Blob>(
                    `super-admin/users/export/users?${new URLSearchParams(dto).toString()}`,
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
