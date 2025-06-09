import { CreateAdminUserDto, CreateEndUserDto } from '@portal/portal-api-client';

export type LoginResponse = {
	accessToken: string;
	refreshToken: string;
	authType: 'END_USER' | 'SUPER_ADMIN' | 'ADMIN_USER';
	profile?: CreateEndUserDto | CreateAdminUserDto;
};
