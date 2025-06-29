import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useGlobalStore } from "@/stores/global.store";
import { MobileLoginForm } from "./MobileLoginForm";
import { OtpVerificationForm } from "./OtpVerificationForm";
import { MobileLoginValidationType, OtpVerificationType } from "./types";
import { loginService } from "@/lib/services/login.service";

type LoginStep = "mobile" | "otp";

interface LoginState {
  mobileNumber: string;
  authType: "END_USER" | "ADMIN";
}

export const AuthMobileLogin = () => {
  const navigate = useNavigate();
  const { store } = useGlobalStore();

  const [currentStep, setCurrentStep] = useState<LoginStep>("mobile");
  const [loginState, setLoginState] = useState<LoginState>({
    mobileNumber: "",
    authType: "END_USER" as const,
  });

  // Initialize service hooks
  const loginMutation = loginService.useLogin();
  const verifyOtpMutation = loginService.useVerifyOtp();
  const sendOtpMutation = loginService.useSendOtp();

  const handleMobileLogin = async (data: MobileLoginValidationType) => {
    try {
      const response = await loginMutation.mutateAsync({
        mobileNumber: data.mobileNumber,
        authType: data.authType,
      });

      setLoginState({
        mobileNumber: data.mobileNumber,
        authType: data.authType,
      });

      setCurrentStep("otp");

      notifications.show({
        message:
          response.message || `OTP sent successfully to ${data.mobileNumber}`,
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        message: error?.message || "Failed to send OTP. Please try again.",
        color: "red",
      });
    }
  };

  const handleOtpVerification = async (data: OtpVerificationType) => {
    try {
      const response = await verifyOtpMutation.mutateAsync({
        mobileNumber: data.mobileNumber,
        otp: data.otp,
      });

      // Store user data from API response
      const authResponse = {
        authType:
          response.authType === "ADMIN"
            ? ("ADMIN" as const)
            : ("END_USER" as const),
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        email: response.email || "",
        mobileNumber: response.mobileNumber || "",
        profile: response.profile || undefined,
      };

      store.onLogin(authResponse);

      notifications.show({
        message: response.message || "Login successful!",
        color: "green",
      });

      // Navigate based on user type
      if (response.authType === "END_USER") {
        navigate("/user/profile");
      } else {
        navigate("/admin/profile");
      }
    } catch (error: any) {
      notifications.show({
        message: error?.message || "Invalid OTP. Please try again.",
        color: "red",
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await sendOtpMutation.mutateAsync({
        mobileNumber: loginState.mobileNumber,
      });

      notifications.show({
        message:
          response.message ||
          `OTP resent successfully to ${loginState.mobileNumber}`,
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        message: error?.message || "Failed to resend OTP. Please try again.",
        color: "red",
      });
      // Re-throw error so OtpVerificationForm doesn't restart timer on failure
      throw error;
    }
  };

  const handleBack = () => {
    setCurrentStep("mobile");
  };

  return (
    <div>
      {currentStep === "mobile" && (
        <MobileLoginForm
          onSubmit={handleMobileLogin}
          isLoading={loginMutation.isPending}
        />
      )}

      {currentStep === "otp" && (
        <OtpVerificationForm
          mobileNumber={loginState.mobileNumber}
          onSubmit={handleOtpVerification}
          onResendOtp={handleResendOtp}
          isLoading={verifyOtpMutation.isPending}
          isResending={sendOtpMutation.isPending}
          onBack={handleBack}
          autoStartTimer={true}
        />
      )}
    </div>
  );
};
