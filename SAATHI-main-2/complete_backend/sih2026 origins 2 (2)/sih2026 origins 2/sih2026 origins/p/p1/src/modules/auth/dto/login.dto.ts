import { IsNotEmpty, IsOptional, IsString, MinLength, IsEnum, IsEmail } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class AnonymousLoginDto {
  @IsOptional()
  @IsString()
  device_id?: string;

  @IsOptional()
  client_meta?: Record<string, any>;
}

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be public, industry, or admin' })
  role?: UserRole;
}

export interface SanitizedUser {
  id: string;
  username: string;
  role: UserRole;
  email?: string;
  isAnonymous?: boolean;
}

export interface AuthResponseDto {
  access_token: string;
  token_type: string;
  expires_in: string;
  user: SanitizedUser;
}
