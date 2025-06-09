import { Group, Stack, Text } from "@mantine/core";

type UserInfoCardProps = {
  name: string;
};

export const UserInfoCard = ({ name }: UserInfoCardProps) => {
  return (
    <Group className={`w-[230px]`} gap={12} justify="flex-end">
      <Stack gap={0} justify="end">
        <Text
          fz={14}
          fw={500}
          className="truncate w-40 text-[#1D2823] text-end"
        >
          {name}
        </Text>
      </Stack>
    </Group>
  );
};
