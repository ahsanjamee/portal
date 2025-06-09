import { UserInfoCard } from "@/components/UserInfoCard/UserInfoCard";
import { useGlobalStoreSelector } from "@/stores/global.store";
import { Group } from "@mantine/core";

export const PrimaryTopbar = () => {
  const user = useGlobalStoreSelector((s) => s);
  const isSuperAdmin = user?.authType === "SUPER_ADMIN";
  return (
    <Group gap={"lg"} justify="space-between" className="w-full px-6">
      <h1 className="text-2xl font-bold">ADI</h1>
      <UserInfoCard
        name={isSuperAdmin ? "Super Admin" : user?.profile?.name || ""}
      />
    </Group>
  );
};
