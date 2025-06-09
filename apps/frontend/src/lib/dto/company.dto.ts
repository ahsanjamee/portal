import { UserRole } from '@/stores/types';

export type CreateCompanyDTO = {
	name: string;
	subDomain: string;
};

export type InviteUserDTO = {
	companyID: string;
	email: string;
	role: UserRole;
};
