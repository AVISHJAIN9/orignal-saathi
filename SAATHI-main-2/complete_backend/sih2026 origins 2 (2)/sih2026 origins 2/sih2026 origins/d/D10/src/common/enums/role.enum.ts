export enum Role {
  PUBLIC = 'public',
  INDUSTRY = 'industry',
  ADMIN = 'admin',
}

/**
 * Ordered by privilege, lowest first. Kept for callers that want a
 * "minimum role" check instead of an explicit allow-list.
 */
export const ROLE_HIERARCHY: Role[] = [Role.PUBLIC, Role.INDUSTRY, Role.ADMIN];

export function roleAtLeast(role: Role, minimum: Role): boolean {
  return ROLE_HIERARCHY.indexOf(role) >= ROLE_HIERARCHY.indexOf(minimum);
}
