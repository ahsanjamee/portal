import { Controller } from '@nestjs/common';
import { TypedBody, TypedRoute, TypedParam } from '@nestia/core';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthService } from '../libs/auth/jwt.service';
import { Public } from '../libs/auth/jwt.guard';
import {
    CreateEndUserDto,
    CreateAdminUserDto,
    CreateSuperAdminDto
} from './dto/create-user.dto';
import { SuperAdminLoginDto, LoginDto, VerifyOtpDto, SendOtpDto, RefreshTokenDto, LogoutDto } from './dto/login.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtAuthService: JwtAuthService
    ) { }

    /**
     * Register End User (Farmers)
     * @summary Register a new end user (dairy, poultry, fish, or agriculture farmer) and send OTP
     */
    @Public()
    @TypedRoute.Post('register/end-user')
    async registerEndUser(@TypedBody() createEndUserDto: CreateEndUserDto) {
        return this.userService.registerEndUser(createEndUserDto);
    }

    /**
     * Register Admin User
     * @summary Register a new admin user (service provider or trader/chemist) and send OTP
     */
    @Public()
    @TypedRoute.Post('register/admin')
    async registerAdminUser(@TypedBody() createAdminUserDto: CreateAdminUserDto) {
        return this.userService.registerAdminUser(createAdminUserDto);
    }

    /**
     * Login
     * @summary Login with mobile number and auth type - sends OTP
     */
    @Public()
    @TypedRoute.Post('auth/login')
    async login(@TypedBody() loginDto: LoginDto) {
        return this.userService.login(loginDto);
    }

    /**
     * Verify OTP
     * @summary Verify OTP for authentication and get JWT tokens
     */
    @Public()
    @TypedRoute.Post('auth/verify-otp')
    async verifyOtp(@TypedBody() verifyOtpDto: VerifyOtpDto) {
        return this.userService.verifyOtp(verifyOtpDto);
    }

    /**
     * Verify Mobile for Registration
     * @summary Verify mobile number during registration process using OTP
     */
    @Public()
    @TypedRoute.Post('auth/verify-mobile-registration')
    async verifyMobileForRegistration(@TypedBody() verifyOtpDto: VerifyOtpDto) {
        return this.userService.verifyMobileForRegistration(verifyOtpDto);
    }

    /**
     * Resend OTP
     * @summary Resend OTP to mobile number
     */
    @Public()
    @TypedRoute.Post('auth/send-otp')
    async sendOtp(@TypedBody() sendOtpDto: SendOtpDto) {
        return this.userService.sendOtp(sendOtpDto);
    }

    /**
     * Refresh Token
     * @summary Refresh access token using refresh token
     */
    @Public()
    @TypedRoute.Post('auth/refresh')
    async refreshToken(@TypedBody() refreshTokenDto: RefreshTokenDto) {
        return this.jwtAuthService.refreshTokens(refreshTokenDto.refreshToken);
    }

    /**
     * Logout
     * @summary Logout and invalidate refresh token
     */
    @Public()
    @TypedRoute.Post('auth/logout')
    async logout(@TypedBody() logoutDto: LogoutDto) {
        await this.jwtAuthService.logout(logoutDto.refreshToken);
        return { message: 'Logged out successfully' };
    }

    /**
     * Super Admin Login
     * @summary Login for super admin using email and password
     */
    @Public()
    @TypedRoute.Post('auth/super-admin/login')
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
} 