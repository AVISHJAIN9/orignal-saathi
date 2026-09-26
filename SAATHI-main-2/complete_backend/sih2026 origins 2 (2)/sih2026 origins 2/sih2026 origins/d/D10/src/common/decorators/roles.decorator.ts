import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../constants';

/**
 * Declares which roles may access a route/controller.
 * Used together with RolesGuard. Missing = no role restriction (any
 * resolved identity, including anonymous PUBLIC, may proceed).
 *
 * @example
 *   @Roles(Role.ADMIN)
 *   @UseGuards(DemoJwtAuthGuard, RolesGuard)
 *   @Delete(':id')
 *   remove(@Param('id') id: string) { ... }
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
