import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BooleanType } from 'src/common';
import { PaginatedDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../libs/auth/jwt.guard';
import { SuperAdminRoleGuard } from '../../libs/guards/role.guard';
import {
    MedicationDto,
    MedicationQueryDto,
    MedicationResponseDto
} from '../dto';
import { PrescriptionService } from '../prescription.service';

@Controller('super-admin/medicines')
@ApiTags('Super Admin Medicine')
export class SuperAdminMedicineController {
    constructor(private readonly prescriptionService: PrescriptionService) { }

    @TypedRoute.Get('public')
    @ApiTags('Public Medicine')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getPublicMedications(
        @TypedQuery() query: MedicationQueryDto
    ): Promise<PaginatedDto<MedicationResponseDto>> {
        return this.prescriptionService.getMedications(query);
    }

    @TypedRoute.Get()
    @UseGuards(JwtAuthGuard, SuperAdminRoleGuard)
    @ApiBearerAuth()
    async getMedications(
        @TypedQuery() query: MedicationQueryDto
    ): Promise<PaginatedDto<MedicationResponseDto>> {
        return this.prescriptionService.getMedications(query);
    }

    @TypedRoute.Post()
    @UseGuards(JwtAuthGuard, SuperAdminRoleGuard)
    @ApiBearerAuth()
    async createMedication(
        @TypedBody() medication: MedicationDto
    ): Promise<MedicationResponseDto> {
        return this.prescriptionService.createMedication(medication);
    }

    @TypedRoute.Put(':id')
    @UseGuards(JwtAuthGuard, SuperAdminRoleGuard)
    @ApiBearerAuth()
    async updateMedication(
        @TypedParam('id') id: string,
        @TypedBody() medication: MedicationDto
    ): Promise<MedicationResponseDto> {
        return this.prescriptionService.updateMedication(id, medication);
    }

    @TypedRoute.Delete(':id')
    @UseGuards(JwtAuthGuard, SuperAdminRoleGuard)
    @ApiBearerAuth()
    async deleteMedication(
        @TypedParam('id') id: string
    ): Promise<BooleanType> {
        return this.prescriptionService.deleteMedication(id);
    }
} 