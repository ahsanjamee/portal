import PaginatedTable from "@/components/ui/Table/PaginatedTable";
// import { Button as ShadButton } from '@/components/ui/button';
import { Button } from "@/components/ui/button";
import { ConsentModal } from "@/components/ui/ConsentModal";
import { useGlobalStoreSelector } from "@/stores/global.store";
import { useSetTitle } from "@/stores/title-context";
import { useTranslate } from "@/translations/provider";
import { queryClient } from "@/utils/reactQueryClient";
import { convertDateToNorwegian, renderGenericError } from "@/utils/utils";
import { useModal } from "@ebay/nice-modal-react";
import { Group, Stack, Switch, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Plus, Trash } from "@phosphor-icons/react";
import dayjs from "dayjs";
import {
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "mantine-react-table";
import { useMemo, useState } from "react";
import { InviteAdminModal } from "../components/InviteAdminModal";
import {
  FETCH_SUPER_ADMIN_USERS,
  usersSuperAdminService,
} from "./services/users.service";

interface UsersSuperAdminIndexProps {
  companyId?: string;
  panelType?: string;
}

export const UsersSuperAdminIndex = ({
  companyId,
  panelType = "SUPER_ADMIN",
}: UsersSuperAdminIndexProps) => {
  const t = useTranslate();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<string>("");
  const { language } = useGlobalStoreSelector((s) => s);
  // const [statusFilter, setStatusFilter] = useState<string>('');
  const inviteAdminModal = useModal(InviteAdminModal);
  const consentModal = useModal(ConsentModal);

  useSetTitle("Users");

  const { data, isLoading, error, isFetching, refetch } =
    usersSuperAdminService.useGetSuperAdminUsers({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      sortBy: sorting.length ? (sorting[0]?.id as string) : "createdAt",
      sort: sorting.length ? (sorting[0]?.desc ? "desc" : "asc") : "desc",
      panelType,
      search,
      // statusFilter,
      ...(companyId && { companyId }),
    });

  const { mutate: deleteUser, isPending: deleteLoading } =
    usersSuperAdminService.useDeleteAdminUser({
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "User deleted successfully",
          color: "green",
        });
        queryClient.invalidateQueries({ queryKey: [FETCH_SUPER_ADMIN_USERS] });
      },
      onError: (error) => {
        renderGenericError(error);
      },
    });

  const { mutate: updateUser, isPending: updateLoading } =
    usersSuperAdminService.useUpdateUserStatus({
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "User updated successfully",
          color: "green",
        });
        queryClient.invalidateQueries({ queryKey: [FETCH_SUPER_ADMIN_USERS] });
      },
      onError: (error) => {
        renderGenericError(error);
      },
    });

  const handleUserActive = (e: any, id: string) => {
    const active = e.target.checked;
    updateUser({ active, id });
  };

  const onDeleteUser = async (id: string) => {
    const res = await consentModal.show({
      title: "Delete User",
      description: "Are you sure you want to delete this user?",
      type: "delete",
    });
    if (res) {
      deleteUser(id);
    }
  };

  const handleInviteAdmin = async () => {
    inviteAdminModal.show();
  };

  // const renderCustomFilter = useCallback(() => {
  //     return (
  //         <Group className="absolute right-0">
  //             <Select
  //                 styles={{ input: { height: '40px', cursor: 'pointer' } }}
  //                 placeholder="Filter by status"
  //                 data={['Active', 'Inactive']}
  //                 onChange={(value) => {
  //                     if (!value) {
  //                         setStatusFilter('');
  //                         return;
  //                     }
  //                     setStatusFilter(value);
  //                 }}
  //                 clearable
  //                 searchable
  //                 nothingFoundMessage="Nothing found..."
  //             />
  //         </Group>
  //     );
  // }, [setStatusFilter]);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Name",
        maxSize: 450,
        size: 250,
        Cell: ({ row }) => (
          <Text className="block text-sm leading-5 text-[#1D2823]">
            {row.original.fullName
              ? row.original.fullName
              : `${row.original.firstName} ${row.original.lastName}`}
          </Text>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "email",
        header: "Email address",
        maxSize: 250,
        size: 200,
        Cell: ({ row }) => (
          <span className="block text-sm leading-5 text-[#1D2823]">
            {row.original.email}
          </span>
        ),
      },
      {
        accessorKey: "userCompany",
        header: t("Designation"),
        Cell: ({ row }) => (
          <span className="block text-sm leading-5 text-[#1D2823]">
            {row.original.userCompany?.role}
          </span>
        ),
        enableSorting: false,
      },

      {
        accessorKey: "createdAt",
        header: t("Created"),
        Cell: ({ cell }) =>
          convertDateToNorwegian(
            dayjs(cell.getValue() as string).format("MMM D, YYYY"),
            language
          ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const renderRowActions = ({ row }: { row: any }) => {
    const isNotEditable =
      updateLoading || row.original.userCompany.role === "OWNER";
    const deleteDisabled =
      deleteLoading || row.original.userCompany.role === "OWNER";
    return (
      <Group
        gap={8}
        onClick={(e) => e.stopPropagation()}
        w={"140"}
        className="flex flex-nowrap"
      >
        <Switch
          size="md"
          className="border-0"
          disabled={isNotEditable}
          checked={row.original.isActive}
          onChange={(e) => handleUserActive(e, row.id)}
          styles={(theme) => ({
            track: {
              background: row.original.isActive ? "#10B981" : "#F2F4F7",
              cursor: isNotEditable ? "not-allowed" : "pointer",
              opacity: isNotEditable ? 0.6 : 1,
            },
            thumb: {
              backgroundColor: isNotEditable ? "#ccc" : theme.white,
            },
          })}
        />
        <Button
          variant={"transparent"}
          onClick={() => onDeleteUser(row.id)}
          size={"sm"}
          disabled={deleteDisabled}
        >
          <Trash weight="bold" color="#667085" size={20} />
        </Button>
      </Group>
    );
  };

  return (
    <>
      {!companyId && (
        <Group justify="space-between" className="mb-4">
          <Stack gap={0}>
            <Text fz={"32px"} fw={600} c={"#062E26"}>
              Users
            </Text>
            <Text c={"#3E4945"} fz={"14px"} fw={500}>
              Manage the users on your site
            </Text>
          </Stack>
          <Button onClick={handleInviteAdmin}>
            <Plus weight="bold" color="#ffff" size={20} className="mr-2" />
            Add new
          </Button>
        </Group>
      )}

      <PaginatedTable
        columns={columns}
        data={data?.items ?? []}
        totalRowCount={data?.pagination?.total ?? 0}
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading || deleteLoading}
        error={error}
        isFetching={isFetching}
        refetch={refetch}
        tableName="Users"
        globalFilter={search}
        setGlobalFilter={setSearch}
        enableRowActions
        renderRowActions={renderRowActions}
        positionActionsColumn="last"
        // renderTopToolbarCustomActions={() => renderCustomFilter()}
      />
    </>
  );
};
