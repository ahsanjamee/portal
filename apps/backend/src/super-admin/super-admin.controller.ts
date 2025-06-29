import { Controller, Get, Query, UseGuards, Patch, Param, Delete, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminRoleGuard } from '../libs/guards/role.guard';
import { PaginationQueryDto, PaginatedDto } from '../common/dto/pagination.dto';
import { UserWithProfileResponseDto } from '../user/dto/response.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/libs/auth/jwt.guard';
import { EndUserQueryDto, SmsStatsQueryDto } from './dto';
import { TypedRoute } from '@nestia/core';

interface UpdateUserStatusDto {
    isActive: boolean;
}

@ApiTags('Super Admin')
@Controller('super-admin')
@UseGuards(JwtAuthGuard, SuperAdminRoleGuard)
export class SuperAdminController {
    constructor(private readonly superAdminService: SuperAdminService) { }

    @Get('end-users')
    async getAllEndUsers(
        @Query() query: EndUserQueryDto
    ): Promise<PaginatedDto<UserWithProfileResponseDto>> {
        return this.superAdminService.getAllEndUsers(query);
    }

    @Get('admins')
    async getAllAdmins(
        @Query() query: PaginationQueryDto
    ): Promise<PaginatedDto<UserWithProfileResponseDto>> {
        return this.superAdminService.getAllAdmins(query);
    }

    @Patch('end-users/:id/status')
    async updateEndUserStatus(
        @Param('id') id: string,
        @Body() updateStatusDto: UpdateUserStatusDto
    ) {
        return this.superAdminService.updateUserStatus(id, 'END_USER', updateStatusDto.isActive);
    }

    @Patch('admins/:id/status')
    async updateAdminStatus(
        @Param('id') id: string,
        @Body() updateStatusDto: UpdateUserStatusDto
    ) {
        return this.superAdminService.updateUserStatus(id, 'ADMIN', updateStatusDto.isActive);
    }

    @Delete('end-users/:id')
    async deleteEndUser(@Param('id') id: string) {
        return this.superAdminService.deleteUser(id, 'END_USER');
    }

    @Delete('admins/:id')
    async deleteAdmin(@Param('id') id: string) {
        return this.superAdminService.deleteUser(id, 'ADMIN');
    }

    @Get('sms-stats')
    async getSmsStats(
        @Query() query: SmsStatsQueryDto
    ): Promise<PaginatedDto<any>> {
        return this.superAdminService.getSmsStats(query);
    }

    @Get('sms-stats/summary')
    async getSmsStatsSummary(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.superAdminService.getSmsStatsSummary(startDate, endDate);
    }

    @TypedRoute.Post('export/users')
    async exportEndUsers(@Res() res: Response) {
        const fileBuffer = await this.superAdminService.exportUserList();

        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.header('Content-Disposition', `attachment; filename="End_Users_Export_${new Date().toISOString().split('T')[0]}.xlsx"`);
        res.end(fileBuffer);
    }
} 