// import { makeMutation, makeQuery } from '@/lib/makeQuery/makeQuery';
// import { makeAuthMutation } from '@/utils/factory';
// import type {
//     GetSuperAdminCompaniesQueryParams,
//     InviteCompanyDto,
//     SuperAdminUpdateCompanyInfoDto
// } from '@corpactive/corpactive-api-client';
// import { superAdminCompanyService } from '@corpactive/corpactive-api-client';

// // Query Keys
// const adminCompanyKeys = {
//     all: ['admin-companies'] as const,
//     list: (filters?: GetSuperAdminCompaniesQueryParams) => [...adminCompanyKeys.all, 'list', filters] as const,
//     detail: (id: string) => [...adminCompanyKeys.all, 'detail', id] as const,
// };

// const query_key_useList = (query: GetSuperAdminCompaniesQueryParams) => ['admin-companies', query];

// // Queries
// const useGetAdminCompanies = makeQuery(superAdminCompanyService.getSuperAdminCompanies, 'replace');
// const useGetAdminCompany = makeQuery(superAdminCompanyService.getSuperAdminCompanies, 'replace');

// // Mutations
// const useCreateCompany = makeMutation(
//     (data: InviteCompanyDto) => superAdminCompanyService.postSuperAdminCompaniesInvite(data)
// );

// const useUpdateCompany = makeMutation(
//     (data: { id: string; data: SuperAdminUpdateCompanyInfoDto }) => superAdminCompanyService.patchSuperAdminCompaniesId(data.id, data.data)
// );

// const useDeleteCompany = makeMutation(
//     (id: string) => superAdminCompanyService.deleteSuperAdminCompaniesId(id)
// );

// const useUploadCompanyLogo = makeAuthMutation((ax, file: File) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return ax.post<any>(`super-admin/companies/upload`, formData);
// });

// export const adminCompanyService = {
//     useGetAdminCompanies,
//     useGetAdminCompany,
//     useCreateCompany,
//     useUpdateCompany,
//     useDeleteCompany,
//     adminCompanyKeys,
//     useUploadCompanyLogo,
//     query_key_useList,
// };
