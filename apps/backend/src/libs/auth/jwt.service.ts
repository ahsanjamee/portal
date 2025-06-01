import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../config/config.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthType } from 'src/user/dto/login.dto';

export interface TokenPayload {
    sub: string; // user id
    email?: string;
    mobileNumber?: string;
    authType: AuthType;
    iat?: number;
    exp?: number;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

@Injectable()
export class JwtAuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService
    ) { }

    /**
     * Generate access and refresh tokens
     */
    async generateTokens(payload: Omit<TokenPayload, 'iat' | 'exp'>): Promise<TokenResponse> {
        const accessTokenPayload = { ...payload };
        const refreshTokenPayload = { ...payload, type: 'refresh' };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(accessTokenPayload, {
                secret: this.configService.values.auth.jwtSecret,
                expiresIn: this.configService.values.auth.accessTokenExpiresIn,
            }),
            this.jwtService.signAsync(refreshTokenPayload, {
                secret: this.configService.values.auth.jwtSecret,
                expiresIn: this.configService.values.auth.refreshTokenExpiresIn,
            }),
        ]);

        // Store refresh token in database
        await this.storeRefreshToken(payload.sub, refreshToken);

        // Calculate expiration time in seconds
        const expiresIn = this.getExpirationTime(this.configService.values.auth.accessTokenExpiresIn);

        return {
            accessToken,
            refreshToken,
            expiresIn,
        };
    }

    /**
     * Verify access token
     */
    async verifyAccessToken(token: string): Promise<TokenPayload> {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.values.auth.jwtSecret,
            });

            // Check if user still exists and is active
            const user = await this.prisma.user.findFirst({
                where: {
                    id: payload.sub,
                    isActive: true,
                },
            });

            if (!user) {
                throw new UnauthorizedException('User not found or inactive');
            }

            return payload;
        } catch (error) {
            throw new UnauthorizedException('Invalid access token');
        }
    }

    /**
     * Verify refresh token and generate new tokens
     */
    async refreshTokens(refreshToken: string): Promise<TokenResponse> {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.values.auth.jwtSecret,
            });

            // Check if refresh token exists in database
            const storedToken = await this.prisma.refreshToken.findFirst({
                where: {
                    userId: payload.sub,
                    token: refreshToken,
                    isValid: true,
                },
                include: {
                    user: true,
                },
            });

            if (!storedToken || !storedToken.user.isActive) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            // Invalidate old refresh token
            await this.invalidateRefreshToken(refreshToken);

            // Generate new tokens
            const newPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
                sub: storedToken.user.id,
                email: storedToken.user.email || undefined,
                mobileNumber: storedToken.user.mobileNumber || undefined,
                authType: storedToken.user.authType as AuthType,
            };

            return this.generateTokens(newPayload);
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    /**
     * Logout - invalidate refresh token
     */
    async logout(refreshToken: string): Promise<void> {
        await this.invalidateRefreshToken(refreshToken);
    }

    /**
     * Logout from all devices - invalidate all refresh tokens for user
     */
    async logoutFromAllDevices(userId: string): Promise<void> {
        await this.prisma.refreshToken.updateMany({
            where: {
                userId,
                isValid: true,
            },
            data: {
                isValid: false,
            },
        });
    }

    /**
     * Store refresh token in database
     */
    private async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
        const expiresAt = new Date();
        const expirationTime = this.getExpirationTime(this.configService.values.auth.refreshTokenExpiresIn);
        expiresAt.setSeconds(expiresAt.getSeconds() + expirationTime);

        await this.prisma.refreshToken.create({
            data: {
                userId,
                token: refreshToken,
                expiresAt,
                isValid: true,
            },
        });
    }

    /**
     * Invalidate refresh token
     */
    private async invalidateRefreshToken(refreshToken: string): Promise<void> {
        await this.prisma.refreshToken.updateMany({
            where: {
                token: refreshToken,
                isValid: true,
            },
            data: {
                isValid: false,
            },
        });
    }

    /**
     * Convert expiration string to seconds
     */
    private getExpirationTime(expiresIn: string): number {
        const unit = expiresIn.slice(-1);
        const value = parseInt(expiresIn.slice(0, -1));

        switch (unit) {
            case 's':
                return value;
            case 'm':
                return value * 60;
            case 'h':
                return value * 60 * 60;
            case 'd':
                return value * 24 * 60 * 60;
            case 'y':
                return value * 365 * 24 * 60 * 60;
            default:
                return 3600; // Default to 1 hour
        }
    }

    /**
     * Clean up expired refresh tokens
     */
    async cleanupExpiredTokens(): Promise<void> {
        await this.prisma.refreshToken.deleteMany({
            where: {
                OR: [
                    { expiresAt: { lt: new Date() } },
                    { isValid: false },
                ],
            },
        });
    }
} 