import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TypedRoute, TypedParam, TypedQuery } from '@nestia/core';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../libs/auth/jwt.guard';
import { SuperAdminRoleGuard } from '../libs/guards/role.guard';
import { PrescriptionService } from './prescription.service';
import {
    PrescriptionQueryDto,
    PrescriptionResponseDto,
    PrescriptionListResponseDto
} from './dto';
import { PaginatedDto } from '../common/dto/pagination.dto';

@Controller('super-admin/prescriptions')
@ApiTags('Super Admin Prescriptions')
@UseGuards(JwtAuthGuard, SuperAdminRoleGuard)
@ApiBearerAuth()
export class SuperAdminPrescriptionController {
    constructor(private readonly prescriptionService: PrescriptionService) { }

    /**
     * Get all prescriptions
     * @summary Get all prescriptions in the system (Super Admin only)
     */
    @TypedRoute.Get()
    async findAll(
        @TypedQuery() query: PrescriptionQueryDto
    ): Promise<PaginatedDto<PrescriptionListResponseDto>> {
        return this.prescriptionService.findAll(query);
    }

    /**
     * Get prescription by ID
     * @summary Get a specific prescription by ID (Super Admin only)
     */
    @TypedRoute.Get(':id')
    async findOne(
        @TypedParam('id') id: string
    ): Promise<PrescriptionResponseDto> {
        return this.prescriptionService.findOne(id);
    }

    /**
     * Get prescriptions by doctor
     * @summary Get prescriptions created by a specific doctor (Super Admin only)
     */
    @TypedRoute.Get('doctor/:doctorId')
    async findByDoctor(
        @TypedParam('doctorId') doctorId: string,
        @TypedQuery() query: PrescriptionQueryDto
    ): Promise<PaginatedDto<PrescriptionListResponseDto>> {
        return this.prescriptionService.findByDoctor(doctorId, query);
    }

    /**
     * Get prescriptions by patient
     * @summary Get prescriptions for a specific patient (Super Admin only)
     */
    @TypedRoute.Get('patient/:patientId')
    async findByPatient(
        @TypedParam('patientId') patientId: string,
        @TypedQuery() query: PrescriptionQueryDto
    ): Promise<PaginatedDto<PrescriptionListResponseDto>> {
        return this.prescriptionService.findByPatient(patientId, query);
    }
} 