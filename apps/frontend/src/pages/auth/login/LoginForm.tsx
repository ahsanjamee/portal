import { ButtonLoader } from "@/components/Loader/ButtonLoader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/password-input";
import { authService } from "@/lib/services/auth.service";
import { useGlobalStore } from "@/stores/global.store";
import { useSetTitle } from "@/stores/title-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LoginValidationType, loginValidationSchema } from "./types";

export const LoginForm = () => {
  /* ==== components states ======= */
  const navigate = useNavigate();
  const { store } = useGlobalStore();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useSetTitle("Login");

  /* =====login api call ======= */
  const { mutateAsync, isPending: isLoading } = authService.useLogin({
    onSuccess() {
      notifications.show({
        message: "Logged in successfully",
        color: "green",
      });
    },
    onError(error) {
      if (error?.message?.includes("Password")) {
        form.setError("password", {
          type: "server",
          message: error?.message,
        });
        return;
      }
      form.setError("email", {
        type: "server",
        message: error?.message,
      });
    },
  });

  /* ======= define form ====== */
  const form = useForm<LoginValidationType>({
    resolver: zodResolver(loginValidationSchema()),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* ====== define submit handler ======== */
  const onSubmit = async (values: LoginValidationType) => {
    const data = {
      email: values.email,
      password: values.password,
    };

    const response = await mutateAsync(data);
    store.onLogin(response);

    console.log(response);

    if (response?.authType === "SUPER_ADMIN") {
      navigate(`/super-admin/profile`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm leading-5">Email address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  {...field}
                  hasError={!!form.formState.errors.email?.message}
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <InputPassword
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  {...field}
                  setShowPassword={() => setShowPassword(!showPassword)}
                  showPassword={showPassword}
                  hasError={!!form.formState.errors.password?.message}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          variant="default"
          disabled={isLoading}
          className="w-full px-6 py-3 rounded-sm text-[16px] leading-6 h-auto"
        >
          {isLoading ? <ButtonLoader /> : "Login"}
        </Button>
      </form>
    </Form>
  );
};
