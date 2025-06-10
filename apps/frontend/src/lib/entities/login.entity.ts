import { AdminUserProfile, EndUserProfile } from '@/stores/global.store';

export type LoginResponse = {
	accessToken: string;
	refreshToken: string;
	authType: 'END_USER' | 'SUPER_ADMIN' | 'ADMIN';
	profile?: EndUserProfile | AdminUserProfile;
};
