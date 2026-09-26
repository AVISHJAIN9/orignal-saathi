import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, DEFAULT_ROLE } from '../constants';
import { Role } from '../enums/role.enum';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

/**
 * Enforces the @Roles(...) decorator against req.user.role.
 *
 * Must run AFTER an auth guard that populates req.user (P1's real guard
 * in production; DemoJwtAuthGuard here for standalone development).
 * If no @Roles() metadata is present on the handler or controller, the
 * route is left open to any resolved identity - PUBLIC included - so
 * this guard is safe to apply globally without locking down routes
 * that were never meant to be role-gated.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const role = request.user?.role ?? DEFAULT_ROLE;

    if (!requiredRoles.includes(role)) {
      throw new ForbiddenException(
        `Role '${role}' is not permitted to access this resource.`,
      );
    }

    return true;
  }
}
