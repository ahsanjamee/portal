import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useAuthAxios } from "@/lib/http/axios.hook";
import { useSetTitle } from "@/stores/title-context";
import { queryClient } from "@/utils/reactQueryClient";
import { notifications } from "@mantine/notifications";
import { pdf } from "@react-pdf/renderer";
import {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from "mantine-react-table";
import React, { useState } from "react";
import { PrescriptionList } from "./components/PrescriptionList";
import { PrescriptionDocument } from "./components/PrescriptionPDF";
import { superAdminPrescriptionServiceHooks } from "./service";

export const SuperAdminPrescriptionIndex: React.FC = () => {
  useSetTitle("Prescription Management");
  const axios = useAuthAxios();

  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    prescriptionId: string | null;
  }>({
    isOpen: false,
    prescriptionId: null,
  });

  // Table state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const params = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    search: globalFilter,
    sortBy: sorting[0]?.id,
    sort: sorting[0]?.desc ? "desc" : ("asc" as "desc" | "asc" | undefined),
  };

  // Fetch prescriptions using the service
  const {
    data: prescriptionsData,
    isLoading: prescriptionsLoading,
    error: prescriptionsError,
    refetch: refetchPrescriptions,
  } = superAdminPrescriptionServiceHooks.useGetSuperAdminPrescriptions(
    params,
    undefined,
    {
      queryKey: ["super-admin", "prescriptions", params],
    }
  );

  // Delete prescription mutation
  const deletePrescriptionMutation =
    superAdminPrescriptionServiceHooks.useDeletePrescriptionFromSuperAdmin({
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "Prescription deleted successfully",
          color: "green",
        });
        queryClient.invalidateQueries({
          queryKey: ["super-admin", "prescriptions"],
        });
        setDeleteConfirmation({ isOpen: false, prescriptionId: null });
      },
      onError: (error: any) => {
        notifications.show({
          title: "Error",
          message: error?.message || "Failed to delete prescription",
          color: "red",
        });
      },
    });

  const handleDeletePrescription = (id: string) => {
    setDeleteConfirmation({ isOpen: true, prescriptionId: id });
  };

  const confirmDeletePrescription = () => {
    if (deleteConfirmation.prescriptionId) {
      deletePrescriptionMutation.mutate(deleteConfirmation.prescriptionId);
    }
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, prescriptionId: null });
  };

  const handleDownloadPrescription = async (id: string) => {
    try {
      const { data } = await axios.get(`/super-admin/prescriptions/${id}`);
      await generateAndDownloadPDF(data.data);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      notifications.show({
        title: "Error",
        message: "Failed to generate prescription PDF",
        color: "red",
      });
    }
  };

  const generateAndDownloadPDF = async (prescriptionData: any) => {
    try {
      // Generate PDF using frontend component
      const blob = await pdf(
        <PrescriptionDocument data={prescriptionData} />
      ).toBlob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prescription_${prescriptionData.reference || prescriptionData.id}.pdf`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      notifications.show({
        title: "Success",
        message: "Prescription downloaded successfully",
        color: "green",
      });
    } catch (error) {
      console.error("PDF Generation Error:", error);
      notifications.show({
        title: "Error",
        message: "Failed to generate prescription PDF",
        color: "red",
      });
    }
  };

  const prescriptions = prescriptionsData?.items || [];
  const totalRowCount = prescriptionsData?.pagination?.total || 0;

  return (
    <div className="container mx-auto p-0 lg:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <h1 className="text-3xl font-bold">Prescription Management</h1>
      </div>
      <PrescriptionList
        data={prescriptions}
        loading={prescriptionsLoading}
        error={prescriptionsError}
        totalRowCount={totalRowCount}
        onDelete={handleDeletePrescription}
        onDownload={handleDownloadPrescription}
        onRefresh={refetchPrescriptions}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        setPagination={setPagination}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDeletePrescription}
        title="Delete Prescription"
        description="Are you sure you want to delete this prescription? This action cannot be undone."
        confirmText="Delete"
        loading={deletePrescriptionMutation.isPending}
      />
    </div>
  );
};
