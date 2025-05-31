import { Controller } from '@nestjs/common';
import { TypedBody, TypedRoute, TypedParam } from '@nestia/core';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
    CreateEndUserDto,
    CreateAdminUserDto,
    CreateSuperAdminDto
} from './dto/create-user.dto';
import { SuperAdminLoginDto, LoginDto, VerifyOtpDto, ResendOtpDto } from './dto/login.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(private readonly userService: UserService) { }

    /**
     * Register End User (Farmers)
     * @summary Register a new end user (dairy, poultry, fish, or agriculture farmer) and send OTP
     */
    @TypedRoute.Post('register/end-user')
    async registerEndUser(@TypedBody() createEndUserDto: CreateEndUserDto) {
        return this.userService.registerEndUser(createEndUserDto);
    }

    /**
     * Register Admin User
     * @summary Register a new admin user (service provider or trader/chemist) and send OTP
     */
    @TypedRoute.Post('register/admin')
    async registerAdminUser(@TypedBody() createAdminUserDto: CreateAdminUserDto) {
        return this.userService.registerAdminUser(createAdminUserDto);
    }

    /**
     * Login
     * @summary Login with mobile number and auth type - sends OTP
     */
    @TypedRoute.Post('auth/login')
    async login(@TypedBody() loginDto: LoginDto) {
        return this.userService.login(loginDto);
    }

    /**
     * Verify OTP
     * @summary Verify OTP for authentication
     */
    @TypedRoute.Post('auth/verify-otp')
    async verifyOtp(@TypedBody() verifyOtpDto: VerifyOtpDto) {
        return this.userService.verifyOtp(verifyOtpDto);
    }

    /**
     * Resend OTP
     * @summary Resend OTP to mobile number
     */
    @TypedRoute.Post('auth/resend-otp')
    async resendOtp(@TypedBody() resendOtpDto: ResendOtpDto) {
        return this.userService.resendOtp(resendOtpDto);
    }

    /**
     * Super Admin Login
     * @summary Login for super admin using email and password
     */
    @TypedRoute.Post('auth/super-admin-login')
    async loginSuperAdmin(@TypedBody() superAdminLoginDto: SuperAdminLoginDto) {
        return this.userService.loginSuperAdmin(superAdminLoginDto);
    }

    /**
     * Get User by ID
     * @summary Get user details by user ID
     */
    @TypedRoute.Get(':id')
    async getUserById(@TypedParam('id') id: string) {
        return this.userService.findById(id);
    }

    /**
     * Get All Users
     * @summary Get all users (admin endpoint)
     */
    @TypedRoute.Get()
    async getAllUsers() {
        return this.userService.findAll();
    }

    /**
     * Update User Status
     * @summary Activate or deactivate a user
     */
    @TypedRoute.Patch(':id/status')
    async updateUserStatus(
        @TypedParam('id') id: string,
        @TypedBody() body: { isActive: boolean }
    ) {
        return this.userService.updateUserStatus(id, body.isActive);
    }
} 