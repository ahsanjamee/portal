import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../config/config.service';
import { JwtAuthService, TokenPayload } from './jwt.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtAuthService: JwtAuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.values.auth.jwtSecret,
        });
    }

    async validate(payload: TokenPayload): Promise<TokenPayload> {
        try {
            // Additional validation if needed
            return payload;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
} 