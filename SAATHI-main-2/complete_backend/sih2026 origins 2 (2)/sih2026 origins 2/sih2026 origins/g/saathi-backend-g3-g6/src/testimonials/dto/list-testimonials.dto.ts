import {
  ApiPropertyOptional
} from '@nestjs/swagger';
import {
  Type
} from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  Max,
  Min
} from 'class-validator';

export class ListTestimonialsDto {

  @ApiPropertyOptional(
    {
      default: 20,
      minimum: 1,
      maximum: 100,
      description: 'Maximum items to return'
    }
  )
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

  @ApiPropertyOptional(
    {
      default: 0,
      minimum: 0,
      description: 'Offset for pagination'
    }
  )
  @IsOptional(
  )
  @Type(
    (
    ) => Number
  )
  @IsInt(
  )
  @Min(
    0
  )
  offset?: number = 0;

  @ApiPropertyOptional(
    {
      enum: [
        'approved',
        'pending',
        'all'
      ],
      default: 'approved',
      description: 'Filter approval status (admin only)'
    }
  )
  @IsOptional(
  )
  @IsIn(
    [
      'approved',
      'pending',
      'all'
    ]
  )
  status?: 'approved' | 'pending' | 'all' = 'approved';

}
