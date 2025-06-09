export type UpdateProfileDTO = {
    firstName?: string | null;
    lastName?: string | null;
    gender?: string | null;
    jobStatus?: string | null;
    avatar?: string | null;
    phoneNumber?: string | null;
    dateOfBirth?: string | null;
};

export type UpdatePasswordDTO = {
    oldPassword: string;
    password: string;
};
