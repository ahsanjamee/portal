import { Button } from "@/components/ui/button";
import { ConsentModal } from "@/components/ui/ConsentModal";
import PaginatedTable from "@/components/ui/Table/PaginatedTable";
import { useSetTitle } from "@/stores/title-context";
import { queryClient } from "@/utils/reactQueryClient";
import { renderGenericError } from "@/utils/utils";
import { useModal } from "@ebay/nice-modal-react";
import { Group, Stack, Switch, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Trash } from "@phosphor-icons/react";
import type { UserWithProfileResponseDto } from "@portal/portal-api-client";
import dayjs from "dayjs";
import {
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "mantine-react-table";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { superAdminUsersService } from "./services/super-admin-users.service";

export const AdminsPage = () => {
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<string>("");
  const consentModal = useModal(ConsentModal);
  const navigate = useNavigate();

  useSetTitle("Admin Users");

  const { data, isLoading, error, isFetching, refetch } =
    superAdminUsersService.useGetAdmins({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      sortBy: sorting.length ? (sorting[0]?.id as string) : "createdAt",
      sort: sorting.length ? (sorting[0]?.desc ? "desc" : "asc") : "desc",
      search,
    });

  const { mutate: deleteUser, isPending: deleteLoading } =
    superAdminUsersService.useDeleteAdmin({
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "Admin user deleted successfully",
          color: "green",
        });
        queryClient.invalidateQueries({ queryKey: ["super-admin", "admins"] });
      },
      onError: (error) => {
        renderGenericError(error);
      },
    });

  const { mutate: updateStatus, isPending: updateLoading } =
    superAdminUsersService.useUpdateAdminStatus({
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "Admin user status updated successfully",
          color: "green",
        });
        queryClient.invalidateQueries({ queryKey: ["super-admin", "admins"] });
      },
      onError: (error) => {
        renderGenericError(error);
      },
    });

  const handleUserActive = (e: any, id: string) => {
    const isActive = e.target.checked;
    updateStatus({ id, data: { isActive } });
  };

  const onDeleteUser = async (id: string) => {
    const res = await consentModal.show({
      title: "Delete Admin User",
      description:
        "Are you sure you want to delete this admin user? This action cannot be undone.",
      type: "delete",
    });
    if (res) {
      deleteUser(id);
    }
  };

  const handleRowClick = (row: UserWithProfileResponseDto) => {
    navigate(`/super-admin/admin/${row.id}`, {
      state: { user: row },
    });
  };

  const columns = useMemo<MRT_ColumnDef<UserWithProfileResponseDto>[]>(
    () => [
      {
        accessorKey: "profile.name",
        header: "Name",
        maxSize: 250,
        size: 200,
        Cell: ({ row }) => (
          <Text className="block text-sm leading-5 text-[#1D2823]">
            {row.original.profile?.name || "N/A"}
          </Text>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "mobileNumber",
        header: "Mobile Number",
        maxSize: 200,
        size: 150,
        Cell: ({ row }) => (
          <span className="block text-sm leading-5 text-[#1D2823]">
            {row.original.mobileNumber || "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        maxSize: 200,
        size: 150,
        Cell: ({ row }) => (
          <span className="block text-sm leading-5 text-[#1D2823]">
            {row.original.email === row.original.mobileNumber
              ? "N/A"
              : row.original.email}
          </span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "userType",
        header: "User Type",
        Cell: ({ row }) => (
          <span className="block text-sm leading-5 text-[#1D2823]">
            {row.original.profile?.userType === "SERVICE_PROVIDER"
              ? "Service Provider"
              : "Chemist"}
          </span>
        ),
        enableSorting: false,
      },

      {
        accessorKey: "createdAt",
        header: "Created",
        Cell: ({ cell }) =>
          dayjs(cell.getValue() as string).format("MMM D, YYYY"),
      },
    ],
    []
  );

  const renderRowActions = ({ row }: { row: any }) => {
    return (
      <Group
        gap={8}
        onClick={(e) => e.stopPropagation()}
        w={"180"}
        className="flex flex-nowrap"
      >
        <Button
          variant={"outline"}
          size={"sm"}
          className="text-xs mr-2"
          onClick={() => handleRowClick(row.original)}
        >
          Details
        </Button>
        <Switch
          size="md"
          className="border-0"
          disabled={updateLoading}
          checked={row.original.isActive}
          onChange={(e) => handleUserActive(e, row.original.id)}
          styles={(theme) => ({
            track: {
              background: row.original.isActive ? "#10B981" : "#F2F4F7",
              cursor: updateLoading ? "not-allowed" : "pointer",
              opacity: updateLoading ? 0.6 : 1,
            },
            thumb: {
              backgroundColor: updateLoading ? "#ccc" : theme.white,
            },
          })}
        />
        <Button
          variant={"transparent"}
          onClick={() => onDeleteUser(row.original.id)}
          size={"sm"}
          disabled={deleteLoading}
        >
          <Trash weight="bold" color="#667085" size={20} />
        </Button>
      </Group>
    );
  };

  return (
    <>
      <Group justify="space-between" className="mb-4">
        <Stack gap={0}>
          <Text fz={"32px"} fw={600} c={"#062E26"}>
            Admin Users
          </Text>
          <Text c={"#3E4945"} fz={"14px"} fw={500}>
            Manage admin users and service providers on the platform
          </Text>
        </Stack>
      </Group>

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
        tableName="Admin Users"
        globalFilter={search}
        setGlobalFilter={setSearch}
        enableRowActions
        renderRowActions={renderRowActions}
        positionActionsColumn="last"
        onRowClick={handleRowClick}
      />
    </>
  );
};
