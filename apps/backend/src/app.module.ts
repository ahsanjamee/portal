import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { SmsModule } from './libs/sms/sms.module';
@Module({
    imports: [
        ConfigModule,
        PrismaModule,
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot([
            {
                ttl: 1000,
                limit: 7,
            },
        ]),
        AdminModule,
        UserModule,
        SmsModule,
    ],

    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
    controllers: [],
})
export class AppModule { }
