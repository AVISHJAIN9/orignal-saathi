import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import { DEFAULT_ROLE } from '../constants';
import { featureAccessConfig } from '../../config/feature-access.config';

/**
 * Attaches `req.allowedFeatures` for the resolved identity before any
 * route handler runs, so:
 *  - FeatureAccessGuard can do a cheap array check instead of
 *    recomputing the role -> feature map on every request;
 *  - ViewsService can hand the same list straight to the frontend for
 *    D10's role-based view rendering ("same data, different lens").
 *
 * Must run after P1's auth guard/middleware has populated req.user;
 * falls back to Role.PUBLIC for anonymous traffic rather than
 * rejecting the request, since most of SAATHI (D1/D2/D3) is meant to
 * work without a login wall.
 */
@Injectable()
export class FeatureScopeMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
    const role = req.user?.role ?? DEFAULT_ROLE;
    const disabled = new Set(featureAccessConfig.globallyDisabled);
    req.allowedFeatures = (featureAccessConfig.map[role] ?? []).filter(
      (featureId) => !disabled.has(featureId),
    );
    next();
  }
}
