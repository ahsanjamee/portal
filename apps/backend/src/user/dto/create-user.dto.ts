import { tags } from "typia";
import { AuthType, EndUserType, AdminUserType, PoultryFarmType } from "@prisma/client";

// Base DTO for common fields
export interface CreateUserDto {
    authType: AuthType;
    mobileNumber: string;
}

// Farm data interfaces for different farmer types
export interface DairyFarmDataDto {
    totalCattlePopulation: number & tags.Minimum<0>;
    totalMilkingCow: number & tags.Minimum<0>;
    totalMilkProductionPerDay: number & tags.Minimum<0>; // Ltrs/Day
    totalCalf: number & tags.Minimum<0>;
    totalFemaleCalf: number & tags.Minimum<0>;
    totalMaleCalf: number & tags.Minimum<0>;
}

export interface PoultryFarmDataDto {
    farmType: PoultryFarmType;
    totalBird: number & tags.Minimum<0>;
    totalEggProductionPerDay: number & tags.Minimum<0>; // Pcs/Day
}

export interface FishFarmDataDto {
    totalPondAreaDecimal: number & tags.Minimum<0>;
    fishType: string & tags.MinLength<1>;
}

export interface AgricultureFarmDataDto {
    totalAgricultureLandDecimal: number & tags.Minimum<0>;
    typeOfAgriculture: string & tags.MinLength<1>;
}

// Pet Owner data (kept flexible for now)
export interface PetOwnerDataDto {
    petBird?: string & tags.MinLength<1>;
    petAnimal?: string & tags.MinLength<1>;
}

// End User Registration DTO
export interface CreateEndUserDto extends CreateUserDto {
    userType: EndUserType;
    name: string & tags.MinLength<1>;
    address: string & tags.MinLength<1>;
    farmData: DairyFarmDataDto | PoultryFarmDataDto | FishFarmDataDto | AgricultureFarmDataDto | PetOwnerDataDto;
}

// Admin User Registration DTO
export interface CreateAdminUserDto extends CreateUserDto {
    userType: AdminUserType;
    name: string & tags.MinLength<1>;
    address: string & tags.MinLength<1>;
    photo?: string;
    lastDegree: string & tags.MinLength<1>;
    areaOfExpertise: string & tags.MinLength<1>;
    serviceExperience: number & tags.Minimum<0>;
    jobPosition?: string; // Only for service provider
}

// Super Admin Registration DTO
export interface CreateSuperAdminDto {
    email: string & tags.Format<"email">;
    password: string & tags.MinLength<8>;
} 