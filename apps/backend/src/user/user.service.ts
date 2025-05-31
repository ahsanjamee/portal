import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../libs/sms/sms.service';
import * as bcrypt from 'bcrypt';
import {
    CreateEndUserDto,
    CreateAdminUserDto,
    AuthType,
    EndUserType,
    AdminUserType
} from './dto/create-user.dto';
import { SuperAdminLoginDto, LoginDto, VerifyOtpDto, ResendOtpDto } from './dto/login.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly smsService: SmsService
    ) { }

    // Verify password for super admin
    private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    // Register End User (Farmers) and send OTP
    async registerEndUser(createEndUserDto: CreateEndUserDto) {
        // Check if mobile number already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { mobileNumber: createEndUserDto.mobileNumber }
        });

        if (existingUser) {
            throw new ConflictException('Mobile number already registered');
        }

        // Create user and profile in transaction
        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    authType: AuthType.END_USER,
                    mobileNumber: createEndUserDto.mobileNumber,
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

        // Send OTP after successful registration
        try {
            if (createEndUserDto.mobileNumber) {
                await this.smsService.sendOtp(createEndUserDto.mobileNumber);
            }
        } catch (error) {
            console.error('Failed to send OTP during registration:', error);
            // Continue even if SMS fails
        }

        return {
            id: result.user.id,
            authType: result.user.authType,
            mobileNumber: result.user.mobileNumber,
            profile: result.profile,
            message: 'User registered successfully. OTP sent to mobile number.'
        };
    }

    // Register Admin User (Service Provider, Trader/Chemist) and send OTP
    async registerAdminUser(createAdminUserDto: CreateAdminUserDto) {
        // Check if mobile number already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { mobileNumber: createAdminUserDto.mobileNumber }
        });

        if (existingUser) {
            throw new ConflictException('Mobile number already registered');
        }

        // Check if email already exists
        const existingEmail = await this.prisma.user.findUnique({
            where: { email: createAdminUserDto.email }
        });

        if (existingEmail) {
            throw new ConflictException('Email already registered');
        }

        // Create user and profile in transaction
        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    authType: AuthType.ADMIN,
                    mobileNumber: createAdminUserDto.mobileNumber,
                    email: createAdminUserDto.email,
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

        // Send OTP after successful registration
        try {
            if (createAdminUserDto.mobileNumber) {
                await this.smsService.sendOtp(createAdminUserDto.mobileNumber);
            }
        } catch (error) {
            console.error('Failed to send OTP during registration:', error);
            // Continue even if SMS fails
        }

        return {
            id: result.user.id,
            authType: result.user.authType,
            mobileNumber: result.user.mobileNumber,
            profile: result.profile,
            message: 'Admin user registered successfully. OTP sent to mobile number.'
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
            include: {
                endUserProfile: true,
                adminUserProfile: true
            }
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

        // Find user
        const user = await this.prisma.user.findUnique({
            where: { mobileNumber: verifyOtpDto.mobileNumber },
            include: {
                endUserProfile: true,
                adminUserProfile: true
            }
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Mark user as verified
        await this.prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true }
        });

        return {
            id: user.id,
            authType: user.authType,
            mobileNumber: user.mobileNumber,
            email: user.email,
            isVerified: true,
            profile: user.endUserProfile || user.adminUserProfile,
            message: 'OTP verified successfully'
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

        return {
            id: user.id,
            authType: user.authType,
            email: user.email,
            isVerified: user.isVerified
        };
    }

    // Get user by ID
    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                endUserProfile: true,
                adminUserProfile: true
            }
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        return {
            id: user.id,
            authType: user.authType,
            mobileNumber: user.mobileNumber,
            email: user.email,
            isVerified: user.isVerified,
            isActive: user.isActive,
            profile: user.endUserProfile || user.adminUserProfile
        };
    }

    // Get all users (for admin purposes)
    async findAll() {
        return this.prisma.user.findMany({
            include: {
                endUserProfile: true,
                adminUserProfile: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Update user status
    async updateUserStatus(id: string, isActive: boolean) {
        return this.prisma.user.update({
            where: { id },
            data: { isActive }
        });
    }

    // Resend OTP
    async resendOtp(resendOtpDto: ResendOtpDto) {
        // Check if user exists
        const user = await this.prisma.user.findUnique({
            where: { mobileNumber: resendOtpDto.mobileNumber }
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Send OTP
        try {
            await this.smsService.sendOtp(resendOtpDto.mobileNumber);
        } catch (error) {
            console.error('Failed to resend OTP:', error);
            throw new BadRequestException('Failed to send OTP. Please try again.');
        }

        return {
            message: 'OTP sent successfully',
            mobileNumber: resendOtpDto.mobileNumber
        };
    }
} 