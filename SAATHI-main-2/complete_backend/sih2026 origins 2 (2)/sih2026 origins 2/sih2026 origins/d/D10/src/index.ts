/**
 * Barrel export so this feature can be imported as a package/module
 * into the main SAATHI monolith (e.g. via an npm/yarn workspace),
 * instead of copy-pasting files across repos.
 *
 *   import { RbacModule, ViewsModule, Role, Roles, RequireFeature } from '@saathi/d10-role-based-views';
 */
export * from './modules/rbac/rbac.module';
export * from './modules/rbac/rbac.service';
export * from './modules/views/views.module';
export * from './modules/users/users.module';
export * from './modules/users/users.service';
export * from './modules/users/entities/user.entity';
export * from './common/enums/role.enum';
export * from './common/decorators/roles.decorator';
export * from './common/decorators/require-feature.decorator';
export * from './common/decorators/current-user.decorator';
export * from './common/guards/roles.guard';
export * from './common/guards/feature-access.guard';
export * from './common/middleware/feature-scope.middleware';
export * from './common/interfaces/authenticated-request.interface';
export * from './config/feature-access.config';
