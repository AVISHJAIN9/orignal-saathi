import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class TriggerPurgeDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'retentionDays must be an integer' })
  @Min(1, { message: 'retentionDays must be at least 1 day' })
  @Max(3650, { message: 'retentionDays cannot exceed 3650 days (10 years)' })
  retentionDays?: number;
}
