import { Button } from "@/components/ui/button";
import { queryClient } from "@/utils/reactQueryClient";
import { renderGenericError } from "@/utils/utils";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Group,
  Input,
  InputWrapper,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Plus } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import {
  FETCH_SUPER_ADMIN_USERS,
  usersSuperAdminService,
} from "../super-admin/services/users.service";
import { InviteAdminModalFormSchema, InviteAdminModalFormType } from "./types";

export const InviteAdminModal = NiceModal.create(() => {
  const modal = useModal();

  const {
    formState: { errors, isValid },
    handleSubmit,
    watch,
    register,
  } = useForm<InviteAdminModalFormType>({
    resolver: zodResolver(InviteAdminModalFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  const watchFirstName = watch("firstName");
  const watchLastName = watch("lastName");
  const watchEmail = watch("email");

  // invite admin mutation
  const { mutate, isPending } = usersSuperAdminService.useInviteAdmin({
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Admin invited successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: [FETCH_SUPER_ADMIN_USERS] });
      modal.remove();
    },
    onError: (error) => {
      renderGenericError(error);
    },
  });

  const onSubmit = (data: InviteAdminModalFormType) => {
    const payload = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    mutate(payload);
  };

  const hideModal = () => {
    modal.remove();
  };

  return (
    <Modal
      onClose={hideModal}
      opened={modal.visible}
      centered
      closeOnEscape={false}
      title={
        <Text fz={32} fw={600} c="#101828">
          Add new user
        </Text>
      }
      styles={{
        body: { position: "relative", padding: "0px 24px 24px 24px" },
        title: { marginTop: 0 },
        header: { padding: 24 },
      }}
      size="512px"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-between"
      >
        <LoadingOverlay
          visible={isPending}
          loaderProps={{ color: "#10B981" }}
        />
        <Stack gap={16}>
          <InputWrapper
            className="relative"
            label={
              <Group className="mb-2">
                <Text fz={14} fw={500} c="#3E4945">
                  First name <span className="text-red-500">*</span>
                </Text>
              </Group>
            }
          >
            <Input
              placeholder="First name"
              size="md"
              data-autofocus
              type="text"
              error={errors?.firstName?.message as string}
              value={watchFirstName}
              {...register("firstName")}
              styles={{
                input: {
                  border: "1px solid #D0D5DD",
                  borderRadius: "8px",
                  color: "#3E4945",
                  height: "40px",
                  minHeight: "40px",
                },
                wrapper: {
                  height: "40px",
                },
              }}
            />

            {errors.firstName && (
              <p className="absolute text-red-500">
                {errors.firstName.message as string}
              </p>
            )}
          </InputWrapper>

          <InputWrapper
            className="relative"
            label={
              <Group className="mb-2">
                <Text fz={14} fw={500} c="#3E4945">
                  Last name <span className="text-red-500">*</span>
                </Text>
              </Group>
            }
          >
            <Input
              placeholder="Last name"
              size="md"
              type="text"
              error={errors?.lastName?.message as string}
              value={watchLastName}
              {...register("lastName")}
              styles={{
                input: {
                  border: "1px solid #D0D5DD",
                  borderRadius: "8px",
                  color: "#3E4945",
                  height: "40px",
                  minHeight: "40px",
                },
                wrapper: {
                  height: "40px",
                },
              }}
            />

            {errors.lastName && (
              <p className="absolute text-red-500">
                {errors.lastName.message as string}
              </p>
            )}
          </InputWrapper>

          <InputWrapper
            className="relative"
            label={
              <Group>
                <Text fz={14} fw={500} c="#3E4945">
                  Email <span className="text-red-500">*</span>
                </Text>
              </Group>
            }
          >
            <Input
              required
              placeholder="Email address"
              size="md"
              type="email"
              error={errors.email?.message as string}
              value={watchEmail}
              {...register("email")}
              styles={{
                input: {
                  border: "1px solid #D0D5DD",
                  borderRadius: "8px",
                  color: "#3E4945",
                  height: "40px",
                  minHeight: "40px",
                },
                wrapper: {
                  height: "40px",
                },
              }}
            />

            {errors?.email && (
              <p className="absolute text-red-500 text-[10px]">
                {errors.email.message as string}
              </p>
            )}
          </InputWrapper>

          <Group pt={16} justify="flex-end">
            <Button
              type="button"
              variant="transparent"
              size="xl"
              onClick={hideModal}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              type="submit"
              size="xl"
              disabled={!isValid}
            >
              <Plus size={20} color="#FFFFFF" weight="bold" className="mr-2" />{" "}
              Add
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
});
