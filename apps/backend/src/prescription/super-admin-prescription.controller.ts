import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatedDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../libs/auth/jwt.guard';
import { SuperAdminRoleGuard } from '../libs/guards/role.guard';
import {
    PrescriptionListResponseDto,
    PrescriptionQueryDto,
    PrescriptionResponseDto
} from './dto';
import { PrescriptionService } from './prescription.service';
import { BooleanType } from 'src/common';

@Controller('super-admin/prescriptions')
@ApiTags('Super Admin Prescriptions')
@UseGuards(JwtAuthGuard, SuperAdminRoleGuard)
@ApiBearerAuth()
export class SuperAdminPrescriptionController {
    constructor(private readonly prescriptionService: PrescriptionService) { }

    @TypedRoute.Get()
    async findAll(
        @TypedQuery() query: PrescriptionQueryDto
    ): Promise<PaginatedDto<PrescriptionListResponseDto>> {
        return this.prescriptionService.findAll(query);
    }

    @TypedRoute.Get(':id')
    async findOne(
        @TypedParam('id') id: string
    ): Promise<PrescriptionResponseDto> {
        return this.prescriptionService.findOne(id);
    }

    @TypedRoute.Delete(':id')
    async deletePrescriptionById(
        @TypedParam('id') id: string
    ): Promise<BooleanType> {
        return this.prescriptionService.deletePrescriptionById(id);
    }
} 