import { Module } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { PrescriptionPdfService } from './pdf.service';
import { PrescriptionController } from './prescription.controller';
import { SuperAdminPrescriptionController } from './super-admin-prescription.controller';
import { UserPrescriptionController } from './user-prescription.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [
        PrescriptionController,
        SuperAdminPrescriptionController,
        UserPrescriptionController
    ],
    providers: [PrescriptionService, PrescriptionPdfService],
    exports: [PrescriptionService, PrescriptionPdfService],
})
export class PrescriptionModule { } 