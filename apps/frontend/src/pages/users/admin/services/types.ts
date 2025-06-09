import { GenericGetApiDTO } from '@/lib/dto/QueryDto';

export type GetUsersDTO = GenericGetApiDTO & {
    panelType?: string;
    role?: string;
    statusFilter?: string;
};
