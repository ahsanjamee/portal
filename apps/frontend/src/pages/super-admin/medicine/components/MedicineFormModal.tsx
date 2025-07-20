import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/utils/reactQueryClient";
import { renderGenericError } from "@/utils/utils";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingOverlay, Modal, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FETCH_MEDICINES, medicineServiceHooks } from "../service";
import type { MedicationResponseDto } from "@portal/portal-api-client";

const MedicineFormSchema = z.object({
  name: z.string().min(1, "Medicine name is required"),
});

type MedicineFormType = z.infer<typeof MedicineFormSchema>;

interface MedicineFormModalProps {
  medicine?: MedicationResponseDto;
  isEditMode?: boolean;
}

export const MedicineFormModal = NiceModal.create<MedicineFormModalProps>(
  ({ medicine, isEditMode = false }) => {
    const modal = useModal();

    const form = useForm<MedicineFormType>({
      resolver: zodResolver(MedicineFormSchema),
      defaultValues: {
        name: medicine?.name || "",
      },
    });

    const { mutate: createMedicine, isPending: isCreating } =
      medicineServiceHooks.useCreateMedicine({
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Medicine created successfully",
            color: "green",
          });
          queryClient.invalidateQueries({ queryKey: [FETCH_MEDICINES] });
          modal.remove();
        },
        onError: (error: Error) => {
          renderGenericError(error);
        },
      });

    const { mutate: updateMedicine, isPending: isUpdating } =
      medicineServiceHooks.useUpdateMedicine({
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Medicine updated successfully",
            color: "green",
          });
          queryClient.invalidateQueries({ queryKey: [FETCH_MEDICINES] });
          modal.remove();
        },
        onError: (error: Error) => {
          renderGenericError(error);
        },
      });

    const onSubmit = (formData: MedicineFormType) => {
      if (isEditMode && medicine) {
        updateMedicine({ id: medicine.id, data: formData });
      } else {
        createMedicine(formData);
      }
    };

    const hideModal = () => {
      modal.remove();
      form.reset();
    };

    const isLoading = isCreating || isUpdating;

    return (
      <Modal
        onClose={hideModal}
        opened={modal.visible}
        centered
        closeOnEscape={false}
        title={
          <Text fz={32} fw={600} c="#101828">
            {isEditMode ? "Edit Medicine" : "Add New Medicine"}
          </Text>
        }
        styles={{
          body: { position: "relative", padding: "0px 24px 24px 24px" },
          title: { marginTop: 0 },
          header: { padding: 24 },
        }}
        size="512px"
      >
        <Form {...form}>
          <LoadingOverlay
            visible={isLoading}
            loaderProps={{ color: "#10B981" }}
          />

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Medicine Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter medicine name"
                      data-autofocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="transparent"
                size="xl"
                onClick={hideModal}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update Medicine"
                    : "Create Medicine"}
              </Button>
            </div>
          </form>
        </Form>
      </Modal>
    );
  }
);
