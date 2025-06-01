import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard, AuthTypeGuard, JwtAuthTypeGuard } from './jwt.guard';
import { ConfigModule } from '../../config/config.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [
        ConfigModule,
        PrismaModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            // Configuration will be provided by the service using ConfigService
        }),
    ],
    providers: [
        JwtAuthService,
        JwtStrategy,
        JwtAuthGuard,
        AuthTypeGuard,
        JwtAuthTypeGuard,
    ],
    exports: [
        JwtAuthService,
        JwtAuthGuard,
        AuthTypeGuard,
        JwtAuthTypeGuard,
        PassportModule,
    ],
})
export class AuthModule { } 