// import { Button } from '@/components/ui/button';
// import { ConsentModal } from '@/components/ui/ConsentModal';
// import PaginatedTable from '@/components/ui/Table/PaginatedTable';
// import { useGlobalStoreSelector } from '@/stores/global.store';
// import { useSetTitle } from '@/stores/title-context';
// import { useTranslate } from '@/translations/provider';
// import { queryClient } from '@/utils/reactQueryClient';
// import { convertDateToNorwegian, renderGenericError } from '@/utils/utils';
// import { GetSuperAdminCompaniesQueryParams } from '@corpactive/corpactive-api-client';
// import { useModal } from '@ebay/nice-modal-react';
// import { Avatar, Group, Stack, Text } from '@mantine/core';
// import { notifications } from '@mantine/notifications';
// import { PencilSimple, Plus, Trash } from '@phosphor-icons/react';
// import dayjs from 'dayjs';
// import { type MRT_ColumnDef, type MRT_PaginationState, type MRT_SortingState } from 'mantine-react-table';
// import { useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { CreateCompanyModal } from './components/CreateCompanyModal';
// import { adminCompanyService } from './services/company.service';

// export const CompanyIndex = () => {
//     const t = useTranslate();
//     const navigate = useNavigate();
//     const [sorting, setSorting] = useState<MRT_SortingState>([]);
//     const [pagination, setPagination] = useState<MRT_PaginationState>({ pageIndex: 0, pageSize: 10 });
//     const [search, setSearch] = useState<string>('');
//     const { language } = useGlobalStoreSelector((s) => s);
//     const consentModal = useModal(ConsentModal);
//     const companyModal = useModal(CreateCompanyModal);

//     useSetTitle('Companies');

//     const params: GetSuperAdminCompaniesQueryParams = {
//         sortBy: sorting.length ? sorting[0]?.id : 'createdAt',
//         sort: sorting.length ? (sorting[0]?.desc ? 'desc' : 'asc') : 'desc',
//         ...(search && { search }),
//         page: pagination.pageIndex + 1,
//         pageSize: pagination.pageSize,
//     };

//     const { data, isLoading, error, isFetching, refetch } = adminCompanyService.useGetAdminCompanies(
//         params,
//         undefined,
//         {
//             queryKey: adminCompanyService.query_key_useList(params) as string[],
//         },
//     );

//     const { mutate: deleteCompany, isPending: deleteLoading } = adminCompanyService.useDeleteCompany({
//         onSuccess: () => {
//             notifications.show({
//                 title: t('Success'),
//                 message: 'Success',
//                 color: 'green',
//             });
//             queryClient.invalidateQueries({ queryKey: adminCompanyService.adminCompanyKeys.all });
//         },
//         onError: (error) => {
//             renderGenericError(error);
//         },
//     });

//     const onDeleteCompany = async (id: string) => {
//         const res = await consentModal.show({
//             title: 'Delete Company',
//             description: 'Are you sure you want to delete this company?',
//             type: 'delete',
//         });
//         if (res) {
//             deleteCompany(id);
//         }
//     };

//     const handleEditCompany = (data: any) => {
//         companyModal.show({
//             data,
//         });
//     };

//     const handleRowClick = (row: any) => {
//         navigate(`/super-admin/company/details/${row.original.id}`, { state: row.original });
//     };

//     const renderRowActions = ({ row }: { row: any }) => {
//         return (
//             <Group gap={8} onClick={(e) => e.stopPropagation()} w={'140'} className="flex flex-nowrap">
//                 <Button variant={'transparent'} onClick={() => handleEditCompany(row.original)} size={'sm'}>
//                     <PencilSimple weight="bold" color="#667085" size={20} />
//                 </Button>
//                 <Button
//                     variant={'transparent'}
//                     onClick={() => onDeleteCompany(row.id)}
//                     size={'sm'}
//                     disabled={deleteLoading}
//                 >
//                     <Trash weight="bold" color="#667085" size={20} />
//                 </Button>
//             </Group>
//         );
//     };

//     const columns = useMemo<MRT_ColumnDef<any>[]>(
//         () => [
//             {
//                 accessorKey: 'name',
//                 header: 'Name',
//                 maxSize: 250,
//                 size: 250,
//                 Cell: ({ row }) => (
//                     <Group>
//                         {row.original.logo ? (
//                             <Avatar src={row.original.logo} size="md" radius="md" />
//                         ) : (
//                             <Avatar size="sm" radius="xl">
//                                 {row.original.name.charAt(0)}
//                             </Avatar>
//                         )}
//                         <Text className="block text-sm leading-5 text-[#1D2823]">{row.original.name}</Text>
//                     </Group>
//                 ),
//                 enableSorting: false,
//             },
//             {
//                 accessorKey: 'userLimit',
//                 header: 'User Limit',
//                 Cell: ({ row }) => (
//                     <span className="block text-sm leading-5 text-[#1D2823]">{row.original.userLimit}</span>
//                 ),
//                 enableSorting: true,
//             },
//             {
//                 accessorKey: 'activeUsers',
//                 header: 'Active Users',
//                 Cell: ({ row }) => (
//                     <span className="block text-sm leading-5 text-[#1D2823]">{row.original.activeUsers}</span>
//                 ),
//                 enableSorting: false,
//             },
//             {
//                 accessorKey: 'createdAt',
//                 header: t('Created'),
//                 Cell: ({ cell }) =>
//                     convertDateToNorwegian(dayjs(cell.getValue() as string).format('MMM D, YYYY'), language),
//             },
//             {
//                 accessorKey: 'updatedAt',
//                 header: t('Updated'),
//                 Cell: ({ cell }) =>
//                     convertDateToNorwegian(dayjs(cell.getValue() as string).format('MMM D, YYYY'), language),
//             },
//         ],
//         [language, t],
//     );

//     return (
//         <Stack gap={0}>
//             <Group justify="space-between" className="mb-4">
//                 <Stack gap={0}>
//                     <Text fz={'32px'} fw={600} c={'#062E26'}>
//                         Companies
//                     </Text>
//                     <Text c={'#3E4945'} fz={'14px'} fw={500}>
//                         Manage your companies
//                     </Text>
//                 </Stack>
//                 <Button onClick={() => companyModal.show()}>
//                     <Plus weight="bold" color="#ffff" size={20} className="mr-2" />
//                     Add new
//                 </Button>
//             </Group>

//             <PaginatedTable
//                 columns={columns}
//                 data={data?.items ?? []}
//                 totalRowCount={data?.pagination?.total ?? 0}
//                 sorting={sorting}
//                 setSorting={setSorting}
//                 pagination={pagination}
//                 setPagination={setPagination}
//                 isLoading={isLoading || deleteLoading}
//                 error={error}
//                 isFetching={isFetching}
//                 refetch={refetch}
//                 tableName="Companies"
//                 globalFilter={search}
//                 setGlobalFilter={setSearch}
//                 enableRowActions
//                 renderRowActions={renderRowActions}
//                 positionActionsColumn="last"
//                 mantineTableBodyRowProps={({ row }: { row: any }) => ({
//                     onClick: () => handleRowClick(row),
//                     style: {
//                         cursor: 'pointer',
//                     },
//                 })}
//             />
//         </Stack>
//     );
// };
