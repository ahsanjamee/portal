import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { User } from '../common/decorators/user.decorator';
import { PaginatedDto, PaginationQueryDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../libs/auth/jwt.guard';
import { TokenPayload } from '../libs/auth/jwt.service';
import {
    CreatePrescriptionDto,
    PatientInfoResponseDto,
    PrescriptionListResponseDto,
    PrescriptionQueryDto,
    PrescriptionResponseDto,
    UpdatePrescriptionDto
} from './dto';
import { PrescriptionService } from './prescription.service';

@Controller('prescription')
@ApiTags('Prescription')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PrescriptionController {
    constructor(
        private readonly prescriptionService: PrescriptionService,
    ) { }

    /**
     * Create a new prescription
     * @summary Create a new prescription (Admin only)
     */
    @TypedRoute.Post()
    async create(
        @TypedBody() createPrescriptionDto: CreatePrescriptionDto,
        @User() user: TokenPayload
    ): Promise<PrescriptionResponseDto> {
        // Get admin user profile to get the doctorId
        const adminProfile = await this.prescriptionService['prisma'].adminUserProfile.findUnique({
            where: { userId: user.sub }
        });

        if (!adminProfile) {
            throw new Error('Admin profile not found');
        }

        return this.prescriptionService.create(createPrescriptionDto, adminProfile.id);
    }

    /**
     * Get all patients (end users) for prescription form
     * @summary Get all end users for patient selection in prescription form
     */
    @TypedRoute.Get('patients')
    async getPatients(
        @TypedQuery() query: PaginationQueryDto
    ): Promise<PaginatedDto<PatientInfoResponseDto>> {
        return this.prescriptionService.getPatients(query);
    }

    /**
     * Get all prescriptions for the current admin
     * @summary Get all prescriptions created by the current admin
     */
    @TypedRoute.Get()
    async findAll(
        @TypedQuery() query: PrescriptionQueryDto,
        @User() user: TokenPayload
    ): Promise<PaginatedDto<PrescriptionListResponseDto>> {
        const adminProfile = await this.prescriptionService['prisma'].adminUserProfile.findUnique({
            where: { userId: user.sub }
        });

        if (!adminProfile) {
            throw new Error('Admin profile not found');
        }

        return this.prescriptionService.findByDoctor(adminProfile.id, query);
    }

    /**
     * Get prescription by ID
     * @summary Get a specific prescription by ID
     */
    @TypedRoute.Get(':id')
    async findOne(
        @TypedParam('id') id: string,
        @User() user: TokenPayload
    ): Promise<PrescriptionResponseDto> {
        const prescription = await this.prescriptionService.findOne(id);

        const adminProfile = await this.prescriptionService['prisma'].adminUserProfile.findUnique({
            where: { userId: user.sub }
        });

        if (!adminProfile || prescription.doctorId !== adminProfile.id) {
            throw new Error('Unauthorized to view this prescription');
        }

        return prescription;
    }

    /**
     * Update prescription
     * @summary Update a prescription (Admin only - own prescriptions)
     */
    @TypedRoute.Put(':id')
    async update(
        @TypedParam('id') id: string,
        @TypedBody() updatePrescriptionDto: UpdatePrescriptionDto,
        @User() user: TokenPayload
    ): Promise<PrescriptionResponseDto> {
        const adminProfile = await this.prescriptionService['prisma'].adminUserProfile.findUnique({
            where: { userId: user.sub }
        });

        if (!adminProfile) {
            throw new Error('Admin profile not found');
        }

        return this.prescriptionService.update(id, updatePrescriptionDto, adminProfile.id);
    }

    /**
     * Delete prescription
     * @summary Delete a prescription (Admin only - own prescriptions)
     */
    @TypedRoute.Delete(':id')
    async remove(
        @TypedParam('id') id: string,
        @User() user: TokenPayload
    ): Promise<{ message: string }> {
        const adminProfile = await this.prescriptionService['prisma'].adminUserProfile.findUnique({
            where: { userId: user.sub }
        });

        if (!adminProfile) {
            throw new Error('Admin profile not found');
        }

        await this.prescriptionService.remove(id, adminProfile.id);
        return { message: 'Prescription deleted successfully' };
    }
} 