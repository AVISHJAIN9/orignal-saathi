import {
  Type
} from 'class-transformer';
import {
  IsInt,
  IsISO8601,
  IsOptional,
  Max,
  Min
} from 'class-validator';

export class ListNotificationsDto {

  @IsOptional(
  )
  @Type(
    (
    ) => Number
  )
  @IsInt(
  )
  @Min(
    1
  )
  @Max(
    100
  )
  limit?: number = 20;

  @IsOptional(
  )
  @IsISO8601(
  )
  before?: string;

}
