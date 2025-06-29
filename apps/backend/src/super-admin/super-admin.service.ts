import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthType } from '@prisma/client';
import { PaginationQueryDto, PaginatedDto, resetPaginationQuery, paginatedData } from '../common/dto/pagination.dto';
import { UserWithProfileResponseDto } from '../user/dto/response.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { EndUserQueryDto } from './dto';

@Injectable()
export class SuperAdminService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllEndUsers(query: EndUserQueryDto): Promise<PaginatedDto<UserWithProfileResponseDto>> {
        const normalizedQuery = resetPaginationQuery(query);

        // Build where condition for search and userType filtering
        let whereCondition: any = {
            authType: AuthType.END_USER,
        };

        // Handle different combinations of userType and search filters
        if (query.userType && normalizedQuery.search) {
            // Both userType and search provided - combine them with AND
            whereCondition.AND = [
                { endUserProfile: { userType: query.userType } },
                {
                    OR: [
                        { mobileNumber: { contains: normalizedQuery.search, mode: 'insensitive' as const } },
                        { email: { contains: normalizedQuery.search, mode: 'insensitive' as const } },
                        { endUserProfile: { name: { contains: normalizedQuery.search, mode: 'insensitive' as const } } }
                    ]
                }
            ];
        } else if (query.userType) {
            // Only userType provided
            whereCondition.endUserProfile = {
                userType: query.userType
            };
        } else if (normalizedQuery.search) {
            // Only search provided
            whereCondition.OR = [
                { mobileNumber: { contains: normalizedQuery.search, mode: 'insensitive' as const } },
                { email: { contains: normalizedQuery.search, mode: 'insensitive' as const } },
                { endUserProfile: { name: { contains: normalizedQuery.search, mode: 'insensitive' as const } } }
            ];
        }

        // Get total count
        const total = await this.prisma.user.count({
            where: whereCondition
        });

        // Get paginated data
        const users = await this.prisma.user.findMany({
            where: whereCondition,
            include: {
                endUserProfile: true
            },
            orderBy: {
                [normalizedQuery.sortBy]: normalizedQuery.sort
            },
            skip: normalizedQuery.page * normalizedQuery.pageSize,
            take: normalizedQuery.pageSize
        });

        // Transform data to match response DTO
        const transformedUsers: UserWithProfileResponseDto[] = users.map(user => ({
            id: user.id,
            authType: user.authType,
            mobileNumber: user.mobileNumber || undefined,
            email: user.email || undefined,
            isVerified: user.isVerified ?? false,
            isActive: user.isActive,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            profile: user.endUserProfile ? {
                id: user.endUserProfile.id,
                userType: user.endUserProfile.userType,
                name: user.endUserProfile.name,
                address: user.endUserProfile.address,
                farmData: user.endUserProfile.farmData as object
            } : undefined
        }));

        return paginatedData(transformedUsers, total, normalizedQuery);
    }

    async getAllAdmins(query: PaginationQueryDto): Promise<PaginatedDto<UserWithProfileResponseDto>> {
        const normalizedQuery = resetPaginationQuery(query);

        // Build where condition for search
        const whereCondition = {
            authType: AuthType.ADMIN,
            ...(normalizedQuery.search && {
                OR: [
                    { mobileNumber: { contains: normalizedQuery.search, mode: 'insensitive' as const } },
                    { email: { contains: normalizedQuery.search, mode: 'insensitive' as const } },
                    { adminUserProfile: { name: { contains: normalizedQuery.search, mode: 'insensitive' as const } } }
                ]
            })
        };

        // Get total count
        const total = await this.prisma.user.count({
            where: whereCondition
        });

        // Get paginated data
        const users = await this.prisma.user.findMany({
            where: whereCondition,
            include: {
                adminUserProfile: true
            },
            orderBy: {
                [normalizedQuery.sortBy]: normalizedQuery.sort
            },
            skip: normalizedQuery.page * normalizedQuery.pageSize,
            take: normalizedQuery.pageSize
        });

        // Transform data to match response DTO
        const transformedUsers: UserWithProfileResponseDto[] = users.map(user => ({
            id: user.id,
            authType: user.authType,
            mobileNumber: user.mobileNumber || undefined,
            email: user.email || undefined,
            isVerified: user.isVerified ?? false,
            isActive: user.isActive,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            profile: user.adminUserProfile ? {
                id: user.adminUserProfile.id,
                userType: user.adminUserProfile.userType,
                name: user.adminUserProfile.name,
                address: user.adminUserProfile.address,
                photo: user.adminUserProfile.photo || undefined,
                lastDegree: user.adminUserProfile.lastDegree,
                areaOfExpertise: user.adminUserProfile.areaOfExpertise,
                serviceExperience: user.adminUserProfile.serviceExperience,
                jobPosition: user.adminUserProfile.jobPosition || undefined
            } : undefined
        }));

        return paginatedData(transformedUsers, total, normalizedQuery);
    }

    async updateUserStatus(userId: string, expectedAuthType: string, isActive: boolean) {
        // Verify user exists and has correct auth type
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.authType !== expectedAuthType) {
            throw new BadRequestException(`User is not of type ${expectedAuthType}`);
        }

        if (user.isActive === isActive) {
            const status = isActive ? 'active' : 'inactive';
            throw new BadRequestException(`User is already ${status}`);
        }

        // Update user status
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { isActive, updatedAt: new Date() }
        });

        const action = isActive ? 'activated' : 'deactivated';
        return {
            message: `${expectedAuthType} user ${action} successfully`,
            userId: updatedUser.id,
            isActive: updatedUser.isActive
        };
    }

    async deleteUser(userId: string, expectedAuthType: string) {
        // Verify user exists and has correct auth type
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

        if (user.authType !== expectedAuthType) {
            throw new BadRequestException(`User is not of type ${expectedAuthType}`);
        }

        // Delete user and related profiles in transaction
        await this.prisma.$transaction(async (tx) => {
            // Delete profile first (if exists)
            if (user.endUserProfile) {
                await tx.endUserProfile.delete({
                    where: { userId: userId }
                });
            }

            if (user.adminUserProfile) {
                await tx.adminUserProfile.delete({
                    where: { userId: userId }
                });
            }

            // Delete user
            await tx.user.delete({
                where: { id: userId }
            });
        });

        return {
            message: `${expectedAuthType} user deleted successfully`,
            userId: userId
        };
    }
} 