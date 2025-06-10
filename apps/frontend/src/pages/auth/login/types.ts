/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';

// Super Admin Login (existing)
export const loginValidationSchema = () =>
	z.object({
		email: z
			.string()
			.min(1, { message: 'Email is required' })
			.email({ message: 'Must be a valid email' }),
		password: z
			.string()
			.trim()
			.min(8, { message: 'Password must be min 8 characters' }),
	});

export type LoginValidationType = z.infer<ReturnType<typeof loginValidationSchema>>;

// Mobile Login Schema (using LoginDto structure)
export const mobileLoginValidationSchema = () =>
	z.object({
		mobileNumber: z
			.string()
			.min(1, { message: 'Mobile number is required' })
			.regex(/^01\d{9}$/, { message: 'Please enter a valid mobile number (11 digits starting with 01)' }),
		authType: z.enum(['END_USER', 'ADMIN'], { message: 'Please select user type' }),
	});

export type MobileLoginValidationType = z.infer<ReturnType<typeof mobileLoginValidationSchema>>;

// OTP Verification Schema (using VerifyOtpDto structure)
export const otpVerificationSchema = () =>
	z.object({
		otp: z
			.string()
			.min(4, { message: 'OTP must be at least 4 digits' })
			.max(6, { message: 'OTP must be at most 6 digits' }),
		mobileNumber: z.string().min(1, { message: 'Mobile number is required' }),
	});

export type OtpVerificationType = z.infer<ReturnType<typeof otpVerificationSchema>>;

// Phone Verification Schema (using SendOtpDto structure)
export const phoneVerificationSchema = () =>
	z.object({
		mobileNumber: z
			.string()
			.min(1, { message: 'Mobile number is required' })
			.regex(/^01\d{9}$/, { message: 'Please enter a valid mobile number (11 digits starting with 01)' }),
	});

export type PhoneVerificationType = z.infer<ReturnType<typeof phoneVerificationSchema>>;

// User Type Selection Schema
export const userTypeSelectionSchema = () =>
	z.object({
		userType: z.enum(['END_USER', 'ADMIN'], { message: 'Please select user type' }),
	});

export type UserTypeSelectionType = z.infer<ReturnType<typeof userTypeSelectionSchema>>;

// Farm Data Schemas based on user type
const agricultureFarmDataSchema = z.object({
	totalAgricultureLandDecimal: z.number().min(0, { message: 'Land area must be non-negative' }),
	typeOfAgriculture: z.string().min(1, { message: 'Agriculture type is required' }),
});

const dairyFarmDataSchema = z.object({
	totalCattlePopulation: z.number().min(0, { message: 'Cattle population must be non-negative' }),
	totalMilkingCow: z.number().min(0, { message: 'Milking cow count must be non-negative' }),
	totalMilkProductionPerDay: z.number().min(0, { message: 'Milk production must be non-negative' }),
	totalCalf: z.number().min(0, { message: 'Calf count must be non-negative' }),
	totalFemaleCalf: z.number().min(0, { message: 'Female calf count must be non-negative' }),
	totalMaleCalf: z.number().min(0, { message: 'Male calf count must be non-negative' }),
});

const fishFarmDataSchema = z.object({
	totalPondAreaDecimal: z.number().min(0, { message: 'Pond area must be non-negative' }),
	fishType: z.string().min(1, { message: 'Fish type is required' }),
});

const poultryFarmDataSchema = z.object({
	farmType: z.enum(['LAYER', 'BROILER'], { message: 'Please select farm type' }),
	totalBird: z.number().min(0, { message: 'Bird count must be non-negative' }),
	totalEggProductionPerDay: z.number().min(0, { message: 'Egg production must be non-negative' }),
});

// End User Registration Schema (based on CreateEndUserDto)
export const endUserRegistrationSchema = () =>
	z.discriminatedUnion('userType', [
		z.object({
			authType: z.literal('END_USER'),
			mobileNumber: z.string().min(1, { message: 'Mobile number is required' }),
			userType: z.literal('AGRICULTURE_FARMER'),
			name: z.string().min(1, { message: 'Name is required' }),
			address: z.string().min(1, { message: 'Address is required' }),
			farmData: agricultureFarmDataSchema,
		}),
		z.object({
			authType: z.literal('END_USER'),
			mobileNumber: z.string().min(1, { message: 'Mobile number is required' }),
			userType: z.literal('DAIRY_FARMER'),
			name: z.string().min(1, { message: 'Name is required' }),
			address: z.string().min(1, { message: 'Address is required' }),
			farmData: dairyFarmDataSchema,
		}),
		z.object({
			authType: z.literal('END_USER'),
			mobileNumber: z.string().min(1, { message: 'Mobile number is required' }),
			userType: z.literal('FISH_FARMER'),
			name: z.string().min(1, { message: 'Name is required' }),
			address: z.string().min(1, { message: 'Address is required' }),
			farmData: fishFarmDataSchema,
		}),
		z.object({
			authType: z.literal('END_USER'),
			mobileNumber: z.string().min(1, { message: 'Mobile number is required' }),
			userType: z.literal('POULTRY_FARMER'),
			name: z.string().min(1, { message: 'Name is required' }),
			address: z.string().min(1, { message: 'Address is required' }),
			farmData: poultryFarmDataSchema,
		}),
	]);

export type EndUserRegistrationType = z.infer<ReturnType<typeof endUserRegistrationSchema>>;

// Admin User Registration Schema (based on CreateAdminUserDto)
export const adminUserRegistrationSchema = () =>
	z.object({
		authType: z.literal('ADMIN'),
		mobileNumber: z.string().min(1, { message: 'Mobile number is required' }),
		userType: z.enum(['SERVICE_PROVIDER', 'TRADER_CHEMIST'], {
			message: 'Please select professional type'
		}),
		name: z.string().min(1, { message: 'Name is required' }),
		address: z.string().min(1, { message: 'Address is required' }),
		photo: z.string().optional(),
		lastDegree: z.string().min(1, { message: 'Last degree is required' }),
		areaOfExpertise: z.string().min(1, { message: 'Area of expertise is required' }),
		serviceExperience: z.number().min(0, { message: 'Service experience must be non-negative' }),
		jobPosition: z.string().optional(),
	});

export type AdminUserRegistrationType = z.infer<ReturnType<typeof adminUserRegistrationSchema>>;

// Auth Types
export type AuthType = 'END_USER' | 'ADMIN' | 'SUPER_ADMIN';

// User Types for End Users (from portal-api-client)
export const END_USER_TYPES = ['DAIRY_FARMER', 'POULTRY_FARMER', 'FISH_FARMER', 'AGRICULTURE_FARMER'] as const;
export type EndUserType = typeof END_USER_TYPES[number];

// User Types for Admin Users (from portal-api-client)
export const ADMIN_USER_TYPES = ['SERVICE_PROVIDER', 'TRADER_CHEMIST'] as const;
export type AdminUserType = typeof ADMIN_USER_TYPES[number];
