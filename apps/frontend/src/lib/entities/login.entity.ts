import { AdminUserProfile, EndUserProfile } from '@/stores/global.store';

export type LoginResponse = {
	accessToken: string;
	refreshToken: string;
	email: string;
	mobileNumber: string;
	authType: 'END_USER' | 'SUPER_ADMIN' | 'ADMIN';
	profile?: EndUserProfile | AdminUserProfile;
};
