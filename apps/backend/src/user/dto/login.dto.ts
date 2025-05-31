import { tags } from "typia";
import { AuthType, EndUserType, AdminUserType } from "./create-user.dto";

// Super Admin Login DTO
export interface SuperAdminLoginDto {
    email: string & tags.Format<"email">;
    password: string & tags.MinLength<1>;
}

// Simple Login DTO - just takes mobile number and auth type
export interface LoginDto {
    mobileNumber: string & tags.Pattern<"^[0-9+\\-\\s()]+$">;
    authType: AuthType.END_USER | AuthType.ADMIN;
}

// Simple OTP Verification DTO
export interface VerifyOtpDto {
    mobileNumber: string & tags.Pattern<"^[0-9+\\-\\s()]+$">;
    otp: string & tags.Pattern<"^[0-9]{4,6}$">;
}

// Resend OTP DTO
export interface ResendOtpDto {
    mobileNumber: string & tags.Pattern<"^[0-9+\\-\\s()]+$">;
}

// Legacy DTOs (keeping for backward compatibility if needed)
export interface OTPLoginDto {
    authType: AuthType.END_USER | AuthType.ADMIN;
    userType: EndUserType | AdminUserType;
    mobileNumber: string & tags.Pattern<"^[0-9+\\-\\s()]+$">;
    otp: string & tags.Pattern<"^[0-9]{4,6}$">;
}

export interface SendOTPDto {
    authType: AuthType.END_USER | AuthType.ADMIN;
    userType: EndUserType | AdminUserType;
    mobileNumber: string & tags.Pattern<"^[0-9+\\-\\s()]+$">;
}

export interface VerifyOTPDto {
    authType: AuthType.END_USER | AuthType.ADMIN;
    userType: EndUserType | AdminUserType;
    mobileNumber: string & tags.Pattern<"^[0-9+\\-\\s()]+$">;
    otp: string & tags.Pattern<"^[0-9]{4,6}$">;
} 