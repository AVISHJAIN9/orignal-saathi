import {
  ApiProperty
} from '@nestjs/swagger';
import {
  IsString,
  Matches,
  MinLength
} from 'class-validator';

export class ConfirmPasswordResetDto {

  @ApiProperty(
    {
      description: 'Raw reset token string received via email'
    }
  )
  @IsString(
  )
  token!: string;

  @ApiProperty(
    {
      description: 'New password meeting complexity criteria',
      minLength: 10
    }
  )
  @IsString(
  )
  @MinLength(
    10
  )
  @Matches(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    {
      message: 'Password must contain upper, lower case letters and a number'
    }
  )
  newPassword!: string;

}
