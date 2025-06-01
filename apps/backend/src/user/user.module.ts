import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../libs/auth/auth.module';
import { SmsModule } from '../libs/sms/sms.module';
@Module({
    imports: [PrismaModule, AuthModule, SmsModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { } 