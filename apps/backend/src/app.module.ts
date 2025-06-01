import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { SmsModule } from './libs/sms/sms.module';
import { AuthModule } from './libs/auth/auth.module';
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
        AdminModule,
        UserModule,
        SmsModule,
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
