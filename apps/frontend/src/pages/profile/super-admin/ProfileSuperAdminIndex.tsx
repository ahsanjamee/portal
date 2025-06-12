import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
          <div className="calc(100vh - 100px) p-4">
            <div className="max-w-4xl mx-auto">
              <Card className="w-full">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-800 mb-6">
                    Super Admin Profile
                  </CardTitle>

                  {/* Photo Section */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg mb-6">
                        <img
                          src="/avatar.svg"
                          alt="Default Avatar"
                          className="w-full h-full object-cover bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
