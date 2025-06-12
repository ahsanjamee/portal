import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isPubliclyAccessible } from 'src/common/decorators/public.decorator';
import { UserResponseDto } from 'src/user/dto';

@Injectable()
export class SuperAdminRoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // NOTE: this is for public route
        if (isPubliclyAccessible(context, this.reflector)) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user as UserResponseDto;

        const path = request.path;
        if (!path.includes('/super-admin/')) return false;

        return ['SUPER_ADMIN'].includes(user.authType);
    }
}

@Injectable()
export class CompanyAdminRoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // NOTE: this is for public route
        if (isPubliclyAccessible(context, this.reflector)) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user as UserResponseDto;

        const path = request.path;
        if (!path.includes('/admin/')) return false;

        return user.authType === 'ADMIN';
    }
}

@Injectable()
export class UserRoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (isPubliclyAccessible(context, this.reflector)) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user as UserResponseDto;

        const path = request.path;
        if (!path.includes('/farmers/')) return false;

        return user.authType === 'END_USER'; // all other role can access this from company user
    }
}
