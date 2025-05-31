import { tags } from "typia";

// Enums (manually defined to match Prisma schema)
export enum AuthType {
    END_USER = "END_USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}

export enum EndUserType {
    DAIRY_FARMER = "DAIRY_FARMER",
    POULTRY_FARMER = "POULTRY_FARMER",
    FISH_FARMER = "FISH_FARMER",
    AGRICULTURE_FARMER = "AGRICULTURE_FARMER"
}

export enum AdminUserType {
    SERVICE_PROVIDER = "SERVICE_PROVIDER",
    TRADER_CHEMIST = "TRADER_CHEMIST"
}

export enum PoultryFarmType {
    LAYER = "LAYER",
    BROILER = "BROILER"
}

// Base DTO for common fields
export interface CreateUserDto {
    authType: AuthType;
    mobileNumber?: string & tags.Pattern<"^[0-9+\\-\\s()]+$">;
    email?: string & tags.Format<"email">;
    password?: string & tags.MinLength<6>;
}

// Farm data interfaces for different farmer types
export interface DairyFarmDataDto {
    totalCattlePopulation: number & tags.Type<"uint32"> & tags.Minimum<0>;
    totalMilkingCow: number & tags.Type<"uint32"> & tags.Minimum<0>;
    totalMilkProductionPerDay: number & tags.Minimum<0>; // Ltrs/Day
    totalCalf: number & tags.Type<"uint32"> & tags.Minimum<0>;
    totalFemaleCalf: number & tags.Type<"uint32"> & tags.Minimum<0>;
    totalMaleCalf: number & tags.Type<"uint32"> & tags.Minimum<0>;
}

export interface PoultryFarmDataDto {
    farmType: PoultryFarmType;
    totalBird: number & tags.Type<"uint32"> & tags.Minimum<0>;
    totalEggProductionPerDay: number & tags.Type<"uint32"> & tags.Minimum<0>; // Pcs/Day
}

export interface FishFarmDataDto {
    totalPondAreaDecimal: number & tags.Minimum<0>;
    fishType: string & tags.MinLength<1>;
}

export interface AgricultureFarmDataDto {
    totalAgricultureLandDecimal: number & tags.Minimum<0>;
    typeOfAgriculture: string & tags.MinLength<1>;
}

// End User Registration DTO
export interface CreateEndUserDto extends CreateUserDto {
    userType: EndUserType;
    name: string & tags.MinLength<1>;
    address: string & tags.MinLength<1>;
    farmData: DairyFarmDataDto | PoultryFarmDataDto | FishFarmDataDto | AgricultureFarmDataDto;
}

// Admin User Registration DTO
export interface CreateAdminUserDto extends CreateUserDto {
    userType: AdminUserType;
    name: string & tags.MinLength<1>;
    address: string & tags.MinLength<1>;
    photo?: string;
    lastDegree: string & tags.MinLength<1>;
    areaOfExpertise: string & tags.MinLength<1>;
    serviceExperience: number & tags.Type<"uint32"> & tags.Minimum<0>;
    jobPosition?: string; // Only for service provider
}

// Super Admin Registration DTO
export interface CreateSuperAdminDto {
    email: string & tags.Format<"email">;
    password: string & tags.MinLength<8>;
} 