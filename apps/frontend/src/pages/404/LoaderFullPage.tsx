import { Loader } from "@mantine/core";

const LoaderFullPage = () => {
  return (
    <div className="w-full h-[60vh] grid place-items-center">
      <Loader size="xl" color="#10B981" />
    </div>
  );
};

export default LoaderFullPage;
