import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TypedRoute, TypedParam, TypedQuery } from '@nestia/core';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../libs/auth/jwt.guard';
import { UserRoleGuard } from '../../libs/guards/role.guard';
import { User } from '../../common/decorators/user.decorator';
import { TokenPayload } from '../../libs/auth/jwt.service';
import { PrescriptionService } from '../prescription.service';
import {
    PrescriptionQueryDto,
    PrescriptionResponseDto,
    PrescriptionListResponseDto
} from '../dto';
import { PaginatedDto } from '../../common/dto/pagination.dto';

@Controller('farmers/prescriptions')
@ApiTags('User Prescriptions')
@UseGuards(JwtAuthGuard, UserRoleGuard)
@ApiBearerAuth()
export class UserPrescriptionController {
    constructor(private readonly prescriptionService: PrescriptionService) { }

    /**
     * Get my prescriptions as an end user
     * @summary Get prescriptions for the authenticated end user
     */
    @TypedRoute.Get()
    async getMyPrescriptions(
        @TypedQuery() query: PrescriptionQueryDto,
        @User() user: TokenPayload
    ): Promise<PaginatedDto<PrescriptionListResponseDto>> {
        // Get end user profile
        const endUserProfile = await this.prescriptionService['prisma'].endUserProfile.findUnique({
            where: { userId: user.sub }
        });

        if (!endUserProfile) {
            throw new Error('End user profile not found');
        }

        return this.prescriptionService.findByPatient(endUserProfile.id, query);
    }

    /**
     * Get prescription by ID
     * @summary Get a specific prescription by ID (End User only - own prescriptions)
     */
    @TypedRoute.Get(':id')
    async findOne(
        @TypedParam('id') id: string,
        @User() user: TokenPayload
    ): Promise<PrescriptionResponseDto> {
        const prescription = await this.prescriptionService.findOne(id);

        const endUserProfile = await this.prescriptionService['prisma'].endUserProfile.findUnique({
            where: { userId: user.sub }
        });

        if (!endUserProfile || prescription.patientId !== endUserProfile.id) {
            throw new Error('Unauthorized to view this prescription');
        }

        return prescription;
    }
} 