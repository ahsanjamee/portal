export type CompanyEntity = {
    name: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    about: string | null;
    logo: string;
    userLimit: number;
    subDomain: string;
    authDomains: string[];
    activeUsers: number;
};

export type CreateCompanyRequest = {
    email: string;
    subDomain: string;
    authDomains: string[];
    userLimit: number;
    logo?: string;
    userFullName: string;
    companyName: string;
};
