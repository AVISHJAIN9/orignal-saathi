import {
  ApiProperty,
  ApiPropertyOptional
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateTestimonialDto {

  @ApiProperty(
    {
      description: 'Author name of the testimonial',
      minLength: 2,
      maxLength: 120,
      example: 'Rajesh Kumar'
    }
  )
  @IsString(
  )
  @MinLength(
    2
  )
  @MaxLength(
    120
  )
  name!: string;

  @ApiPropertyOptional(
    {
      description: 'Author company or organization',
      maxLength: 160,
      example: 'Apex Electronics MSME'
    }
  )
  @IsOptional(
  )
  @IsString(
  )
  @MaxLength(
    160
  )
  organization?: string;

  @ApiProperty(
    {
      description: 'Testimonial quote text',
      minLength: 10,
      maxLength: 2000,
      example: 'SAATHI reduced our BIS compliance lookup time from weeks to minutes.'
    }
  )
  @IsString(
  )
  @MinLength(
    10
  )
  @MaxLength(
    2000
  )
  quote!: string;

  @ApiPropertyOptional(
    {
      description: 'Flag determining if testimonial is pre-approved for public display',
      default: false
    }
  )
  @IsOptional(
  )
  @IsBoolean(
  )
  approved?: boolean;

}
