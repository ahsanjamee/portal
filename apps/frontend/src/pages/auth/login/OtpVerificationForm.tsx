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
import { useEffect } from "react";
import { OtpVerificationType, otpVerificationSchema } from "./types";
import { useOtpTimer } from "./useOtpTimer";

interface OtpVerificationFormProps {
  mobileNumber: string;
  onSubmit: (data: OtpVerificationType) => void;
  onResendOtp: () => void;
  isLoading?: boolean;
  isResending?: boolean;
  onBack: () => void;
  autoStartTimer?: boolean; // Auto start timer when component mounts
}

export const OtpVerificationForm = ({
  mobileNumber,
  onSubmit,
  onResendOtp,
  isLoading = false,
  isResending = false,
  onBack,
  autoStartTimer = true,
}: OtpVerificationFormProps) => {
  useSetTitle("Verify OTP");

  // Initialize OTP timer
  const { timeLeft, isActive, canResend, startTimer, formatTime } =
    useOtpTimer(180); // 3 minutes

  /* ======= define form ====== */
  const form = useForm<OtpVerificationType>({
    resolver: zodResolver(otpVerificationSchema()),
    defaultValues: {
      otp: "",
      mobileNumber: mobileNumber,
    },
  });

  /* ====== Auto start timer on mount ======== */
  useEffect(() => {
    if (autoStartTimer) {
      startTimer();
    }
  }, [autoStartTimer, startTimer]);

  /* ====== define submit handler ======== */
  const handleSubmit = async (values: OtpVerificationType) => {
    onSubmit(values);
  };

  /* ====== handle resend OTP ======== */
  const handleResendOtp = async () => {
    try {
      await onResendOtp();
      // Restart timer after successful resend
      startTimer();
    } catch (error) {
      // Error handling is done in parent component
      renderGenericError(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
        <p className="text-gray-600 mt-2">
          We've sent a verification code to{" "}
          <span className="font-semibold">{mobileNumber}</span>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm leading-5">Enter OTP</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter OTP"
                    {...field}
                    hasError={!!form.formState.errors.otp?.message}
                    type="text"
                    maxLength={6}
                    minLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col space-y-3">
            <Button
              type="submit"
              size="lg"
              variant="default"
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-sm text-[16px] leading-6 h-auto"
            >
              {isLoading ? <ButtonLoader /> : "Verify OTP"}
            </Button>

            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
                className="text-sm"
              >
                ← Back
              </Button>

              <div className="flex flex-col items-end space-y-1">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOtp}
                  disabled={isResending || !canResend}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                >
                  {isResending ? "Sending..." : "Resend OTP"}
                </Button>
                {isActive && (
                  <span className="text-xs text-gray-500">
                    Resend available in {formatTime()}
                  </span>
                )}
                {!isActive && timeLeft === 0 && (
                  <span className="text-xs text-green-600">
                    You can resend OTP now
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
