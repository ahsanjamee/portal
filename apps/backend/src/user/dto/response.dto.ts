import { tags } from "typia";
import { AuthType, EndUserType, AdminUserType } from "./create-user.dto";

// Base user response
export interface UserResponseDto {
    id: string;
    authType: AuthType;
    mobileNumber?: string;
    email?: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string & tags.Format<"date-time">;
    updatedAt: string & tags.Format<"date-time">;
}

// End user profile response
export interface EndUserProfileResponseDto {
    id: string;
    userType: EndUserType;
    name: string;
    address: string;
    farmData: object; // JSON data
}

// Admin user profile response
export interface AdminUserProfileResponseDto {
    id: string;
    userType: AdminUserType;
    name: string;
    address: string;
    photo?: string;
    lastDegree: string;
    areaOfExpertise: string;
    serviceExperience: number;
    jobPosition?: string;
}

// Registration response
export interface RegistrationResponseDto {
    id: string;
    authType: AuthType;
    mobileNumber?: string;
    email?: string;
    profile?: EndUserProfileResponseDto | AdminUserProfileResponseDto;
}

// Login response
export interface LoginResponseDto {
    id: string;
    authType: AuthType;
    mobileNumber?: string;
    email?: string;
    isVerified: boolean;
    profile?: EndUserProfileResponseDto | AdminUserProfileResponseDto;
}

// OTP response
export interface OTPResponseDto {
    message: string;
    mobileNumber: string;
}

// User with profile response
export interface UserWithProfileResponseDto extends UserResponseDto {
    profile?: EndUserProfileResponseDto | AdminUserProfileResponseDto;
} 