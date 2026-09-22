import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FEATURE_KEY } from '../constants';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

/**
 * Enforces @RequireFeature(id) against req.allowedFeatures, which
 * FeatureScopeMiddleware attaches per-request. Kept separate from
 * RolesGuard because a feature can be scoped independently of role -
 * e.g. temporarily disabling X6 for everyone via `globallyDisabled`
 * without touching any @Roles() decorator on X6's own controller.
 */
@Injectable()
export class FeatureAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const featureId = this.reflector.getAllAndOverride<string | undefined>(
      FEATURE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!featureId) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const allowed = request.allowedFeatures ?? [];

    if (!allowed.includes(featureId)) {
      throw new ForbiddenException(
        `Feature '${featureId}' is not enabled for this account.`,
      );
    }

    return true;
  }
}
