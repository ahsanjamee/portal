import PaginatedTable from "@/components/ui/Table/PaginatedTable";
import { Button } from "@/components/ui/button";
import { ConsentModal } from "@/components/ui/ConsentModal";
import { useGlobalStoreSelector } from "@/stores/global.store";
import { useSetTitle } from "@/stores/title-context";
import { queryClient } from "@/utils/reactQueryClient";
import { convertDateToNorwegian, renderGenericError } from "@/utils/utils";
import { useModal } from "@ebay/nice-modal-react";
import { Group, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Pencil, Plus, Trash } from "@phosphor-icons/react";
import dayjs from "dayjs";
import {
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "mantine-react-table";
import { useMemo, useState } from "react";
import { MedicineFormModal } from "./components";
import { FETCH_MEDICINES, medicineServiceHooks } from "./service";
import type { MedicationResponseDto } from "@portal/portal-api-client";

export const MedicineIndex = () => {
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<string>("");
  const { language } = useGlobalStoreSelector((s) => s);

  const medicineFormModal = useModal(MedicineFormModal);
  const consentModal = useModal(ConsentModal);

  useSetTitle("Medicines");

  const queryParams = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortBy: sorting.length ? (sorting[0]?.id as string) : "createdAt",
    sort: (sorting.length ? (sorting[0]?.desc ? "desc" : "asc") : "desc") as
      | "asc"
      | "desc",
    ...(search ? { search } : {}),
  };

  const { data, isLoading, error, isFetching, refetch } =
    medicineServiceHooks.useGetMedicines(queryParams, {
      queryKey: [FETCH_MEDICINES, queryParams],
    });

  const { mutate: deleteMedicine, isPending: deleteLoading } =
    medicineServiceHooks.useDeleteMedicine({
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "Medicine deleted successfully",
          color: "green",
        });
        queryClient.invalidateQueries({ queryKey: [FETCH_MEDICINES] });
      },
      onError: (error) => {
        renderGenericError(error);
      },
    });

  const onDeleteMedicine = async (id: string) => {
    const res = await consentModal.show({
      title: "Delete Medicine",
      description: "Are you sure you want to delete this medicine?",
      type: "delete",
    });
    if (res) {
      deleteMedicine(id);
    }
  };

  const handleCreateMedicine = () => {
    medicineFormModal.show({ isEditMode: false });
  };

  const handleEditMedicine = (medicine: MedicationResponseDto) => {
    medicineFormModal.show({ medicine, isEditMode: true });
  };

  const columns = useMemo<MRT_ColumnDef<MedicationResponseDto>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Medicine Name",
        maxSize: 450,
        size: 250,
        Cell: ({ row }) => (
          <Text className="block text-sm leading-5 text-[#1D2823]">
            {row.original.name}
          </Text>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        Cell: ({ cell }) =>
          convertDateToNorwegian(
            dayjs(cell.getValue() as string).format("MMM D, YYYY"),
            language
          ),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        Cell: ({ cell }) =>
          convertDateToNorwegian(
            dayjs(cell.getValue() as string).format("MMM D, YYYY"),
            language
          ),
      },
    ],
    [language]
  );

  const renderRowActions = ({ row }: { row: any }) => {
    const isDisabled = deleteLoading;
    return (
      <Group
        gap={8}
        onClick={(e) => e.stopPropagation()}
        w={"140"}
        className="flex flex-nowrap"
      >
        <Button
          variant={"transparent"}
          onClick={() => handleEditMedicine(row.original)}
          size={"sm"}
          disabled={isDisabled}
        >
          <Pencil weight="bold" color="#667085" size={20} />
        </Button>
        <Button
          variant={"transparent"}
          onClick={() => onDeleteMedicine(row.id)}
          size={"sm"}
          disabled={isDisabled}
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
            Medicines
          </Text>
          <Text c={"#3E4945"} fz={"14px"} fw={500}>
            Manage the medicines in your system
          </Text>
        </Stack>
        <Button onClick={handleCreateMedicine}>
          <Plus weight="bold" color="#ffff" size={20} className="mr-2" />
          Add new
        </Button>
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
        tableName="Medicines"
        globalFilter={search}
        setGlobalFilter={setSearch}
        enableRowActions
        renderRowActions={renderRowActions}
        positionActionsColumn="last"
      />
    </>
  );
};
