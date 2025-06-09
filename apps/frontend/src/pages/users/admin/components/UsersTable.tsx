import { Button } from "@/components/ui/button";
import { ConsentModal } from "@/components/ui/ConsentModal";
import PaginatedTable from "@/components/ui/Table/PaginatedTable";
import { useGlobalStoreSelector } from "@/stores/global.store";
import { useTranslate } from "@/translations/provider";
import { queryClient } from "@/utils/reactQueryClient";
import { convertDateToNorwegian, renderGenericError } from "@/utils/utils";
import { useModal } from "@ebay/nice-modal-react";
import { Box, Group, Image, Select, Switch } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Trash } from "@phosphor-icons/react";
import dayjs from "dayjs";
import {
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "mantine-react-table";
import { useMemo, useState } from "react";
import {
  adminUsersService,
  FETCH_ADMIN_USERS,
} from "../services/admin-users.service";
interface UsersTableProps {
  authPanel: "USER" | "ADMIN";
}

export const UsersTable = ({ authPanel }: UsersTableProps) => {
  const t = useTranslate();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<string>("");
  const { language } = useGlobalStoreSelector((s) => s);
  const consentModal = useModal(ConsentModal);

  const { data, isLoading, error, isFetching, refetch } =
    adminUsersService.useGetAdminUsers({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      sortBy: sorting.length ? (sorting[0]?.id as string) : "createdAt",
      sort: sorting.length ? (sorting[0]?.desc ? "desc" : "asc") : "desc",
      panelType: authPanel,
      search,
    });

  const { mutate: updateUser, isPending: updateLoading } =
    adminUsersService.useUpdateAdminUser({
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "User updated successfully",
          color: "green",
        });
        queryClient.invalidateQueries({ queryKey: [FETCH_ADMIN_USERS] });
      },
      onError: (error) => {
        renderGenericError(error);
      },
    });

  const { mutate: updateUserRole, isPending: updateRoleLoading } =
    adminUsersService.useUpdateCompanyUserRole({
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "User role updated successfully",
          color: "green",
        });
        queryClient.invalidateQueries({ queryKey: [FETCH_ADMIN_USERS] });
      },
      onError: (error) => {
        renderGenericError(error);
      },
    });

  const { mutate: deleteUser, isPending: deleteLoading } =
    adminUsersService.useDeleteAdmin({
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "User deleted successfully",
          color: "green",
        });
        queryClient.invalidateQueries({ queryKey: [FETCH_ADMIN_USERS] });
      },
      onError: (error) => {
        renderGenericError(error);
      },
    });

  const handleUserActive = (e: any, id: string) => {
    const active = e.target.checked;
    updateUser({ active, id });
  };

  const handleRoleChange = (id: string, newRole: "ADMIN" | "MANAGER") => {
    updateUserRole({ id, role: newRole });
  };

  // const handleEditUser = (data: any) => {
  //     // TODO: Implement edit modal similar to CompanyIndex
  //     console.log('Edit user:', data);
  // };

  const handleDeleteUser = async (id: string) => {
    const res = await consentModal.show({
      title: "Delete User",
      description: "Are you sure you want to delete this user?",
      type: "delete",
    });
    if (res) {
      deleteUser(id);
    }
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Name",
        maxSize: 450,
        size: 450,
        Cell: ({ row }) => (
          <Box className="flex gap-3">
            <Image
              src={row.original.avatar ? row.original.avatar : "/avatar.svg"}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <span className="block text-sm leading-5 text-[#1D2823]">{`${row.original.firstName} ${row.original.lastName}`}</span>
              <span className="block text-sm leading-5 text-[#697D95]">
                {row.original.email}
              </span>
            </div>
          </Box>
        ),
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
      {
        accessorKey: "updatedAt",
        header: t("Updated"),
        Cell: ({ cell }) =>
          convertDateToNorwegian(
            dayjs(cell.getValue() as string).format("MMM D, YYYY"),
            language
          ),
      },
      {
        accessorKey: "isActive",
        header: t("Status"),
        enableSorting: false,
        Cell: ({ row }) => (
          <span
            className={`px-[8px] py-[2px] rounded-xl  font-semibold   text-[12px] ${row.original.isActive ? "bg-[#ECFDF3] text-[#027A48]" : "bg-[#FAECEC] text-[#D21C1C]"}`}
          >
            {row.original.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
    ],
    [language, t]
  );

  const renderRowActions = ({ row }: { row: any }) => {
    const isNotEditable =
      updateLoading ||
      deleteLoading ||
      updateRoleLoading ||
      row.original.userCompany?.role === "OWNER";
    return (
      <Group
        gap={4}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-nowrap"
      >
        <Switch
          size="md"
          className="border-0 mr-10"
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
        {authPanel === "ADMIN" && (
          <Select
            value={row.original.userCompany?.role}
            onChange={(value) =>
              value && handleRoleChange(row.id, value as "ADMIN" | "MANAGER")
            }
            data={[
              { value: "ADMIN", label: "ADMIN" },
              { value: "MANAGER", label: "MANAGER" },
              { value: "OWNER", label: "OWNER", disabled: true },
            ]}
            disabled={isNotEditable}
            w={180}
            size="sm"
            styles={{
              input: {
                padding: "0 8px",
                height: "32px",
                minHeight: "32px",
              },
              dropdown: {
                border: "1px solid #E4E7EC",
                borderRadius: "8px",
              },
            }}
          />
        )}
        <Button
          variant={"transparent"}
          onClick={() => handleDeleteUser(row.id)}
          size={"sm"}
          disabled={isNotEditable}
        >
          <Trash weight="bold" color="#667085" size={20} />
        </Button>
      </Group>
    );
  };

  return (
    <PaginatedTable
      columns={columns}
      data={data?.items ?? []}
      totalRowCount={data?.pagination?.total ?? 0}
      sorting={sorting}
      setSorting={setSorting}
      pagination={pagination}
      setPagination={setPagination}
      isLoading={isLoading}
      error={error}
      isFetching={isFetching}
      refetch={refetch}
      tableName="Users"
      globalFilter={search}
      setGlobalFilter={setSearch}
      enableRowActions
      renderRowActions={renderRowActions}
      positionActionsColumn="last"
    />
  );
};
