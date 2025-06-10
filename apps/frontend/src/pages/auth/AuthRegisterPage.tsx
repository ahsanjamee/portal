import { MobileAuthLayout } from "./layout/MobileAuthLayout";
import { AuthRegister } from "./register/AuthRegister";

export const AuthRegisterPage = () => {
  return (
    <MobileAuthLayout>
      <AuthRegister />
    </MobileAuthLayout>
  );
};
