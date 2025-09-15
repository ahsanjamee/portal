import { tags } from "typia";
import { EndUserType, AdminUserType, PoultryFarmType } from "@prisma/client";

// Farm data interfaces for updating different farmer types
export interface UpdateDairyFarmDataDto {
    totalCattlePopulation?: number & tags.Minimum<0>;
    totalMilkingCow?: number & tags.Minimum<0>;
    totalMilkProductionPerDay?: number & tags.Minimum<0>; // Ltrs/Day
    totalCalf?: number & tags.Minimum<0>;
    totalFemaleCalf?: number & tags.Minimum<0>;
    totalMaleCalf?: number & tags.Minimum<0>;
}

export interface UpdatePoultryFarmDataDto {
    farmType?: PoultryFarmType;
    totalBird?: number & tags.Minimum<0>;
    totalEggProductionPerDay?: number & tags.Minimum<0>; // Pcs/Day
}

export interface UpdateFishFarmDataDto {
    totalPondAreaDecimal?: number & tags.Minimum<0>;
    fishType?: string & tags.MinLength<1>;
}

export interface UpdateAgricultureFarmDataDto {
    totalAgricultureLandDecimal?: number & tags.Minimum<0>;
    typeOfAgriculture?: string & tags.MinLength<1>;
}

export interface UpdatePetOwnerDataDto {
    petBird?: string & tags.MinLength<1>;
    petAnimal?: string & tags.MinLength<1>;
}

// End User Profile Update DTO
export interface UpdateEndUserProfileDto {
    userType?: EndUserType;
    name?: string & tags.MinLength<1>;
    address?: string & tags.MinLength<1>;
    email?: string & tags.Format<"email">;
    photo?: string;
    farmData?: UpdateDairyFarmDataDto | UpdatePoultryFarmDataDto | UpdateFishFarmDataDto | UpdateAgricultureFarmDataDto | UpdatePetOwnerDataDto;
}

// Admin User Profile Update DTO
export interface UpdateAdminUserProfileDto {
    userType?: AdminUserType;
    name?: string & tags.MinLength<1>;
    address?: string & tags.MinLength<1>;
    lastDegree?: string & tags.MinLength<1>;
    areaOfExpertise?: string & tags.MinLength<1>;
    serviceExperience?: number & tags.Minimum<0>;
    jobPosition?: string; // Only for service provider
    email?: string & tags.Format<"email">;
    photo?: string;
}

// Profile Image Update DTO
export interface UpdateProfileImageDto {
    photo: string; // Base64 encoded image or file path
}

// Combined profile update response
export interface ProfileUpdateResponseDto {
    message: string;
    user: {
        id: string;
        authType: string;
        mobileNumber?: string;
        email?: string;
        isVerified: boolean;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    };
    profile: any; // Will be EndUserProfileResponseDto | AdminUserProfileResponseDto
} 