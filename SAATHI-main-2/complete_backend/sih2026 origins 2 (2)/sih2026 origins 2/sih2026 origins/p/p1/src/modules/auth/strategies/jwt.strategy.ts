import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../entities/user.entity';

export interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
  isAnonymous?: boolean;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  userId: string;
  username: string;
  role: UserRole;
  isAnonymous: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'super_secret_jwt_key_saathi_bis_platform_change_in_production',
      ),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid or expired token payload');
    }

    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role || UserRole.PUBLIC,
      isAnonymous: payload.isAnonymous ?? false,
    };
  }
}
