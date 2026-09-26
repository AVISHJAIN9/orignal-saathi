import {
  CustomDecorator,
  SetMetadata
} from '@nestjs/common';
import {
  Role
} from './role.enum';

export const ROLES_KEY = 'roles';

// Decorator gating admin-only endpoints
export const Roles = (
  ...rolesList: Role[]
): CustomDecorator<
  string
> => SetMetadata(
  ROLES_KEY,
  rolesList
);
