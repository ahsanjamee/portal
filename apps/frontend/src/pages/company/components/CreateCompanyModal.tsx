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
import UploadCompanyLogo from "@/components/ui/UploadCompanyLogo";
import { queryClient } from "@/utils/reactQueryClient";
import { renderGenericError } from "@/utils/utils";
import {
  InviteCompanyDto,
  SuperAdminCompanyDto,
} from "@corpactive/corpactive-api-client";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  TagsInput,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { adminCompanyService } from "../services/company.service";
import {
  CreateCompanyFormSchema,
  CreateCompanyFormType,
  EditCompanyFormSchema,
  EditCompanyFormType,
} from "./types";

interface CreateCompanyModalProps {
  data?: SuperAdminCompanyDto & InviteCompanyDto;
}

export const CreateCompanyModal = NiceModal.create<CreateCompanyModalProps>(
  ({ data }) => {
    const modal = useModal();
    const isEditMode = !!data?.id;

    const [logo, setLogo] = useState(() => data?.logo || "");
    //  const [logoId, setLogoId] = useState(() => '');

    const form = useForm<CreateCompanyFormType | EditCompanyFormType>({
      resolver: zodResolver(
        isEditMode ? EditCompanyFormSchema : CreateCompanyFormSchema
      ),
      defaultValues: {
        email: data?.email ?? "",
        // subDomain: data?.subDomain ?? '',
        authDomains: data?.authDomains ?? [],
        userLimit: data?.userLimit ? data.userLimit.toString() : "1",
        firstName: data?.firstName ?? "",
        lastName: data?.lastName ?? "",
        companyName: data?.name ?? "",
        address: data?.address ?? "",
        phone: data?.phone ?? "",
      },
    });

    const { mutate: createCompany, isPending: createLoading } =
      adminCompanyService.useCreateCompany({
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Success",
            color: "green",
          });
          queryClient.invalidateQueries({
            queryKey: adminCompanyService.adminCompanyKeys.all,
          });
          modal.remove();
        },
        onError: (error) => {
          renderGenericError(error);
        },
      });

    const { mutate: updateCompany, isPending: updateLoading } =
      adminCompanyService.useUpdateCompany({
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Success",
            color: "green",
          });
          queryClient.invalidateQueries({
            queryKey: adminCompanyService.adminCompanyKeys.all,
          });
          modal.remove();
        },
        onError: (error) => {
          renderGenericError(error);
        },
      });

    const { mutateAsync: uploadCompanyLogo, isPending: isUploading } =
      adminCompanyService.useUploadCompanyLogo();

    const onSubmit = (
      formData: CreateCompanyFormType | EditCompanyFormType
    ) => {
      if (!logo) {
        notifications.show({
          title: "Error",
          message: "Logo is required",
          color: "red",
        });
        return;
      }
      if (data) {
        updateCompany({
          id: data.id,
          data: {
            name: formData.companyName,
            authDomains: formData.authDomains,
            userLimit: Number(formData.userLimit),
            phone: formData.phone,
            address: formData.address,
            logo,
          },
        });
      } else {
        createCompany({
          ...formData,
          logo,
          userLimit: Number(formData.userLimit),
        } as any);
      }
    };

    const hideModal = () => {
      modal.remove();
      form.reset();
      setLogo("");
    };

    const isPending = createLoading || updateLoading;

    return (
      <Modal
        onClose={hideModal}
        opened={modal.visible}
        centered
        closeOnEscape={false}
        title={
          <Text fz={32} fw={600} c="#101828">
            {isEditMode ? "Edit Company" : "Add New Company"}
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
            visible={isPending}
            loaderProps={{ color: "#10B981" }}
          />

          <Group className="mb-0">
            <Stack gap={4}>
              <Text fz={14} fw={500} c="#3E4945">
                {"Logo"} <span className="text-red-500">*</span>
              </Text>
              <Text fz={12} fw={500} c="#3E4945">
                Max size 10 mb (png, jpg)
              </Text>
            </Stack>
          </Group>

          <UploadCompanyLogo
            file={logo}
            setFile={setLogo}
            mutateAsync={uploadCompanyLogo}
            uploading={isUploading}
          />

          <form
            onSubmit={(e) => {
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {"Company Name"} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={"Company Name"}
                      data-autofocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditMode && (
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
                        <Input {...field} placeholder={"First Name"} />
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
            )}

            {!isEditMode && (
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
            )}

            {/* <FormField
                            control={form.control}
                            name="subDomain"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {'Subdomain'} <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={'Subdomain'} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

            <FormField
              control={form.control}
              name="authDomains"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {"Auth Domains"} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <TagsInput
                      {...field}
                      placeholder="Type and press enter"
                      splitChars={[","]}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      styles={{
                        input: {
                          border: form.formState.errors.authDomains
                            ? "1px solid #ff6b6b"
                            : "1px solid #e5e5e5",
                          borderRadius: "3px",
                          color: "#3E4945",
                          height: "46px",
                          minHeight: "46px",
                          display: "flex",
                          alignItems: "center",
                        },
                        wrapper: {
                          height: "46px",
                        },
                        pill: {
                          backgroundColor: "#10B981",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#D96B20",
                          },
                        },
                        pillsList: {
                          gap: "8px",
                        },
                      }}
                    />
                  </FormControl>
                  {Array.isArray(form.formState.errors.authDomains) ? (
                    form.formState.errors.authDomains.map((error) => {
                      return (
                        <div
                          key={error.message}
                          className="text-destructive text-xs font-medium"
                        >
                          {error.message}
                        </div>
                      );
                    })
                  ) : (
                    <FormMessage>
                      {form.formState.errors.authDomains?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="userLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"User Limit"} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={"User Limit"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"Phone"} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={"Phone"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {"Address"} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={"Address"} />
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
                {"Cancel"}
              </Button>
              <Button type="submit" disabled={createLoading || updateLoading}>
                {isEditMode ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </Modal>
    );
  }
);
