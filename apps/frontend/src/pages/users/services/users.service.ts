/* eslint-disable @typescript-eslint/ban-ts-comment */
import { GenericGetApiDTO } from '@/lib/dto/QueryDto';
import { BaseResponse, processResponse } from '@/lib/entities/base-response.entity';
import { useAuthAxios } from '@/lib/http/axios.hook';
import { useMutation, useQuery } from '@tanstack/react-query';

const useGetAllUsers = ({
    page,
    pageSize = 50,
    panelType,
    search,
    sortBy,
    sort,
    role,
}: GenericGetApiDTO & { panelType: string; role?: string }) => {
    const axios = useAuthAxios();
    const params = new URLSearchParams();

    if (search) {
        params.append('search', search);
    }

    const searchQuery = search ? `&${params.toString()}` : '';
    const query = `page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sort=${sort}${searchQuery}${panelType !== '' ? `&panelType=${panelType}` : ''}${role ? `&role=${role}` : ''}`;

    return useQuery({
        queryKey: ['users', page, pageSize, panelType, search, sortBy, sort],
        queryFn: async () => {
            return processResponse(() => axios.get<BaseResponse<any>>(`admin/company/users?${query}`));
        },
    });
};

const useUpdateUser = () => {
    const axios = useAuthAxios();
    return useMutation({
        mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
            return processResponse(() =>
                axios.patch<BaseResponse<any>>(`admin/company/users/${id}/manage`, { isActive }),
            );
        },
    });
};

const useUpdateRoleOfUser = () => {
    const axios = useAuthAxios();
    return useMutation({
        mutationFn: async ({ id, role }: { id: string; role: string }) => {
            return processResponse(() => axios.patch<BaseResponse<any>>(`admin/company/users/${id}/role`, { role }));
        },
    });
};

const useAdminCompanyInvite = () => {
    const axios = useAuthAxios();
    return useMutation({
        mutationFn: async (email: string) => {
            return processResponse(() => axios.post<BaseResponse<any>>(`admin/company/invite`, { email }));
        },
    });
};

const useUpdateCompany = () => {
    const axios = useAuthAxios();
    return useMutation({
        mutationFn: async (data: any) => {
            return processResponse(() => axios.patch<BaseResponse<any>>(`admin/company`, data));
        },
    });
};

const useGetSingleCompany = () => {
    const axios = useAuthAxios();
    return useQuery({
        queryKey: ['company'],
        queryFn: async () => {
            return processResponse(() => axios.get<BaseResponse<any>>(`admin/company`));
        },
    });
};

const useExportUserList = () => {
    const axios = useAuthAxios();
    return useMutation({
        mutationFn: async () => {
            return axios.post<any>(`admin/company/users/export`, {}, { responseType: 'blob' });
        },
    });
};

export const usersService = {
    useGetAllUsers,
    useUpdateRoleOfUser,
    useAdminCompanyInvite,
    useUpdateUser,
    useUpdateCompany,
    useGetSingleCompany,
    useExportUserList,
};
