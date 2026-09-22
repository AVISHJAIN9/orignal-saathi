import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import { Role } from '../enums/role.enum';

/**
 * STANDALONE DEV/DEMO GUARD ONLY.
 *
 * D10 is scoped as backend-only RBAC + feature scoping "built on P1's
 * auth" - it does not own token issuance, password hashing, or session
 * cookies. This guard exists purely so the D10 module can be run,
 * demoed, and tested in isolation before it's wired into the real
 * NestJS monolith.
 *
 * TO LINK WITH P1: delete this file and register P1's real auth guard
 * (JWT for the API / session-cookie guard for the public chat) ahead of
 * RolesGuard and FeatureAccessGuard in main.ts / app.module.ts. As long
 * as it populates `req.user` with { id, role } (see
 * AuthenticatedRequest), nothing else in this module needs to change.
 */
@Injectable()
export class DemoJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      // No token: treat as anonymous PUBLIC rather than rejecting, so
      // public-facing routes (D1/D2/D3) keep working without a login.
      return true;
    }

    const token = header.slice('Bearer '.length);

    try {
      const secret =
        process.env.JWT_SECRET ?? 'dev-only-secret-do-not-use-in-prod';
      const payload = jwt.verify(token, secret) as {
        sub: string;
        role: Role;
        email?: string;
      };
      request.user = {
        id: payload.sub,
        role: payload.role,
        email: payload.email,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
