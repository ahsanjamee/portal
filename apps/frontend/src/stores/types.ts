export type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'VIEWER' | 'NORMAL_USER';
export type CompanyUserRole = 'ADMIN' | 'MEMBER' | 'OWNER';
export type UserEntity = {
    id: string;
    createdAt: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    avatar: string;
    authProvider: 'EMAIL' | 'GOOGLE' | 'FACEBOOK';
    authPanel: 'ADMIN' | 'SUPER_ADMIN';
    role: UserRole;
    language: 'en' | 'no';
    emailVerified: true;
    lastLoggedAt: string;
    lastActiveAt: string;
    about?: string;
    phoneNumber?: string;
};

type CompanyUserEntity = {
    id: string;
    createdAt: string;
    updatedAt: string;
    role: UserRole;
    userId: string;
    companyId: string;
};

type invitedPendingUserEntity = {
    invitationId: string;
    email: string;
    role: UserRole;
};

export type CompanyEntity = {
    users: CompanyUserEntity[];
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    subDomain: string;
    logo: string;
    isActive: boolean;
    isDeleted: boolean;
    invitedPendingUsers: invitedPendingUserEntity[];
};

export type InvitedPendingUserEntity = {
    email: string;
    role: CompanyUserRole;
    createdAt: string;
};

export type PlansUnion = 'FREE' | 'START' | 'STANDARD' | 'PREMIUM' | 'TRIAL';

export type SiteEntity = {
    users: CompanyUserEntity[];
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    domain: string;
    subDomain: string;
    logo: string;
    isActive: boolean;
    isDeleted: boolean;
    invitedPendingUsers: InvitedPendingUserEntity[];
    plan: PlansUnion;
    trialEndAt: string | null;
    needsBillingAddress: boolean;
};
