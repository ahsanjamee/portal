import { Error404Graphic, MainLogo } from "@/components/icons/AllIcons";
import { Button } from "@/components/ui/button";
import { FallbackProps } from "react-error-boundary";

const ErrorBoundaryPage = ({ error, resetErrorBoundary }: FallbackProps) => {
  // useEffect(() => {
  //     // If there's an error, reload the page after a short delay
  //     if (error?.message) {
  //         const timer = setTimeout(() => {
  //             window.location.reload();
  //         }, 1000); // 2 second delay to show error message

  //         return () => clearTimeout(timer);
  //     }

  //     // Return a no-op cleanup function if there's no error
  //     return () => {};
  // }, [error]);

  return (
    <div
      id="error-page"
      className="h-[100vh] w-full flex flex-col items-center bg-[#F2F4F5]"
    >
      <div className="h-max">
        <div className="mt-10 flex justify-center">
          <MainLogo />
        </div>
        <div className="w-[460px] mt-10 p-10 mb-5 flex flex-col items-center gap-3">
          <div className="medium-2xl-700 text-center">Something went wrong</div>
          <div className="normal-xs-400 text-center">{error?.message}</div>
          <div className="flex gap-2">
            <Button
              size="lg"
              onClick={() => {
                resetErrorBoundary();
              }}
            >
              Reload
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Error404Graphic />
      </div>
    </div>
  );
};
export default ErrorBoundaryPage;
