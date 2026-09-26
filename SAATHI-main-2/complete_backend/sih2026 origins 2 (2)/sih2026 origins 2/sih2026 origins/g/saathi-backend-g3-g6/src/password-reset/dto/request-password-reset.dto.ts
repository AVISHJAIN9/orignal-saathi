import {
  ApiProperty
} from '@nestjs/swagger';
import {
  IsEmail
} from 'class-validator';

export class RequestPasswordResetDto {

  @ApiProperty(
    {
      description: 'Account email address for password reset request',
      example: 'user@saathi.gov.in'
    }
  )
  @IsEmail(
  )
  email!: string;

}
