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
import { useSetTitle } from "@/stores/title-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PhoneVerificationType, phoneVerificationSchema } from "../login/types";

interface PhoneVerificationFormProps {
  onSubmit: (data: PhoneVerificationType) => void;
  isLoading?: boolean;
}

export const PhoneVerificationForm = ({
  onSubmit,
  isLoading = false,
}: PhoneVerificationFormProps) => {
  useSetTitle("Register - Verify Phone");

  /* ======= define form ====== */
  const form = useForm<PhoneVerificationType>({
    resolver: zodResolver(phoneVerificationSchema()),
    defaultValues: {
      mobileNumber: "",
    },
  });

  /* ====== define submit handler ======== */
  const handleSubmit = async (values: PhoneVerificationType) => {
    onSubmit(values);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 mt-2">
          First, let's verify your mobile number
        </p>
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

          <Button
            type="submit"
            size="lg"
            variant="default"
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-sm text-[16px] leading-6 h-auto"
          >
            {isLoading ? <ButtonLoader /> : "Send Verification Code"}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};
