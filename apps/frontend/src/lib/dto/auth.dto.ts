export type SendCodeDTO = {
	email: string;
};

export type VerifyCodeDTO = SendCodeDTO & {
	code: string;
};

export type PasswordResetDTO = VerifyCodeDTO & {
	password: string;
};
export type UpdatePasswordDTO = {
	oldPassword: string;
	password: string;
};

type GenericSignupDTO = {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	country?: string;
	refInfo?: {
		whereHearAboutVadio?: string;
	};
};

export type SignupDTO = GenericSignupDTO & {
	invitationId?: string;
	code: string;
};

export type SignupInvitedUserDTO = GenericSignupDTO & {
	companyID: string;
};

export type LogoutDTO = {
	fcmToken?: string;
};

export type AcceptInvitationDTO = {
	invitationId?: string;
};

export type QueryCallbacks<T = any> = {
	onSuccess?: (data: T) => void;
	onError?: (error?: any) => void;
};
