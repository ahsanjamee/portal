import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthType } from '@prisma/client';
import { PaginationQueryDto, PaginatedDto, resetPaginationQuery, paginatedData } from '../common/dto/pagination.dto';
import { UserWithProfileResponseDto } from '../user/dto/response.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { EndUserQueryDto, SmsStatsQueryDto } from './dto';
import * as XLSX from 'xlsx';

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

    async getSmsStats(query: SmsStatsQueryDto): Promise<PaginatedDto<any>> {
        const normalizedQuery = resetPaginationQuery(query);

        // Build where condition for date range and message type filtering
        let whereCondition: any = {};

        // Handle date filtering
        if (query.startDate || query.endDate) {
            whereCondition.createdAt = {};
            if (query.startDate) {
                whereCondition.createdAt.gte = new Date(query.startDate);
            }
            if (query.endDate) {
                whereCondition.createdAt.lte = new Date(query.endDate);
            }
        }

        // Handle message type filtering
        if (query.messageType) {
            whereCondition.messageType = query.messageType;
        }

        // Handle search filtering (search in recipient number, message, or provider)
        if (normalizedQuery.search) {
            whereCondition.OR = [
                { recipientNumber: { contains: normalizedQuery.search, mode: 'insensitive' as const } },
                { message: { contains: normalizedQuery.search, mode: 'insensitive' as const } },
                { provider: { contains: normalizedQuery.search, mode: 'insensitive' as const } },
                { messageType: { contains: normalizedQuery.search, mode: 'insensitive' as const } }
            ];
        }

        // Get total count
        const total = await this.prisma.otpTracking.count({
            where: whereCondition
        });

        // Get paginated data
        const smsRecords = await this.prisma.otpTracking.findMany({
            where: whereCondition,
            orderBy: {
                [normalizedQuery.sortBy]: normalizedQuery.sort
            },
            skip: normalizedQuery.page * normalizedQuery.pageSize,
            take: normalizedQuery.pageSize
        });

        // Transform data to include formatted dates and additional stats
        const transformedRecords = smsRecords.map(record => ({
            id: record.id,
            companyName: record.companyName,
            recipientNumber: record.recipientNumber,
            message: record.message,
            messageType: record.messageType,
            status: record.status,
            provider: record.provider,
            errorMessage: record.errorMessage,
            createdAt: record.createdAt.toISOString(),
        }));

        return paginatedData(transformedRecords, total, normalizedQuery);
    }

    async getSmsStatsSummary(startDate?: string, endDate?: string) {
        const whereClause: any = {};

        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt.gte = new Date(startDate);
            if (endDate) whereClause.createdAt.lte = new Date(endDate);
        }

        const [total, successful, failed, otpCount, adminNotificationCount, endUserNotificationCount, broadcastCount] = await Promise.all([
            this.prisma.otpTracking.count({ where: whereClause }),
            this.prisma.otpTracking.count({
                where: { ...whereClause, status: 'SUCCESS' }
            }),
            this.prisma.otpTracking.count({
                where: { ...whereClause, status: 'FAILED' }
            }),
            this.prisma.otpTracking.count({
                where: { ...whereClause, messageType: 'OTP' }
            }),
            this.prisma.otpTracking.count({
                where: { ...whereClause, messageType: 'ADMIN_NOTIFICATION' }
            }),
            this.prisma.otpTracking.count({
                where: { ...whereClause, messageType: 'END_USER_NOTIFICATION' }
            }),
            this.prisma.otpTracking.count({
                where: { ...whereClause, messageType: 'BROADCAST_NOTIFICATION' }
            }),
        ]);

        return {
            total,
            successful,
            failed,
            otpCount,
            adminNotificationCount,
            endUserNotificationCount,
            broadcastCount,
            successRate: total > 0 ? Math.round((successful / total) * 100 * 100) / 100 : 0,
            failureRate: total > 0 ? Math.round((failed / total) * 100 * 100) / 100 : 0,
        };
    }

    async exportUserList() {
        const data = await this.prisma.user.findMany({
            where: {
                authType: AuthType.END_USER,
            },
            include: {
                endUserProfile: true,
            },
        });

        const workBook = XLSX.utils.book_new();

        // Base headers
        const baseHeaders = [
            'Name',
            'Email',
            'Phone',
            'User Type',
            'Address',
            'Is Active',
            'Created At',
        ];

        // Farm-specific headers based on user types
        const dairyHeaders = [
            'Total Cattle Population',
            'Total Milking Cow',
            'Milk Production Per Day (Ltrs)',
            'Total Calf',
            'Total Female Calf',
            'Total Male Calf'
        ];

        const poultryHeaders = [
            'Farm Type',
            'Total Bird',
            'Egg Production Per Day (Pcs)'
        ];

        const fishHeaders = [
            'Total Pond Area (Decimal)',
            'Fish Type'
        ];

        const agricultureHeaders = [
            'Total Agriculture Land (Decimal)',
            'Type of Agriculture'
        ];

        // Create separate sheets for each user type
        const userTypeSheets = {
            DAIRY_FARMER: { headers: [...baseHeaders, ...dairyHeaders], data: [] as any[] },
            POULTRY_FARMER: { headers: [...baseHeaders, ...poultryHeaders], data: [] as any[] },
            FISH_FARMER: { headers: [...baseHeaders, ...fishHeaders], data: [] as any[] },
            AGRICULTURE_FARMER: { headers: [...baseHeaders, ...agricultureHeaders], data: [] as any[] },
        };

        // Organize data by user type
        for (const d of data) {
            const userType = d.endUserProfile?.userType;
            if (!userType || !userTypeSheets[userType]) continue;

            const baseRow = [
                d.endUserProfile?.name || 'N/A',
                d.email || 'N/A',
                d.mobileNumber || 'N/A',
                userType,
                d.endUserProfile?.address || 'N/A',
                d.isActive.toString(),
                d.createdAt.toISOString() ? `${d.createdAt.toISOString()} UTC` : 'N/A',
            ];

            let farmDataRow: any[] = [];
            const farmData = d.endUserProfile?.farmData as any;

            switch (userType) {
                case 'DAIRY_FARMER':
                    farmDataRow = [
                        farmData?.totalCattlePopulation || 0,
                        farmData?.totalMilkingCow || 0,
                        farmData?.totalMilkProductionPerDay || 0,
                        farmData?.totalCalf || 0,
                        farmData?.totalFemaleCalf || 0,
                        farmData?.totalMaleCalf || 0
                    ];
                    break;
                case 'POULTRY_FARMER':
                    farmDataRow = [
                        farmData?.farmType || 'N/A',
                        farmData?.totalBird || 0,
                        farmData?.totalEggProductionPerDay || 0
                    ];
                    break;
                case 'FISH_FARMER':
                    farmDataRow = [
                        farmData?.totalPondAreaDecimal || 0,
                        farmData?.fishType || 'N/A'
                    ];
                    break;
                case 'AGRICULTURE_FARMER':
                    farmDataRow = [
                        farmData?.totalAgricultureLandDecimal || 0,
                        farmData?.typeOfAgriculture || 'N/A'
                    ];
                    break;
            }

            userTypeSheets[userType].data.push([...baseRow, ...farmDataRow]);
        }

        // Create worksheets for each user type
        Object.entries(userTypeSheets).forEach(([userType, sheetData]) => {
            if (sheetData.data.length > 0) {
                const sheet = [sheetData.headers, ...sheetData.data];
                const workSheet = XLSX.utils.aoa_to_sheet(sheet);

                // Auto-size columns
                const colWidths = sheetData.headers.map(header => ({ wch: Math.max(header.length, 15) }));
                workSheet['!cols'] = colWidths;

                XLSX.utils.book_append_sheet(workBook, workSheet, userType.replace('_', ' '));
            }
        });

        // Create a summary sheet with all users
        const summaryHeaders = [
            'Name',
            'Email',
            'Phone',
            'User Type',
            'Address',
            'Is Active',
            'Created At',
        ];
        const summarySheet = [summaryHeaders];

        for (const d of data) {
            const summaryRow = [
                d.endUserProfile?.name || 'N/A',
                d.email || 'N/A',
                d.mobileNumber || 'N/A',
                d.endUserProfile?.userType || 'N/A',
                d.endUserProfile?.address || 'N/A',
                d.isActive.toString(),
                d.createdAt.toISOString() ? `${d.createdAt.toISOString()} UTC` : 'N/A',
            ];
            summarySheet.push(summaryRow);
        }

        const summaryWorkSheet = XLSX.utils.aoa_to_sheet(summarySheet);
        const summaryColWidths = summaryHeaders.map(header => ({ wch: Math.max(header.length, 15) }));
        summaryWorkSheet['!cols'] = summaryColWidths;

        // Add summary sheet first
        XLSX.utils.book_append_sheet(workBook, summaryWorkSheet, 'All Users Summary');

        return XLSX.write(workBook, { type: 'buffer', bookType: 'xlsx' });
    }
} 