import { MobileAuthLayout } from "./layout/MobileAuthLayout";
import { AuthMobileLogin } from "./login/AuthMobileLogin";

export const AuthMobileLoginPage = () => {
  return (
    <MobileAuthLayout>
      <AuthMobileLogin />
    </MobileAuthLayout>
  );
};
