import { Stack, Tabs, Text } from "@mantine/core";

export const ProfileAdminIndex = () => {
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
          <div>admin</div>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
