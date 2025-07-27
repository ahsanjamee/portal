import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthType } from '@prisma/client';
import {
    CreatePrescriptionDto,
    UpdatePrescriptionDto,
    PrescriptionQueryDto,
    PrescriptionResponseDto,
    PrescriptionListResponseDto,
    MedicationResponseDto,
    PatientInfoResponseDto,
    MedicationDto,
    MedicationQueryDto
} from './dto';
import { PaginatedDto, PaginationQueryDto, resetPaginationQuery, paginatedData } from '../common/dto/pagination.dto';
import { BooleanType } from 'src/common';

@Injectable()
export class PrescriptionService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createPrescriptionDto: CreatePrescriptionDto, doctorId: string): Promise<PrescriptionResponseDto> {
        // Verify doctor exists and is an admin user
        const doctor = await this.prisma.adminUserProfile.findUnique({
            where: { id: doctorId },
            include: { user: true }
        });

        if (!doctor) {
            throw new NotFoundException('Doctor not found');
        }

        if (doctor.user.authType !== AuthType.ADMIN) {
            throw new ForbiddenException('Only admin users can create prescriptions');
        }

        // Verify patient exists and is an end user
        const patient = await this.prisma.endUserProfile.findUnique({
            where: { id: createPrescriptionDto.patientId },
            include: { user: true }
        });

        if (!patient) {
            throw new NotFoundException('Patient not found');
        }

        if (patient.user.authType !== AuthType.END_USER) {
            throw new BadRequestException('Patient must be an end user');
        }

        // Generate reference number
        const reference = await this.generateReferenceNumber();


        // Create prescription
        const prescription = await this.prisma.prescription.create({
            data: {
                ...createPrescriptionDto,
                reference,
                doctorId,
                medications: createPrescriptionDto.medications as any[],
                followUpDate: createPrescriptionDto.followUpDate ? new Date(createPrescriptionDto.followUpDate) : null,

            },
            include: {
                doctor: {
                    include: { user: true }
                },
                patient: {
                    include: { user: true }
                }
            }
        });

