import { makeQuery } from '@/lib/makeQuery/makeQuery';
import { superAdminService } from '@portal/portal-api-client';
import type {
    GetSuperAdminSmsStatsQueryParams,
    GetSuperAdminSmsStatsQueryResponse,
    GetSuperAdminSmsStatsSummaryQueryParams,
    GetSuperAdminSmsStatsSummaryQueryResponse,
} from '@portal/portal-api-client';

export const smsStatsService = {
    // Get SMS stats with pagination
    useGetSmsStats: makeQuery<
        GetSuperAdminSmsStatsQueryResponse,
        [GetSuperAdminSmsStatsQueryParams?]
    >(
        (params) => superAdminService.getSuperAdminSmsStats(params),
        ['super-admin', 'sms-stats']
    ),

    // Get SMS stats summary
    useGetSmsStatsSummary: makeQuery<
        GetSuperAdminSmsStatsSummaryQueryResponse,
        [GetSuperAdminSmsStatsSummaryQueryParams?]
    >(
        (params) => superAdminService.getSuperAdminSmsStatsSummary(params),
        ['super-admin', 'sms-stats', 'summary']
    ),
}; 