import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import {
  Reflector
} from '@nestjs/core';
import {
  ROLES_KEY
} from './roles.decorator';
import {
  Role
} from './role.enum';
import {
  CurrentUser
} from './current-user.interface';

// Role-based access control guard for admin routes
@Injectable(
)
export class RolesGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {

  }

  canActivate(
    executionContext: ExecutionContext
  ): boolean {

    const requiredRolesList = this.reflector.getAllAndOverride<
      Role[]
    >(
      ROLES_KEY,
      [
        executionContext.getHandler(
        ),
        executionContext.getClass(
        )
      ]
    );

    if (
      !requiredRolesList || requiredRolesList.length === 0
    ) {
      return true;
    }

    const incomingHttpRequest = executionContext.switchToHttp(
    ).getRequest<{
      user?: CurrentUser;
    }>(
    );
    const authenticatedUser = incomingHttpRequest.user;

    if (
      !authenticatedUser
    ) {
      return false;
    }

    return requiredRolesList.includes(
      authenticatedUser.role
    );

  }

}
