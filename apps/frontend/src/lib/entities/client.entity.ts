export type InvitedClientEntity = {
	id: string;
	name: string;
	email: string;
	phone: string;
	location: string;
};

export type SingleClientEntity = InvitedClientEntity & {
	createdAt: string;
	updatedAt: string;
	companyId: string;
};

export type ClientsEntity = {
	clients: SingleClientEntity[];
	total: number;
	totalPages: number;
	nextPage: number | null;
};
