import { SiteEntity, UserEntity } from '@/stores/types';

export type AcceptInviteEntity = {
	company: SiteEntity;
	user: {
		user: UserEntity;
		accessToken: string;
		refreshToken: string;
	};
};
