import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { EndUserType } from '@prisma/client';

export interface EndUserQueryDto extends PaginationQueryDto {
    userType?: EndUserType;
} 