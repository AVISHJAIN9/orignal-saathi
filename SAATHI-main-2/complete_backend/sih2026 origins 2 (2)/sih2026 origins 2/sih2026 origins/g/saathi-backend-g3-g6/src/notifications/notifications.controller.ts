import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import {
  NotificationsService
} from './notifications.service';
import {
  ListNotificationsDto
} from './dto/list-notifications.dto';
import {
  JwtAuthGuard
} from '../common/auth/jwt-auth.guard';
import {
  CurrentUser
} from '../common/auth/current-user.decorator';
import {
  CurrentUser as CurrentUserType
} from '../common/auth/current-user.interface';
import {
  Notification
} from './notification.entity';

@ApiTags(
  'notifications'
)
@ApiBearerAuth(
)
@Controller(
  'notifications'
)
@UseGuards(
  JwtAuthGuard
)
export class NotificationsController {

  constructor(
    private readonly notificationsService: NotificationsService
  ) {

  }

  @Get(
  )
  @ApiOperation(
    {
      summary: 'List cursor-paginated notifications for current user'
    }
  )
  async list(
    @CurrentUser(
    )
    authenticatedUser: CurrentUserType,
    @Query(
    )
    queryDto: ListNotificationsDto
  ): Promise<
    {
      items: Notification[];
      nextCursor: string | null;
    }
  > {

    return this.notificationsService.listForUser(
      authenticatedUser.id,
      queryDto
    );

  }

  @Get(
    'unread-count'
  )
  @ApiOperation(
    {
      summary: 'Get total unread notification count for current user'
    }
  )
  async unreadCount(
    @CurrentUser(
    )
    authenticatedUser: CurrentUserType
  ): Promise<
    {
      count: number;
    }
  > {

    const countValue = await this.notificationsService.unreadCount(
      authenticatedUser.id
    );

    return {
      count: countValue
    };

  }

  @Patch(
    ':id/read'
  )
  @ApiOperation(
    {
      summary: 'Mark single notification as read'
    }
  )
  async markRead(
    @CurrentUser(
    )
    authenticatedUser: CurrentUserType,
    @Param(
      'id',
      ParseUUIDPipe
    )
    notificationIdString: string
  ): Promise<
    Notification
  > {

    return this.notificationsService.markRead(
      notificationIdString,
      authenticatedUser.id
    );

  }

  @Patch(
    'read-all'
  )
  @ApiOperation(
    {
      summary: 'Mark all notifications as read for current user'
    }
  )
  async markAllRead(
    @CurrentUser(
    )
    authenticatedUser: CurrentUserType
  ): Promise<
    {
      updated: number;
    }
  > {

    return this.notificationsService.markAllRead(
      authenticatedUser.id
    );

  }

}
