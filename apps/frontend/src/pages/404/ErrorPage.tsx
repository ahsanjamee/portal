import { Error404Graphic, MainLogo } from "@/components/icons/AllIcons";
import { Button } from "@/components/ui/button";
import { useNavigate, useRouteError } from "react-router-dom";

export type ErrorPageProps = {
  title?: string;
  image?: React.ReactNode;
  message?: string;
  buttonText?: React.ReactNode;
  buttonHandler?: () => void;
};
const ErrorPage = ({ buttonHandler, buttonText, title }: ErrorPageProps) => {
  const error = useRouteError() as any;
  const navigate = useNavigate();
  console.error(error, window.location);

  return (
    <div
      id="error-page"
      className="h-screen w-screen flex flex-col items-center bg-[#F2F4F5]"
    >
      <div className="h-max">
        <div className="mt-10 flex justify-center">
          <MainLogo />
        </div>
        <div className="w-[460px] mt-10 p-10 mb-5 flex flex-col items-center gap-3">
          <div className="medium-2xl-700 text-center">
            {title || error?.statusText || "Something went wrong"}
          </div>
          <div className="normal-xs-400 text-center">
            {error?.message ||
              "Sorry, the page you're looking for doesn't exist. If you think something is broken, report a problem."}
          </div>
          <Button
            size="lg"
            onClick={() => {
              if (buttonHandler) {
                buttonHandler();
              } else {
                navigate("/login");
              }
            }}
          >
            {buttonText || error?.buttonText || "Login"}
          </Button>
        </div>
      </div>

      <div>{error?.image || <Error404Graphic />}</div>
    </div>
  );
};

export default ErrorPage;
