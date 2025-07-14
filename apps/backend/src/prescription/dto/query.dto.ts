import { tags } from "typia";
import { PaginationQueryDto } from "../../common/dto/pagination.dto";

export interface PrescriptionQueryDto extends PaginationQueryDto {
    doctorId?: string;
    patientId?: string;
    animalType?: string;
    startDate?: string & tags.Format<"date-time">;
    endDate?: string & tags.Format<"date-time">;
    hasFollowUp?: boolean;
} 