        return this.mapToPrescriptionResponse(prescription);
    }

    async getPatients(query: PaginationQueryDto): Promise<PaginatedDto<PatientInfoResponseDto>> {
        const normalizedQuery = resetPaginationQuery(query);

        // Build where condition for end users
        const whereCondition: any = {
            authType: AuthType.END_USER,
            isActive: true
        };

        if (normalizedQuery.search) {
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

        // Get users with pagination
        const users = await this.prisma.user.findMany({
            where: whereCondition,
            include: {
                endUserProfile: true
            },
            orderBy: { createdAt: 'desc' },
            skip: normalizedQuery.page * normalizedQuery.pageSize,
            take: normalizedQuery.pageSize
        });

        const items = users.map(user => ({
            id: user.endUserProfile!.id,
            name: user.endUserProfile!.name,
            address: user.endUserProfile!.address,
            photo: user.endUserProfile!.photo ?? undefined,
            userType: user.endUserProfile!.userType,
            farmData: user.endUserProfile!.farmData,
            mobileNumber: user.mobileNumber ?? undefined
        }));

        return paginatedData(items, total, normalizedQuery);
    }

    async findAll(query: PrescriptionQueryDto): Promise<PaginatedDto<PrescriptionListResponseDto>> {
        const normalizedQuery = resetPaginationQuery(query);

        // Build where condition
        const whereCondition: any = {};

        if (query.doctorId) {
            whereCondition.doctorId = query.doctorId;
        }

        if (query.patientId) {
            whereCondition.patientId = query.patientId;
        }

        if (query.animalType) {
            whereCondition.animalType = {
                contains: query.animalType,
                mode: 'insensitive' as const
            };
        }

        if (query.startDate || query.endDate) {
            whereCondition.date = {};
            if (query.startDate) {
                whereCondition.date.gte = new Date(query.startDate);
            }
            if (query.endDate) {
                whereCondition.date.lte = new Date(query.endDate);
            }
        }

        if (query.hasFollowUp !== undefined) {
            if (query.hasFollowUp) {
                whereCondition.followUpDate = { not: null };
            } else {
                whereCondition.followUpDate = null;
            }
        }

        if (normalizedQuery.search) {
            whereCondition.OR = [
                { reference: { contains: normalizedQuery.search, mode: 'insensitive' as const } },
                { animalType: { contains: normalizedQuery.search, mode: 'insensitive' as const } },
                { doctor: { name: { contains: normalizedQuery.search, mode: 'insensitive' as const } } },
                { patient: { name: { contains: normalizedQuery.search, mode: 'insensitive' as const } } }
            ];
        }

        // Get total count
        const total = await this.prisma.prescription.count({
            where: whereCondition
        });

        // Get prescriptions with pagination
        const prescriptions = await this.prisma.prescription.findMany({
            where: whereCondition,
            include: {
                doctor: true,
                patient: true
            },
            orderBy: { createdAt: 'desc' },
            skip: normalizedQuery.page * normalizedQuery.pageSize,
            take: normalizedQuery.pageSize
        });

        const items = prescriptions.map(prescription => ({
            id: prescription.id,
            reference: prescription.reference,
            doctorName: prescription.doctor.name,
            patientName: prescription.patient.name,
            animalType: prescription.animalType,
            consultancyFee: prescription.consultancyFee ?? undefined,
            followUpDate: prescription.followUpDate?.toISOString(),
            createdAt: prescription.createdAt.toISOString()
        }));

        return paginatedData(items, total, normalizedQuery);
    }

    async findOne(id: string): Promise<PrescriptionResponseDto> {
        const prescription = await this.prisma.prescription.findUnique({
            where: { id },
            include: {
                doctor: {
                    include: { user: true }
                },
                patient: {
                    include: { user: true }
                }
            }
        });

        if (!prescription) {
            throw new NotFoundException('Prescription not found');
        }

        return this.mapToPrescriptionResponse(prescription);
    }

    async update(id: string, updatePrescriptionDto: UpdatePrescriptionDto, doctorId: string): Promise<PrescriptionResponseDto> {
        // Verify prescription exists and belongs to the doctor
        const existingPrescription = await this.prisma.prescription.findUnique({
            where: { id },
            include: {
                doctor: {
                    include: { user: true }
                },
                patient: {
                    include: { user: true }
                }
            }
        });

        if (!existingPrescription) {
            throw new NotFoundException('Prescription not found');
        }

        if (existingPrescription.doctorId !== doctorId) {
            throw new ForbiddenException('You can only update your own prescriptions');
        }

        // Update prescription
        const updatedPrescription = await this.prisma.prescription.update({
            where: { id },
            data: {
                ...updatePrescriptionDto,
                medications: updatePrescriptionDto.medications as any,
                followUpDate: updatePrescriptionDto.followUpDate ? new Date(updatePrescriptionDto.followUpDate) : null,
            },
            include: {
                doctor: {
                    include: { user: true }
                },
                patient: {
                    include: { user: true }
                }
            }
        });

        return this.mapToPrescriptionResponse(updatedPrescription);
    }

    async remove(id: string, doctorId: string): Promise<void> {
        // Verify prescription exists and belongs to the doctor
        const prescription = await this.prisma.prescription.findUnique({
            where: { id }
        });

        if (!prescription) {
            throw new NotFoundException('Prescription not found');
        }

        if (prescription.doctorId !== doctorId) {
            throw new ForbiddenException('You can only delete your own prescriptions');
        }

        await this.prisma.prescription.delete({
            where: { id }
        });
    }

    async findByDoctor(doctorId: string, query: PrescriptionQueryDto): Promise<PaginatedDto<PrescriptionListResponseDto>> {
        return this.findAll({ ...query, doctorId });
    }

    async findByPatient(patientId: string, query: PrescriptionQueryDto): Promise<PaginatedDto<PrescriptionListResponseDto>> {
        return this.findAll({ ...query, patientId });
    }

    private async generateReferenceNumber(): Promise<string> {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        // Count prescriptions created today
        const startOfDay = new Date(year, today.getMonth(), today.getDate());
        const endOfDay = new Date(year, today.getMonth(), today.getDate() + 1);

        const count = await this.prisma.prescription.count({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lt: endOfDay
                }
            }
        });

        const sequence = String(count + 1).padStart(3, '0');
        return `${year}${month}${day}${sequence}`;
    }

    private mapToPrescriptionResponse(prescription: any): PrescriptionResponseDto {
        return {
            id: prescription.id,
            reference: prescription.reference,
            doctorId: prescription.doctorId,
            doctor: {
                id: prescription.doctor.id,
                name: prescription.doctor.name,
                address: prescription.doctor.address,
                photo: prescription.doctor.photo ?? undefined,
                lastDegree: prescription.doctor.lastDegree,
                areaOfExpertise: prescription.doctor.areaOfExpertise,
                serviceExperience: prescription.doctor.serviceExperience,
                jobPosition: prescription.doctor.jobPosition
            },
            patientId: prescription.patientId,
            patient: {
                id: prescription.patient.id,
                name: prescription.patient.name,
                address: prescription.patient.address,
                photo: prescription.patient.photo ?? undefined,
                userType: prescription.patient.userType,
                farmData: prescription.patient.farmData,
                mobileNumber: prescription.patient.user.mobileNumber,
                email: prescription.patient.user.email ?? ''
            },
            animalType: prescription.animalType,
            animalPicture: prescription.animalPicture,
            patientNumber: prescription.patientNumber,
            age: prescription.age,
            td: prescription.td,
            sex: prescription.sex,
            weight: prescription.weight,
            ownersComplaints: prescription.ownersComplaints,
            temperature: prescription.temperature,
            spo2: prescription.spo2,
            respirationRate: prescription.respirationRate,
            fecesStatus: prescription.fecesStatus,
            nasalSecretion: prescription.nasalSecretion,
            feedingHistory: prescription.feedingHistory,
            medicationHistory: prescription.medicationHistory,
            investigation: prescription.investigation,
            medications: prescription.medications as any[],
            advice: prescription.advice,
            consultancyFee: prescription.consultancyFee,
            followUpDate: prescription.followUpDate?.toISOString(),
            createdAt: prescription.createdAt.toISOString(),
            updatedAt: prescription.updatedAt.toISOString()
        };
    }

    async deletePrescriptionById(id: string): Promise<BooleanType> {

        const prescription = await this.prisma.prescription.findUnique({
            where: { id }
        });

        if (!prescription) {
            throw new NotFoundException('Prescription not found');
        }

        await this.prisma.prescription.delete({
            where: { id }
        });

        return true
    }

    async createMedication(medication: MedicationDto): Promise<MedicationResponseDto> {
        const newMedication = await this.prisma.medication.create({
            data: medication
        });

        return {
            name: newMedication.name,
            id: newMedication.id,
            createdAt: newMedication.createdAt.toISOString(),
            updatedAt: newMedication.updatedAt.toISOString()
        };
    }

    async updateMedication(id: string, medication: MedicationDto): Promise<MedicationResponseDto> {
        const updatedMedication = await this.prisma.medication.update({
            where: { id },
            data: medication
        });

        return {
            name: updatedMedication.name,
            id: updatedMedication.id,
            createdAt: updatedMedication.createdAt.toISOString(),
            updatedAt: updatedMedication.updatedAt.toISOString()
        };
    }

    async deleteMedication(id: string): Promise<BooleanType> {
        await this.prisma.medication.delete({
            where: { id }
        });

        return true
    }

    async getMedications(query: MedicationQueryDto): Promise<PaginatedDto<MedicationResponseDto>> {
        const normalizedQuery = resetPaginationQuery(query);

        const whereCondition: any = {
            name: {
                contains: normalizedQuery.search,
                mode: 'insensitive' as const
            }
        }

        const total = await this.prisma.medication.count({
            where: whereCondition
        });

        const medicationList = await this.prisma.medication.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'desc' },
            skip: normalizedQuery.page * normalizedQuery.pageSize,
            take: normalizedQuery.pageSize
        })

        const items = medicationList.map(medication => ({
            name: medication.name,
            id: medication.id,
            createdAt: medication.createdAt.toISOString(),
            updatedAt: medication.updatedAt.toISOString()
        }));

        return paginatedData(items, total, normalizedQuery)
    }
} 