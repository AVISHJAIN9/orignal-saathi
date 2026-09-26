import { IsString, Length } from 'class-validator';

export class DisableTwoFactorDto {
  // Either a 6-digit TOTP code or an 8-character backup code — the service
  // tries TOTP first, then falls back to backup codes.
  @IsString()
  @Length(6, 10)
  code: string;
}
