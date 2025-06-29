import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { tags } from "typia";

export interface SmsStatsQueryDto extends PaginationQueryDto {
    startDate?: string & tags.Format<"date-time">; // ISO datetime string
    endDate?: string & tags.Format<"date-time">;   // ISO datetime string
    messageType?: string; // Optional filter by message type (OTP, ADMIN_NOTIFICATION, etc.)
} 