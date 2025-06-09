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
import { LoadingOverlay, Modal, Select, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  adminUsersService,
  FETCH_ADMIN_USERS,
} from "../services/admin-users.service";

const InviteAdminFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.string(),
});

type InviteAdminFormType = z.infer<typeof InviteAdminFormSchema>;

export const InviteAdminModal = NiceModal.create(() => {
  const modal = useModal();

  const form = useForm<InviteAdminFormType>({
    resolver: zodResolver(InviteAdminFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      role: "ADMIN",
    },
  });

  const { mutate: inviteAdmin, isPending: isInviting } =
    adminUsersService.useInviteAdminUser({
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "Admin invited successfully",
          color: "green",
        });
        queryClient.invalidateQueries({ queryKey: [FETCH_ADMIN_USERS] });
        modal.remove();
      },
      onError: (error: Error) => {
        renderGenericError(error);
      },
    });

  const onSubmit = (formData: InviteAdminFormType) => {
    inviteAdmin({ ...formData, role: formData.role as "ADMIN" | "MANAGER" });
  };

  const hideModal = () => {
    modal.remove();
    form.reset();
  };

  return (
    <Modal
      onClose={hideModal}
      opened={modal.visible}
      centered
      closeOnEscape={false}
      title={
        <Text fz={32} fw={600} c="#101828">
          Invite Admin
        </Text>
      }
      styles={{
        body: { position: "relative", padding: "0px 24px 24px 24px" },
        title: { marginTop: 0 },
        header: { padding: 24 },
      }}
      size="800px"
    >
      <Form {...form}>
        <LoadingOverlay
          visible={isInviting}
          loaderProps={{ color: "#10B981" }}
        />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {"First Name"} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={"First Name"}
                      data-autofocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {"Last Name"} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={"Last Name"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {"Email"} <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder={"Email"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>
              {"Role"} <span className="text-red-500">*</span>
            </FormLabel>
            <Controller
              name="role"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <Select
                  value={value}
                  onChange={onChange}
                  placeholder="Select a role"
                  data={[
                    { value: "ADMIN", label: "Admin" },
                    { value: "MANAGER", label: "Manager" },
                  ]}
                  styles={{
                    input: {
                      height: "46px",
                      borderColor: form.formState.errors.role
                        ? "#ff6b6b"
                        : "#e5e5e5",
                    },
                  }}
                />
              )}
            />
            <FormMessage />
          </FormItem>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="transparent"
              size="xl"
              onClick={hideModal}
            >
              {"Cancel"}
            </Button>
            <Button type="submit" disabled={isInviting}>
              {"Invite"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
});
