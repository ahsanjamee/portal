import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSetTitle } from "@/stores/title-context";
import { notifications } from "@mantine/notifications";
import { Plus } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { pdf } from "@react-pdf/renderer";
import {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from "mantine-react-table";
import React, { useState } from "react";
import { PrescriptionForm } from "./components/PrescriptionForm";
import { PrescriptionList } from "./components/PrescriptionList";
import { PrescriptionDocument } from "./components/PrescriptionPDF";
import { prescriptionServiceHooks } from "./service";
import { useAuthAxios } from "@/lib/http/axios.hook";
import { PDFViewer } from "@react-pdf/renderer";
import QRCode from "qrcode";

export const PrescriptionIndex: React.FC = () => {
  useSetTitle("Prescription Management");
  const axios = useAuthAxios();

  const [activeTab, setActiveTab] = useState<"list" | "create" | "edit">(
    "list"
  );
  const [currentPrescriptionId, setCurrentPrescriptionId] = useState<
    string | null
  >(null);
  const queryClient = useQueryClient();

  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    prescriptionId: string | null;
  }>({
    isOpen: false,
    prescriptionId: null,
  });

  // View prescription modal state
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    prescriptionData: any;
  }>({
    isOpen: false,
    prescriptionData: null,
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
  } = prescriptionServiceHooks.useGetPrescriptions(params, undefined, {
    queryKey: ["prescriptions", params],
  });

  // Fetch patients for the form using the service
  const { data: patientsData, isLoading: patientsLoading } =
    prescriptionServiceHooks.useGetPatients({
      page: 1,
      pageSize: 1000, // Get all patients for the form
    });

  // Fetch prescription for current
  const {
    data: currentPrescriptionData,
    isLoading: currentPrescriptionLoading,
  } = prescriptionServiceHooks.useGetPrescription(currentPrescriptionId || "", {
    enabled: !!currentPrescriptionId,
  });

  // Create prescription mutation using the service
  const createPrescriptionMutation =
    prescriptionServiceHooks.useCreatePrescription({
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "Prescription created successfully",
          color: "green",
        });
        queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
        setActiveTab("list");
      },
      onError: (error: any) => {
        notifications.show({
          title: "Error",
          message: error?.message || "Failed to create prescription",
          color: "red",
        });
      },
    });

  // Update prescription mutation
  const updatePrescriptionMutation =
    prescriptionServiceHooks.useUpdatePrescription({
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "Prescription updated successfully",
          color: "green",
        });
        queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
        queryClient.invalidateQueries({
          queryKey: ["prescription", currentPrescriptionId],
        });
        setActiveTab("list");
        setCurrentPrescriptionId(null);
      },
      onError: (error: any) => {
        notifications.show({
          title: "Error",
          message: error?.message || "Failed to update prescription",
          color: "red",
        });
      },
    });

  // Delete prescription mutation
  const deletePrescriptionMutation =
    prescriptionServiceHooks.useDeletePrescription({
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "Prescription deleted successfully",
          color: "green",
        });
        queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
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

  const handleCreatePrescription = (data: any) => {
    createPrescriptionMutation.mutate(data);
  };

  const handleUpdatePrescription = (data: any) => {
    if (currentPrescriptionId) {
      updatePrescriptionMutation.mutate({
        id: currentPrescriptionId,
        data: data,
      });
    }
  };

  const handleEditPrescription = (id: string) => {
    setCurrentPrescriptionId(id);
    setActiveTab("edit");
  };

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
      setCurrentPrescriptionId(id);
      const { data } = await axios.get(`/prescription/${id}`);
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

  const handleViewPrescription = async (id: string) => {
    try {
      const { data } = await axios.get(`/prescription/${id}`);
      setViewModal({
        isOpen: true,
        prescriptionData: data.data,
      });
    } catch (error) {
      console.error("Error fetching prescription:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch prescription details",
        color: "red",
      });
    }
  };

  const closeViewModal = () => {
    setViewModal({ isOpen: false, prescriptionData: null });
  };

  const generateQRCodeDataURL = async (value: string): Promise<string> => {
    return await QRCode.toDataURL(value);
  };

  const generateAndDownloadPDF = async (prescriptionData: any) => {
    try {
      // Generate PDF using frontend component
      const blob = await pdf(
        <PrescriptionDocument
          data={prescriptionData}
          qrUrl={generateQRCodeDataURL("https://adibd.net")}
        />
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
  const patients = patientsData?.items || [];

  return (
    <div className="container mx-auto p-0 lg:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <h1 className="text-3xl font-bold">Prescription Management</h1>
        <Button
          onClick={() => setActiveTab("create")}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Create New Prescription
        </Button>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "list" | "create" | "edit")
        }
      >
        <TabsList
          className={`h-auto min-h-12 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 w-full p-2 ${activeTab === "edit" ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
        >
          <TabsTrigger value="list" className="h-12 text-sm font-medium">
            Prescription List
          </TabsTrigger>
          <TabsTrigger value="create" className="h-12 text-sm font-medium">
            Create Prescription
          </TabsTrigger>
          {activeTab === "edit" && (
            <TabsTrigger
              value="edit"
              className="h-12 text-sm font-medium sm:col-span-2 lg:col-span-1"
            >
              Edit Prescription
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <PrescriptionList
            data={prescriptions}
            loading={
              prescriptionsLoading ||
              currentPrescriptionLoading ||
              patientsLoading
            }
            error={prescriptionsError}
            totalRowCount={totalRowCount}
            onEdit={handleEditPrescription}
            onDelete={handleDeletePrescription}
            onDownload={handleDownloadPrescription}
            onView={handleViewPrescription}
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
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <PrescriptionForm
            onSubmit={handleCreatePrescription}
            loading={createPrescriptionMutation.isPending}
            patients={patients}
            setActiveTab={setActiveTab}
          />
        </TabsContent>

        {activeTab === "edit" && (
          <TabsContent value="edit" className="space-y-4">
            <PrescriptionForm
              onSubmit={handleUpdatePrescription}
              loading={updatePrescriptionMutation.isPending}
              patients={patients}
              initialData={currentPrescriptionData}
              isEditMode={true}
              setActiveTab={setActiveTab}
            />
          </TabsContent>
        )}
      </Tabs>

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

      {/* View Prescription Modal */}
      <Dialog open={viewModal.isOpen} onOpenChange={closeViewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
          </DialogHeader>
          {viewModal.prescriptionData && (
            <div className="mt-4 h-[1400px] w-full">
              <PDFViewer className="w-full h-full">
                <PrescriptionDocument
                  data={viewModal.prescriptionData}
                  qrUrl={generateQRCodeDataURL("https://adibd.net")}
                />
              </PDFViewer>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
