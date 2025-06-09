import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../libs/sms/sms.service';
import { JwtAuthService } from '../libs/auth/jwt.service';
import * as bcrypt from 'bcrypt';
import {
    CreateEndUserDto,
    CreateAdminUserDto,
} from './dto/create-user.dto';
import { SuperAdminLoginDto, LoginDto, VerifyOtpDto, SendOtpDto } from './dto/login.dto';
import { AuthType } from '@prisma/client';
import { AuthType as AuthTypeDto } from './dto/login.dto';
@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly smsService: SmsService,
        private readonly jwtAuthService: JwtAuthService
    ) { }

    // Verify password for super admin
    private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    // Register End User (Farmers) and send OTP
    async registerEndUser(createEndUserDto: CreateEndUserDto) {

        const isVerified = await this.prisma.verifiedMobileNumber.findUnique({
            where: { mobileNumber: createEndUserDto.mobileNumber }
        });

        if (!isVerified) {
            throw new BadRequestException('Mobile number not verified');
        }

        // Create user and profile in transaction
        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    authType: AuthType.END_USER,
                    mobileNumber: createEndUserDto.mobileNumber,
                    isVerified: true,
                }
            });

            const profile = await tx.endUserProfile.create({
                data: {
                    userId: user.id,
                    userType: createEndUserDto.userType,
                    name: createEndUserDto.name,
                    address: createEndUserDto.address,
                    farmData: createEndUserDto.farmData as any
                }
            });

            return { user, profile };
        });

        // Generate JWT tokens
        const tokens = await this.jwtAuthService.generateTokens({
            sub: result.user.id,
            email: result.user.email || undefined,
            mobileNumber: result.user.mobileNumber || undefined,
            authType: result.user.authType as AuthTypeDto,
        });

        return {
            id: result.user.id,
            authType: result.user.authType,
            mobileNumber: result.user.mobileNumber,
            profile: result.profile,
            message: 'Registration successful.',
            ...tokens
        };
    }

    // Register Admin User (Service Provider, Trader/Chemist) and send OTP
    async registerAdminUser(createAdminUserDto: CreateAdminUserDto) {

        const isVerified = await this.prisma.verifiedMobileNumber.findUnique({
            where: { mobileNumber: createAdminUserDto.mobileNumber }
        });

        if (!isVerified) {
            throw new BadRequestException('Mobile number not verified');
        }

        // Create user and profile in transaction
        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    authType: AuthType.ADMIN,
                    mobileNumber: createAdminUserDto.mobileNumber,
                }
            });

            const profile = await tx.adminUserProfile.create({
                data: {
                    userId: user.id,
                    userType: createAdminUserDto.userType,
                    name: createAdminUserDto.name,
                    address: createAdminUserDto.address,
                    photo: createAdminUserDto.photo,
                    lastDegree: createAdminUserDto.lastDegree,
                    areaOfExpertise: createAdminUserDto.areaOfExpertise,
                    serviceExperience: createAdminUserDto.serviceExperience,
                    jobPosition: createAdminUserDto.jobPosition
                }
            });

            return { user, profile };
        });

        // Generate JWT tokens
        const tokens = await this.jwtAuthService.generateTokens({
            sub: result.user.id,
            email: result.user.email || undefined,
            mobileNumber: result.user.mobileNumber || undefined,
            authType: result.user.authType as AuthTypeDto,
        });

        return {
            id: result.user.id,
            authType: result.user.authType,
            mobileNumber: result.user.mobileNumber,
            profile: result.profile,
            message: 'Admin user registered successfully.',
            ...tokens
        };
    }

    // Login function - sends OTP to mobile number based on auth type
    async login(loginDto: LoginDto) {

        // Check if user exists with the mobile number and auth type
        const user = await this.prisma.user.findFirst({
            where: {
                mobileNumber: loginDto.mobileNumber,
                authType: loginDto.authType
            },
        });

        if (!user) {
            throw new BadRequestException('User not found with the provided mobile number and auth type');
        }

        // Send OTP for login
        try {
            await this.smsService.sendOtp(loginDto.mobileNumber);
        } catch (error) {
            console.error('Failed to send OTP for login:', error);
            throw new BadRequestException('Failed to send OTP. Please try again.');
        }

        return {
            message: 'OTP sent successfully to your mobile number',
            mobileNumber: loginDto.mobileNumber,
            authType: loginDto.authType
        };
    }

    // Verify OTP using SMS service
    async verifyOtp(verifyOtpDto: VerifyOtpDto) {
        // Verify OTP using SMS service
        const isValidOtp = this.smsService.verifyOtp(verifyOtpDto.mobileNumber, verifyOtpDto.otp);

        if (!isValidOtp) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        // First find user to get their auth type
        const userBasic = await this.prisma.user.findUnique({
            where: { mobileNumber: verifyOtpDto.mobileNumber }
        });

        if (!userBasic) {
            throw new UnauthorizedException('User not found');
        }

        // Build include object based on auth type
        const includeProfile = {
            endUserProfile: userBasic.authType === AuthType.END_USER,
            adminUserProfile: userBasic.authType === AuthType.ADMIN
        };

        // Get user with appropriate profile
        const user = await this.prisma.user.findUnique({
            where: { mobileNumber: verifyOtpDto.mobileNumber },
            include: includeProfile
        });


        // Generate JWT tokens
        const tokens = await this.jwtAuthService.generateTokens({
            sub: user!.id,
            email: user!.email || undefined,
            mobileNumber: user!.mobileNumber || undefined,
            authType: user!.authType as AuthTypeDto,
        });

        return {
            id: user!.id,
            authType: user!.authType,
            mobileNumber: user!.mobileNumber,
            isVerified: true,
            profile: user!.endUserProfile || user!.adminUserProfile,
            message: 'OTP verified successfully',
            ...tokens
        };
    }

    // Verify mobile number for registration - checks OTP and updates phoneVerified status
    async verifyMobileForRegistration(verifyOtpDto: VerifyOtpDto) {
        // Find user by mobile number
        const user = await this.prisma.user.findUnique({
            where: { mobileNumber: verifyOtpDto.mobileNumber }
        });

        if (user) {
            throw new BadRequestException('User already exists with the provided mobile number');
        }

        const alreadyVerified = await this.prisma.verifiedMobileNumber.findUnique({
            where: { mobileNumber: verifyOtpDto.mobileNumber }
        });

        if (alreadyVerified) {
            return {
                success: true,
                message: 'Mobile number is already verified',
                phoneVerified: true,
                mobileNumber: verifyOtpDto.mobileNumber
            };
        }

        // Verify OTP using SMS service
        const isValidOtp = this.smsService.verifyOtp(verifyOtpDto.mobileNumber, verifyOtpDto.otp);

        if (!isValidOtp) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        // Update phoneVerified status
        await this.prisma.verifiedMobileNumber.create({
            data: {
                mobileNumber: verifyOtpDto.mobileNumber,
                isVerified: true
            }
        });

        return {
            success: true,
            message: 'Mobile number verified successfully',
            phoneVerified: true,
            mobileNumber: verifyOtpDto.mobileNumber
        };
    }

    // Super Admin Login (only login, no registration)
    async loginSuperAdmin(superAdminLoginDto: SuperAdminLoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: superAdminLoginDto.email }
        });

        if (!user || user.authType !== AuthType.SUPER_ADMIN) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.verifyPassword(superAdminLoginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT tokens
        const tokens = await this.jwtAuthService.generateTokens({
            sub: user.id,
            email: user.email || undefined,
            mobileNumber: user.mobileNumber || undefined,
            authType: user.authType as AuthTypeDto,
        });

        return {
            id: user.id,
            authType: user.authType,
            email: user.email,
            isVerified: user.isVerified,
            ...tokens
        };
    }

    // Get user by ID
    async findById(id: string) {
        // First get basic user info to determine auth type
        const userBasic = await this.prisma.user.findUnique({
            where: { id }
        });

        if (!userBasic) {
            throw new BadRequestException('User not found');
        }

        // Build include object based on auth type
        const includeProfile = {
            endUserProfile: userBasic.authType === AuthType.END_USER,
            adminUserProfile: userBasic.authType === AuthType.ADMIN
        };

        // Get user with appropriate profile
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: includeProfile
        });

        return {
            id: user!.id,
            authType: user!.authType,
            mobileNumber: user!.mobileNumber,
            email: user!.email,
            isVerified: user!.isVerified,
            isActive: user!.isActive,
            profile: user!.endUserProfile || user!.adminUserProfile
        };
    }

    // Resend OTP
    async sendOtp(sendOtpDto: SendOtpDto) {

        if (!sendOtpDto.mobileNumber) {
            throw new BadRequestException('Mobile number is required');
        }

        // Send OTP
        try {
            await this.smsService.sendOtp(sendOtpDto.mobileNumber);
        } catch (error) {
            console.error('Failed to send OTP:', error);
            throw new BadRequestException('Failed to send OTP. Please try again.');
        }

        return {
            message: 'OTP sent successfully',
            mobileNumber: sendOtpDto.mobileNumber
        };
    }
} 