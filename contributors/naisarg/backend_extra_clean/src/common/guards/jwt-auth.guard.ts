import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from './public.decorator';

const DEV_JWT_SECRET = 'dev-saathi-insecure-jwt-secret-do-not-use-in-prod-2026';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] || request.headers['Authorization'] || '';

    // Fast-path DEV_BYPASS in non-production environments
    if (process.env.AUTH_DEV_BYPASS === 'true' && process.env.NODE_ENV !== 'production') {
      request.user = { id: 'usr-dev-001', role: 'ADMIN', email: 'dev@saathi.gov.in' };
      return true;
    }

    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header. Expected Bearer token.');
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      throw new UnauthorizedException('Bearer token string cannot be empty.');
    }

    const secret = process.env.JWT_SECRET || DEV_JWT_SECRET;
    try {
      const decoded = jwt.verify(token, secret, {
        algorithms: ['HS256'] // Explicitly pin HS256 to prevent alg:none and RS256->HS256 algorithm confusion
      });
      request.user = decoded;
      return true;
    } catch (err: any) {
      this.logger.warn(`JWT verification rejected: ${err.message}`);
      throw new UnauthorizedException(`Invalid or expired token: ${err.message}`);
    }
  }
}
