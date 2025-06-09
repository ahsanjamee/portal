import { AuthLayout } from "../layout/AuthLayout";
import { LoginForm } from "./LoginForm";

export const AuthLogin = () => {
  return (
    <AuthLayout>
      <div className="text-center mb-9 sm:medium-2xl-700 text-xl font-semibold">
        Login
      </div>
      <LoginForm />
    </AuthLayout>
  );
};
