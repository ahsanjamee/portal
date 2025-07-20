import { Module } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { PrescriptionController } from './controllers/prescription.controller';
import { SuperAdminPrescriptionController } from './controllers/super-admin-prescription.controller';
import { UserPrescriptionController } from './controllers/user-prescription.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SuperAdminMedicineController } from './controllers/medicine.controller';

@Module({
    imports: [PrismaModule],
    controllers: [
        PrescriptionController,
        SuperAdminPrescriptionController,
        UserPrescriptionController,
        SuperAdminMedicineController
    ],
    providers: [PrescriptionService],
    exports: [PrescriptionService],
})
export class PrescriptionModule { }