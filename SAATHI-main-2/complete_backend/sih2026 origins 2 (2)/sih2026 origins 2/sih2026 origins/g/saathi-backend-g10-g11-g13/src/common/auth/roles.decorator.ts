import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

export const ROLES_KEY = 'roles';

/**
 * @Roles(Role.ADMIN) on a controller method, used together with
 * JwtAuthGuard + RolesGuard, gates admin-only endpoints (e.g. G3 curation,
 * G4's credential updates are token-based rather than role-gated).
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
