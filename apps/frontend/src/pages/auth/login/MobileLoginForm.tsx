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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSetTitle } from "@/stores/title-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  MobileLoginValidationType,
  mobileLoginValidationSchema,
} from "./types";

interface MobileLoginFormProps {
  onSubmit: (data: MobileLoginValidationType) => void;
  isLoading?: boolean;
}

export const MobileLoginForm = ({
  onSubmit,
  isLoading = false,
}: MobileLoginFormProps) => {
  useSetTitle("Login");

  /* ======= define form ====== */
  const form = useForm<MobileLoginValidationType>({
    resolver: zodResolver(mobileLoginValidationSchema()),
    defaultValues: {
      mobileNumber: "",
      authType: undefined,
    },
  });

  /* ====== define submit handler ======== */
  const handleSubmit = async (values: MobileLoginValidationType) => {
    onSubmit(values);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Enter your mobile number to login</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm leading-5">
                  Mobile Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your mobile number"
                    {...field}
                    hasError={!!form.formState.errors.mobileNumber?.message}
                    type="tel"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="authType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={
                        form.formState.errors.authType?.message
                          ? "border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="END_USER">Farmer</SelectItem>
                    <SelectItem value="ADMIN">
                      Service Provider/Trader/Chemist
                    </SelectItem>
                  </SelectContent>
                </Select>
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
            {isLoading ? <ButtonLoader /> : "Send OTP"}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/auth/register"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};
