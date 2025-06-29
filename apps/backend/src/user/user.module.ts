import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { ProfileController } from './controllers/profile.controller';
import { UserService } from './service/user.service';
import { ProfileService } from './service/profile.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../libs/auth/auth.module';
import { SmsModule } from '../libs/sms/sms.module';
@Module({
    imports: [PrismaModule, AuthModule, SmsModule],
    controllers: [UserController, ProfileController],
    providers: [UserService, ProfileService],
    exports: [UserService, ProfileService]
})
export class UserModule { } 