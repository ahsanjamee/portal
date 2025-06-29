import { Controller, UseGuards, Param } from '@nestjs/common';
import { TypedBody, TypedRoute } from '@nestia/core';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../libs/auth/jwt.guard';
import { ProfileService } from '../service/profile.service';
import { UserId } from '../../common/decorators/user.decorator';
import {
    UpdateEndUserProfileDto,
    UpdateAdminUserProfileDto,
    ProfileUpdateResponseDto
} from '../dto/update-profile.dto';
import { EndUserProfileResponseDto, AdminUserProfileResponseDto } from '../dto/response.dto';

@Controller('user/profile')
@ApiTags('User Profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService
    ) { }

    /**
     * Get Current User Profile
     * @summary Get the current user's profile information
     */
    @TypedRoute.Get()
    async getCurrentUserProfile(
        @UserId() userId: string
    ): Promise<EndUserProfileResponseDto | AdminUserProfileResponseDto> {
        return this.profileService.getProfile(userId);
    }

    /**
     * Update End User Profile
     * @summary Update end user (farmer) profile information
     */
    @TypedRoute.Put('end-user/:id')
    async updateEndUserProfile(
        @Param('id') userId: string,
        @TypedBody() updateData: UpdateEndUserProfileDto
    ): Promise<ProfileUpdateResponseDto> {
        return this.profileService.updateEndUserProfile(userId, updateData);
    }

    /**
     * Update Admin User Profile
     * @summary Update admin user profile information
     */
    @TypedRoute.Put('admin/:id')
    async updateAdminUserProfile(
        @Param('id') userId: string,
        @TypedBody() updateData: UpdateAdminUserProfileDto
    ): Promise<ProfileUpdateResponseDto> {
        return this.profileService.updateAdminUserProfile(userId, updateData);
    }

    /**
 * Update Profile Image
 * @summary Update profile image URL for both end users and admin users
 */
    @TypedRoute.Put('image')
    async updateProfileImage(
        @UserId() userId: string,
        @TypedBody() body: { imageUrl: string }
    ): Promise<ProfileUpdateResponseDto> {
        return this.profileService.updateProfileImage(userId, body.imageUrl);
    }
} 