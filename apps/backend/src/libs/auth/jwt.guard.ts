import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenPayload } from './jwt.service';
import { AuthType } from 'src/user/dto/login.dto';

// Decorator for setting required auth types
export const RequireAuthTypes = (...authTypes: AuthType[]) => SetMetadata('authTypes', authTypes);

// Decorator for public routes
export const Public = () => SetMetadata('isPublic', true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(protected reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw err || new UnauthorizedException('Authentication required');
        }
        return user;
    }
}

@Injectable()
export class AuthTypeGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredAuthTypes = this.reflector.getAllAndOverride<AuthType[]>('authTypes', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredAuthTypes) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: TokenPayload = request.user;

        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }

        const hasRequiredAuthType = requiredAuthTypes.includes(user.authType);
        if (!hasRequiredAuthType) {
            throw new UnauthorizedException(`Access denied. Required auth types: ${requiredAuthTypes.join(', ')}`);
        }

        return true;
    }
}

// Combined guard for easier use
@Injectable()
export class JwtAuthTypeGuard extends JwtAuthGuard {
    constructor(
        reflector: Reflector,
        private authTypeGuard: AuthTypeGuard
    ) {
        super(reflector);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        // First check JWT authentication
        const jwtResult = await super.canActivate(context);
        if (!jwtResult) {
            return false;
        }

        // Then check auth type authorization
        return this.authTypeGuard.canActivate(context);
    }
} 