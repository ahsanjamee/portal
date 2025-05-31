import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigModule } from '../../config/config.module';

@Module({
    imports: [PrismaModule, ConfigModule],
    providers: [SmsService],
    exports: [SmsService],
})
export class SmsModule { } 