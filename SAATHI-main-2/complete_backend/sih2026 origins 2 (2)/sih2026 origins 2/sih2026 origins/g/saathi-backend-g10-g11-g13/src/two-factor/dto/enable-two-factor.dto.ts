import { IsString, Length } from 'class-validator';

export class EnableTwoFactorDto {
  // 6-digit TOTP code confirming the user actually scanned the QR / added
  // the pending secret to their authenticator app.
  @IsString()
  @Length(6, 6)
  code: string;
}
