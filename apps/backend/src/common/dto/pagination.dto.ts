import { tags } from 'typia';

export interface PaginationDto {
    total: number;
    current: number;
    next: number;
    previous: number;
}

export type PaginationPageOnlyQueryDto = {
    page?: number & tags.Minimum<1>;
    pageSize?: number & tags.Minimum<1>;
};

export type PaginationQueryDto = PaginationPageOnlyQueryDto & {
    search?: string;
    sortBy?: string;
    sort?: 'asc' | 'desc';
};

export type PaginatedDto<T> = {
    items: T[];
    pagination: PaginationDto;
};

export const resetPageOnlyQuery = (query: PaginationPageOnlyQueryDto) => {
    return {
        page: query.page ? query.page - 1 : 0,
        pageSize: query.pageSize || 20,
    };
};

export const resetPaginationQuery = (query: PaginationQueryDto): Required<PaginationQueryDto> => {
    return {
        ...resetPageOnlyQuery(query),
        search: query.search || '',
        sortBy: query.sortBy || 'createdAt',
        sort: query.sort || 'desc',
    } as Required<PaginationQueryDto>;
};

export const paginatedData = <I>(items: I[], total: number, query: Required<PaginationQueryDto>) => {
    const newQuery = { ...query }; // to be safe cloned
    newQuery.page += 1;

    return {
        items,
        pagination: {
            total,
            current: newQuery.page, // as query.page starts from 0
            previous: newQuery.page === 1 ? 1 : newQuery.page - 1,
            next: total > newQuery.page * newQuery.pageSize ? newQuery.page + 1 : newQuery.page,
        },
    };
};
