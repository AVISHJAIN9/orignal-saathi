import {
  ExecutionContext,
  createParamDecorator
} from '@nestjs/common';
import {
  CurrentUser as CurrentUserType
} from './current-user.interface';

// Parameter decorator extracting CurrentUser from request
export const CurrentUser = createParamDecorator(
  (
    _dataOption: unknown,
    executionContext: ExecutionContext
  ): CurrentUserType | undefined => {

    const incomingHttpRequest = executionContext.switchToHttp(
    ).getRequest<{
      user?: CurrentUserType;
    }>(
    );

    return incomingHttpRequest.user;

  }
);
