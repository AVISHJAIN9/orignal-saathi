import { Role } from './role.enum';

/**
 * Shape P1's JWT strategy is expected to attach to `request.user`.
 * If P1's actual payload differs, adjust this interface only —
 * every consumer in this module goes through it.
 */
export interface CurrentUser {
  id: string;
  email: string;
  role: Role;
}
