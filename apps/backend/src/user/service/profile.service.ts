import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthType, User } from '@prisma/client';
import {
    UpdateEndUserProfileDto,
    UpdateAdminUserProfileDto,
    ProfileUpdateResponseDto
} from '../dto/update-profile.dto';
import { EndUserProfileResponseDto, AdminUserProfileResponseDto } from '../dto/response.dto';

@Injectable()
export class ProfileService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    /**
     * Get user profile by user ID
     */
    async getProfile(userId: string): Promise<EndUserProfileResponseDto | AdminUserProfileResponseDto> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                endUserProfile: true,
                adminUserProfile: true
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.authType === AuthType.END_USER && user.endUserProfile) {
            return this.mapEndUserProfileResponse(user.endUserProfile, user.email);
        } else if (user.authType === AuthType.ADMIN && user.adminUserProfile) {
            return this.mapAdminUserProfileResponse(user.adminUserProfile, user.email);
        }

        throw new NotFoundException('User profile not found');
    }

    /**
     * Update end user profile
     */
    async updateEndUserProfile(
        userId: string,
        updateData: UpdateEndUserProfileDto
    ): Promise<ProfileUpdateResponseDto> {
        // Verify user exists and has the correct auth type
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { endUserProfile: true }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.authType !== AuthType.END_USER) {
            throw new ForbiddenException('User is not an end user');
        }

        if (!user.endUserProfile) {
            throw new NotFoundException('End user profile not found');
        }

        // Prepare update data - only include fields that are provided
        const updateFields: any = {};

        if (updateData.name !== undefined) updateFields.name = updateData.name;
        if (updateData.address !== undefined) updateFields.address = updateData.address;
        if (updateData.userType !== undefined) updateFields.userType = updateData.userType;
        if (updateData.photo !== undefined) updateFields.photo = updateData.photo;
        // Handle farm data update - merge with existing data
        if (updateData.farmData !== undefined) {
            const existingFarmData = user.endUserProfile.farmData as any;
            updateFields.farmData = { ...existingFarmData, ...updateData.farmData };
        }

        // Update the profile
        const updatedProfile = await this.prisma.endUserProfile.update({
            where: { userId: userId },
            data: updateFields
        });

        let updatedUser: User | null = null;
        if (updateData.email !== undefined) {
            // Get updated user data
            updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: { email: updateData.email }
            });
        }

        return this.createProfileUpdateResponse(
            'End user profile updated successfully',
            updatedUser!,
            updatedProfile,
            'endUser'
        );
    }

    /**
     * Update admin user profile
     */
    async updateAdminUserProfile(
        userId: string,
        updateData: UpdateAdminUserProfileDto
    ): Promise<ProfileUpdateResponseDto> {
        // Verify user exists and has the correct auth type
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { adminUserProfile: true }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.authType !== AuthType.ADMIN) {
            throw new ForbiddenException('User is not an admin user');
        }

        if (!user.adminUserProfile) {
            throw new NotFoundException('Admin user profile not found');
        }

        // Prepare update data - only include fields that are provided
        const updateFields: any = {};

        if (updateData.name !== undefined) updateFields.name = updateData.name;
        if (updateData.address !== undefined) updateFields.address = updateData.address;
        if (updateData.userType !== undefined) updateFields.userType = updateData.userType;
        if (updateData.lastDegree !== undefined) updateFields.lastDegree = updateData.lastDegree;
        if (updateData.areaOfExpertise !== undefined) updateFields.areaOfExpertise = updateData.areaOfExpertise;
        if (updateData.serviceExperience !== undefined) updateFields.serviceExperience = updateData.serviceExperience;
        if (updateData.jobPosition !== undefined) updateFields.jobPosition = updateData.jobPosition;
        if (updateData.photo !== undefined) updateFields.photo = updateData.photo;
        // Update the profile
        const updatedProfile = await this.prisma.adminUserProfile.update({
            where: { userId: userId },
            data: updateFields
        });

        let updatedUser: User | null = null;
        if (updateData.email !== undefined) {
            // Get updated user data
            updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: { email: updateData.email }
            });

        }

        return this.createProfileUpdateResponse(
            'Admin user profile updated successfully',
            updatedUser!,
            updatedProfile,
            'admin'
        );
    }

    /**
     * Update profile image URL for both end users and admin users
     */
    async updateProfileImage(
        userId: string,
        imageUrl: string
    ): Promise<ProfileUpdateResponseDto> {
        // Verify user exists and get profile data
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                endUserProfile: true,
                adminUserProfile: true
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.authType === AuthType.END_USER) {
            if (!user.endUserProfile) {
                throw new NotFoundException('End user profile not found');
            }

            // Update end user profile image
            const updatedProfile = await this.prisma.endUserProfile.update({
                where: { userId: userId },
                data: { photo: imageUrl }
            });

            // Get updated user data
            const updatedUser = await this.prisma.user.findUnique({
                where: { id: userId }
            });

            return this.createProfileUpdateResponse(
                'Profile image updated successfully',
                updatedUser!,
                updatedProfile,
                'endUser'
            );

        } else if (user.authType === AuthType.ADMIN) {
            if (!user.adminUserProfile) {
                throw new NotFoundException('Admin user profile not found');
            }

            // Update admin user profile image
            const updatedProfile = await this.prisma.adminUserProfile.update({
                where: { userId: userId },
                data: { photo: imageUrl }
            });

            // Get updated user data
            const updatedUser = await this.prisma.user.findUnique({
                where: { id: userId }
            });

            return this.createProfileUpdateResponse(
                'Profile image updated successfully',
                updatedUser!,
                updatedProfile,
                'admin'
            );

        } else {
            throw new BadRequestException('Profile images are not available for this user type');
        }
    }

    /**
     * Private helper method to map user data to response format
     */
    private mapUserResponse(user: any) {
        return {
            id: user.id,
            authType: user.authType,
            mobileNumber: user.mobileNumber || undefined,
            email: user.email || undefined,
            isVerified: user.isVerified || false,
            isActive: user.isActive,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
        };
    }

    /**
     * Private helper method to map end user profile to response format
     */
    private mapEndUserProfileResponse(profile: any, userEmail?: string | null): EndUserProfileResponseDto {
        return {
            id: profile.id,
            userType: profile.userType,
            name: profile.name,
            address: profile.address,
            photo: profile.photo || undefined,
            farmData: profile.farmData as object,
            email: userEmail || undefined
        };
    }

    /**
     * Private helper method to map admin user profile to response format
     */
    private mapAdminUserProfileResponse(profile: any, userEmail?: string | null): AdminUserProfileResponseDto {
        return {
            id: profile.id,
            userType: profile.userType,
            name: profile.name,
            address: profile.address,
            photo: profile.photo || undefined,
            lastDegree: profile.lastDegree,
            areaOfExpertise: profile.areaOfExpertise,
            serviceExperience: profile.serviceExperience,
            jobPosition: profile.jobPosition || undefined,
            email: userEmail || undefined
        };
    }

    /**
     * Private helper method to map end user profile for update response
     */
    private mapEndUserProfileForUpdate(profile: any) {
        return {
            id: profile.id,
            userType: profile.userType,
            name: profile.name,
            address: profile.address,
            userId: profile.userId,
            photo: profile.photo || undefined,
            farmData: profile.farmData as object
        };
    }

    /**
     * Private helper method to map admin user profile for update response
     */
    private mapAdminUserProfileForUpdate(profile: any) {
        return {
            id: profile.id,
            userType: profile.userType,
            name: profile.name,
            address: profile.address,
            userId: profile.userId,
            photo: profile.photo || undefined,
            lastDegree: profile.lastDegree,
            areaOfExpertise: profile.areaOfExpertise,
            serviceExperience: profile.serviceExperience,
            jobPosition: profile.jobPosition || undefined
        };
    }

    /**
     * Private helper method to create profile update response
     */
    private createProfileUpdateResponse(
        message: string,
        user: any,
        profile: any,
        profileType: 'endUser' | 'admin'
    ): ProfileUpdateResponseDto {
        return {
            message,
            user: this.mapUserResponse(user),
            profile: profileType === 'endUser'
                ? this.mapEndUserProfileForUpdate(profile)
                : this.mapAdminUserProfileForUpdate(profile)
        };
    }
} 