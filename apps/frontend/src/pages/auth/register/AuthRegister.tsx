import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useGlobalStore } from "@/stores/global.store";
import { PhoneVerificationForm } from "./PhoneVerificationForm";
import { OtpVerificationForm } from "../login/OtpVerificationForm";
import { UserTypeSelectionForm } from "./UserTypeSelectionForm";
import { EndUserRegistrationForm } from "./EndUserRegistrationForm";
import { AdminUserRegistrationForm } from "./AdminUserRegistrationForm";
import {
  PhoneVerificationType,
  OtpVerificationType,
  UserTypeSelectionType,
  EndUserRegistrationType,
  AdminUserRegistrationType,
} from "../login/types";
import { registrationService } from "@/lib/services/registration.service";
import { loginService } from "@/lib/services/login.service";

type RegistrationStep =
  | "phone"
  | "phone-otp"
  | "user-type"
  | "end-user-form"
  | "admin-form";

interface RegistrationState {
  mobileNumber: string;
  userType: "END_USER" | "ADMIN" | null;
}

export const AuthRegister = () => {
  const navigate = useNavigate();
  const { store } = useGlobalStore();

  const [currentStep, setCurrentStep] = useState<RegistrationStep>("phone");
  const [registrationState, setRegistrationState] = useState<RegistrationState>(
    {
      mobileNumber: "",
      userType: null,
    }
  );

  // Initialize service hooks
  const sendOtpMutation = loginService.useSendOtp();
  const verifyMobileMutation =
    registrationService.useVerifyMobileRegistration();
  const registerEndUserMutation = registrationService.useRegisterEndUser();
  const registerAdminMutation = registrationService.useRegisterAdmin();

  // Handle phone verification
  const handlePhoneVerification = async (data: PhoneVerificationType) => {
    try {
      const response = await sendOtpMutation.mutateAsync({
        mobileNumber: data.mobileNumber,
      });

      setRegistrationState({
        ...registrationState,
        mobileNumber: data.mobileNumber,
      });

      setCurrentStep("phone-otp");

      notifications.show({
        message:
          response.message || `Verification code sent to ${data.mobileNumber}`,
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        message:
          error?.message ||
          "Failed to send verification code. Please try again.",
        color: "red",
      });
    }
  };

  // Handle OTP verification for registration
  const handleOtpVerification = async (data: OtpVerificationType) => {
    try {
      const response = await verifyMobileMutation.mutateAsync({
        mobileNumber: data.mobileNumber,
        otp: data.otp,
      });

      setCurrentStep("user-type");

      notifications.show({
        message: response.message || "Mobile number verified successfully!",
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        message:
          error?.message || "Invalid verification code. Please try again.",
        color: "red",
      });
    }
  };

  // Handle user type selection
  const handleUserTypeSelection = async (data: UserTypeSelectionType) => {
    setRegistrationState({
      ...registrationState,
      userType: data.userType,
    });

    if (data.userType === "END_USER") {
      setCurrentStep("end-user-form");
    } else {
      setCurrentStep("admin-form");
    }
  };

  // Handle end user registration
  const handleEndUserRegistration = async (data: EndUserRegistrationType) => {
    try {
      const response = await registerEndUserMutation.mutateAsync({
        authType: "END_USER",
        mobileNumber: data.mobileNumber,
        userType: data.userType,
        name: data.name,
        address: data.address,
        farmData: (data.farmData || {}) as any, // TODO: Fix farm data type mapping
      });

      // Store user data from API response
      const authResponse = {
        authType: "END_USER" as const,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        email: response.email || "",
        mobileNumber: response.mobileNumber as string,
        profile: response.profile || undefined,
      };

      store.onLogin(authResponse);

      notifications.show({
        message: response.message || "Account created successfully!",
        color: "green",
      });

      navigate("/user/profile");
    } catch (error: any) {
      notifications.show({
        message:
          error?.message || "Failed to create account. Please try again.",
        color: "red",
      });
    }
  };

  // Handle admin user registration
  const handleAdminUserRegistration = async (
    data: AdminUserRegistrationType
  ) => {
    try {
      const response = await registerAdminMutation.mutateAsync({
        authType: "ADMIN",
        mobileNumber: data.mobileNumber,
        userType: data.userType,
        name: data.name,
        address: data.address,
        photo: data.photo,
        lastDegree: data.lastDegree,
        areaOfExpertise: data.areaOfExpertise,
        serviceExperience: data.serviceExperience,
        jobPosition: data.jobPosition,
      });

      // Store user data from API response
      const authResponse = {
        authType: "ADMIN" as const,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        email: response.email || "",
        mobileNumber: response.mobileNumber as string,
        profile: response.profile || undefined,
      };

      store.onLogin(authResponse);

      notifications.show({
        message:
          response.message || "Professional account created successfully!",
        color: "green",
      });

      navigate("/admin/profile");
    } catch (error: any) {
      notifications.show({
        message:
          error?.message || "Failed to create account. Please try again.",
        color: "red",
      });
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    try {
      const response = await sendOtpMutation.mutateAsync({
        mobileNumber: registrationState.mobileNumber,
      });

      notifications.show({
        message:
          response.message ||
          `Verification code resent to ${registrationState.mobileNumber}`,
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        message:
          error?.message ||
          "Failed to resend verification code. Please try again.",
        color: "red",
      });
      // Re-throw error so OtpVerificationForm doesn't restart timer on failure
      throw error;
    }
  };

  // Navigation handlers
  const handleBackToPhone = () => {
    setCurrentStep("phone");
  };

  const handleBackToUserType = () => {
    setCurrentStep("user-type");
  };

  return (
    <div className="w-full">
      {currentStep === "phone" && (
        <PhoneVerificationForm
          onSubmit={handlePhoneVerification}
          isLoading={sendOtpMutation.isPending}
        />
      )}

      {currentStep === "phone-otp" && (
        <OtpVerificationForm
          mobileNumber={registrationState.mobileNumber}
          onSubmit={handleOtpVerification}
          onResendOtp={handleResendOtp}
          isLoading={verifyMobileMutation.isPending}
          isResending={sendOtpMutation.isPending}
          onBack={handleBackToPhone}
        />
      )}

      {currentStep === "user-type" && (
        <UserTypeSelectionForm
          mobileNumber={registrationState.mobileNumber}
          onSubmit={handleUserTypeSelection}
          onBack={handleBackToPhone}
          isLoading={false}
        />
      )}

      {currentStep === "end-user-form" && (
        <EndUserRegistrationForm
          mobileNumber={registrationState.mobileNumber}
          onSubmit={handleEndUserRegistration}
          onBack={handleBackToUserType}
          isLoading={registerEndUserMutation.isPending}
        />
      )}

      {currentStep === "admin-form" && (
        <AdminUserRegistrationForm
          mobileNumber={registrationState.mobileNumber}
          onSubmit={handleAdminUserRegistration}
          onBack={handleBackToUserType}
          isLoading={registerAdminMutation.isPending}
        />
      )}
    </div>
  );
};
