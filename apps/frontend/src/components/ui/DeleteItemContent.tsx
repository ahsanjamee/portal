import { Box, Stack, Text } from "@mantine/core";
import { ButtonLoader } from "../Loader/ButtonLoader";
import { Button } from "../ui/button";
type IProps = {
  closeModal: () => void;
  mutateFn: any;
  isLoading: boolean;
};

export const DeleteItemContent: React.FC<IProps> = ({
  closeModal,
  mutateFn,
  isLoading,
}) => {
  return (
    <Stack>
      <Text size="sm" className="text-gray-400">
        Are you sure you want to delete? This action cannot be undone.
      </Text>
      <Box className="flex gap-4 w-full mt-4">
        <Button
          className="w-full"
          onClick={() => {
            closeModal?.();
          }}
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className="w-full"
          onClick={() => mutateFn()}
          variant="destructive"
          disabled={isLoading}
        >
          {isLoading ? <ButtonLoader /> : "Delete"}
        </Button>
      </Box>
    </Stack>
  );
};
