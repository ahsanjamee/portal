export type LanguageEntity = 'en' | 'no';

export type UpdateUserProfileDTO = {
	firstName?: string;
	lastName?: string;
	language?: LanguageEntity;
};

export type UpdateCompanyProfileDTO = {
	logo?: string;
	name?: string;
	subDomain?: string;
};
