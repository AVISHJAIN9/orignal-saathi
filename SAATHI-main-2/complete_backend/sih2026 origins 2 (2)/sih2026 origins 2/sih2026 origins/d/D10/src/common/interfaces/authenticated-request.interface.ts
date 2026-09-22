import { Request } from 'express';
import { Role } from '../enums/role.enum';

/**
 * Shape D10 expects on `req.user` once upstream auth (P1) has run.
 * P1 owns JWT verification and session-cookie handling; D10 only reads
 * the identity it leaves behind. Swap DemoJwtAuthGuard for P1's real
 * guard/middleware in production - as long as it populates this shape,
 * everything downstream (RolesGuard, FeatureAccessGuard, ViewsService)
 * keeps working unmodified.
 */
export interface RequestUser {
  id: string;
  role: Role;
  email?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: RequestUser;
  allowedFeatures?: string[];
}
