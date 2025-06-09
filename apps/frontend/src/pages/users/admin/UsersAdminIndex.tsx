import { Button } from "@/components/ui/button";
import { useSetTitle } from "@/stores/title-context";
import NiceModal from "@ebay/nice-modal-react";
import { Group, Loader, Stack, Tabs, Text } from "@mantine/core";
import { Export, Plus } from "@phosphor-icons/react";
import { useState } from "react";
import { InviteAdminModal } from "./components/InviteAdminModal";
import { UsersTable } from "./components/UsersTable";
import { adminUsersService } from "./services/admin-users.service";

type TabValue = "appUsers" | "companyUsers";

export const UsersAdminIndex = () => {
  useSetTitle("Users");
  const [activeTab, setActiveTab] = useState<TabValue>("appUsers");
  const { mutate: exportAdminUsers, isPending: isExporting } =
    adminUsersService.useExportAdminUsers();

  const handleExport = () => {
    exportAdminUsers(
      { panelType: activeTab === "appUsers" ? "USER" : "ADMIN" },
      {
        onSuccess: (res) => {
          try {
            // Create a blob from the response
            const blob = new Blob([res], {
              type: "application/vnd.ms-excel",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
              "download",
              `${activeTab === "appUsers" ? "app" : "company"}_users.xlsx`
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error("Error downloading file:", error);
          }
        },
        onError: (error) => {
          console.error("Export failed:", error);
        },
      }
    );
  };

  return (
    <Stack gap={0}>
      <Group justify="space-between" mb={20}>
        <Stack gap={0}>
          <Text fz={"32px"} fw={600} c={"#062E26"}>
            Users
          </Text>
          <Text c={"#3E4945"} fz={"14px"} fw={500}>
            Manage the users on your site
          </Text>
        </Stack>

        <Group>
          <Button variant={"outline"} onClick={() => handleExport()}>
            {isExporting ? (
              <Loader className="ml-2" color="#10B981" size={20} />
            ) : (
              <>
                Export
                <Export className="ml-2" size={20} />{" "}
              </>
            )}
          </Button>

          {activeTab !== "appUsers" && (
            <Button
              variant={"default"}
              onClick={() => NiceModal.show(InviteAdminModal)}
            >
              {isExporting ? (
                <Loader className="ml-2" size={20} />
              ) : (
                <>
                  Invite
                  <Plus className="ml-2" size={20} />{" "}
                </>
              )}
            </Button>
          )}
        </Group>
      </Group>

      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value as TabValue)}
      >
        <Tabs.List>
          <Tabs.Tab value="appUsers">App users</Tabs.Tab>
          <Tabs.Tab value="companyUsers">Company users</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="appUsers" pt="xl">
          <UsersTable authPanel="USER" />
        </Tabs.Panel>

        <Tabs.Panel value="companyUsers" pt="xl">
          <UsersTable authPanel="ADMIN" />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
