import { useGlobalStoreSelector } from "@/stores/global.store";
import { Stack, Tabs, Text } from "@mantine/core";

export const ProfileSuperAdminIndex = () => {
  const store = useGlobalStoreSelector((s) => s);

  console.log(store);
  return (
    <Stack gap={25}>
      <Stack gap={0}>
        <Text fz={"32px"} fw={600} c={"#062E26"}>
          My profile
        </Text>
      </Stack>

      <Tabs defaultValue="profile">
        <Tabs.List>
          <Tabs.Tab value="profile">Profile</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile" pt="xl">
          <div>super admin</div>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
