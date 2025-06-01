import { tags } from "typia";
import { EndUserType, AdminUserType } from "@prisma/client";

export enum AuthType {
    END_USER = "END_USER",
    ADMIN = "ADMIN"
}
// Super Admin Login DTO
export interface SuperAdminLoginDto {
    email: string & tags.Format<"email">;
    password: string & tags.MinLength<1>;
}

// Simple Login DTO - just takes mobile number and auth type
export interface LoginDto {
    mobileNumber: string;
    authType: AuthType.END_USER | AuthType.ADMIN;
}

// Simple OTP Verification DTO
export interface VerifyOtpDto {
    mobileNumber: string;
    otp: string;
}

// Send OTP DTO
export interface SendOtpDto {
    mobileNumber: string;
}

// Refresh Token DTO
export interface RefreshTokenDto {
    refreshToken: string;
}

// Logout DTO
export interface LogoutDto {
    refreshToken: string;
}

// Legacy DTOs (keeping for backward compatibility if needed)
export interface OTPLoginDto {
    authType: AuthType.END_USER | AuthType.ADMIN;
    userType: EndUserType | AdminUserType;
    mobileNumber: string;
    otp: string;
}

export interface SendOTPDto {
    authType: AuthType.END_USER | AuthType.ADMIN;
    userType: EndUserType | AdminUserType;
    mobileNumber: string;
}

export interface VerifyOTPDto {
    authType: AuthType.END_USER | AuthType.ADMIN;
    userType: EndUserType | AdminUserType;
    mobileNumber: string;
    otp: string;
} 