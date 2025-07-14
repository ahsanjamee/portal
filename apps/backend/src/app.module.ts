import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { SmsModule } from './libs/sms/sms.module';
import { AuthModule } from './libs/auth/auth.module';
import { PrescriptionModule } from './prescription/prescription.module';
import { JwtAuthGuard } from './libs/auth/jwt.guard';

@Module({
    imports: [
        ConfigModule,
        PrismaModule,
        AuthModule,
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot([
            {
                ttl: 1000,
                limit: 7,
            },
        ]),
        SuperAdminModule,
        UserModule,
        SmsModule,
        PrescriptionModule,
    ],

    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
    controllers: [],
})
export class AppModule { }
