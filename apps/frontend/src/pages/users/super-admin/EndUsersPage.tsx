import { Button } from "@/components/ui/button";
import { ConsentModal } from "@/components/ui/ConsentModal";
import PaginatedTable from "@/components/ui/Table/PaginatedTable";
import { useSetTitle } from "@/stores/title-context";
import { queryClient } from "@/utils/reactQueryClient";
import { renderGenericError } from "@/utils/utils";
import { useModal } from "@ebay/nice-modal-react";
import { Badge, Group, Stack, Switch, Text, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { ExportIcon, Trash } from "@phosphor-icons/react";
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

export const EndUsersPage = () => {
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<string>("");
  const [userType, setUserType] = useState<
    | "DAIRY_FARMER"
    | "POULTRY_FARMER"
    | "FISH_FARMER"
    | "AGRICULTURE_FARMER"
    | ""
  >("");
  const consentModal = useModal(ConsentModal);
  const navigate = useNavigate();

  useSetTitle("End Users (Farmers)");

  const queryParams = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortBy: sorting.length ? (sorting[0]?.id as string) : "createdAt",
    sort: (sorting.length ? (sorting[0]?.desc ? "desc" : "asc") : "desc") as
      | "asc"
      | "desc",
    search,
    userType: userType || undefined,
  };

  const { data, isLoading, error, isFetching, refetch } =
    superAdminUsersService.useGetEndUsers(queryParams, {
      queryKey: ["super-admin", "end-users", queryParams],
    });

  const { mutateAsync: exportUsers, isPending: exportLoading } =
    superAdminUsersService.useExportUsers();

  const { mutate: deleteUser, isPending: deleteLoading } =
    superAdminUsersService.useDeleteEndUser({
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "End user deleted successfully",
          color: "green",
        });
        queryClient.invalidateQueries({
          queryKey: ["super-admin", "end-users"],
        });
      },
      onError: (error) => {
        renderGenericError(error);
      },
    });

  const { mutate: updateStatus, isPending: updateLoading } =
    superAdminUsersService.useUpdateEndUserStatus({
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "End user status updated successfully",
          color: "green",
        });
        queryClient.invalidateQueries({
          queryKey: ["super-admin", "end-users"],
        });
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
      title: "Delete End User",
      description:
        "Are you sure you want to delete this end user? This action cannot be undone.",
      type: "delete",
    });
    if (res) {
      deleteUser(id);
    }
  };

  const handleRowClick = (row: UserWithProfileResponseDto) => {
    navigate(`/super-admin/end-user/${row.id}`, {
      state: { user: row },
    });
  };

  const handleExportUsers = async () => {
    await exportUsers()
      .then((res) => {
        const url = window.URL.createObjectURL(
          new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.download = `Users.xlsx`;
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((e) => {
        notifications.show({ message: (e as any).message, color: "red" });
      });
  };

  const columns = useMemo<MRT_ColumnDef<UserWithProfileResponseDto>[]>(
    () => [
      {
        accessorKey: "profile.name",
        header: "Name",

        Cell: ({ row }) => (
          <Text className="block text-sm leading-5 text-[#1D2823]">
            {row.original.profile?.name || "N/A"}
          </Text>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "profile.userType",
        header: "User Type",
        Cell: ({ row }) => {
          const userType = row.original.profile?.userType;
          const displayName = userType
            ? userType
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/\b\w/g, (l) => l.toUpperCase())
            : "N/A";
          return (
            <Badge
              variant="light"
              color={
                userType === "DAIRY_FARMER"
                  ? "blue"
                  : userType === "POULTRY_FARMER"
                    ? "green"
                    : userType === "FISH_FARMER"
                      ? "cyan"
                      : userType === "AGRICULTURE_FARMER"
                        ? "orange"
                        : "gray"
              }
              size="md"
              w={150}
            >
              {displayName}
            </Badge>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "mobileNumber",
        header: "Mobile Number",
        Cell: ({ row }) => (
          <span className="block text-sm leading-5 text-[#1D2823]">
            {row.original.mobileNumber || "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        Cell: ({ row }) => (
          <span className="block text-sm leading-5 text-[#1D2823]">
            {row.original.email === row.original.mobileNumber
              ? "N/A"
              : row.original.email || "N/A"}
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
            End Users (Farmers)
          </Text>
          <Text c={"#3E4945"} fz={"14px"} fw={500}>
            Manage end users and farmers on the platform
          </Text>
        </Stack>
        <Button onClick={handleExportUsers} disabled={exportLoading}>
          <ExportIcon weight="bold" color="#ffff" size={20} className="mr-2" />
          {exportLoading ? "Exporting..." : "Export"}
        </Button>
      </Group>

      <Group className="mb-4">
        <Select
          placeholder="Filter by user type"
          value={userType}
          onChange={(value) => setUserType((value as typeof userType) || "")}
          data={[
            { value: "", label: "All Types" },
            { value: "DAIRY_FARMER", label: "Dairy Farmer" },
            { value: "POULTRY_FARMER", label: "Poultry Farmer" },
            { value: "FISH_FARMER", label: "Fish Farmer" },
            { value: "AGRICULTURE_FARMER", label: "Agriculture Farmer" },
          ]}
          clearable
          w={200}
        />
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
        tableName="End Users"
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
