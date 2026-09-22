import {
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
import {
  InjectRepository
} from '@nestjs/typeorm';
import {
  IsNull,
  LessThan,
  Repository
} from 'typeorm';
import to from 'await-to-js';
import {
  Notification
} from './notification.entity';
import {
  CreateNotificationDto
} from './dto/create-notification.dto';
import {
  ListNotificationsDto
} from './dto/list-notifications.dto';

@Injectable(
)
export class NotificationsService {

  private readonly logger = new Logger(
    NotificationsService.name
  );

  constructor(
    @InjectRepository(
      Notification
    )
    private readonly notificationsRepository: Repository<
      Notification
    >
  ) {

  }

  async create(
    createDto: CreateNotificationDto
  ): Promise<
    Notification
  > {

    let metadataRecord: Record<
      string,
      unknown
    > | null = null;
    if (
      createDto.metadata
    ) {
      metadataRecord = createDto.metadata;
    } else {
      metadataRecord = null;
    }

    const notificationEntity = this.notificationsRepository.create(
      {
        userId: createDto.userId,
        type: createDto.type,
        message: createDto.message,
        metadata: metadataRecord
      }
    );

    const [
      saveError,
      savedNotificationRecord
    ] = await to(
      this.notificationsRepository.save(
        notificationEntity
      )
    );

    if (
      saveError || !savedNotificationRecord
    ) {
      this.logger.error(
        `Failed to save notification for user ${createDto.userId}`
      );
      throw saveError;
    }

    return savedNotificationRecord;

  }

  // Cursor-paginated notification listing for user
  async listForUser(
    targetUserId: string,
    queryDto: ListNotificationsDto
  ): Promise<
    {
      items: Notification[];
      nextCursor: string | null;
    }
  > {

    const whereConditions: Record<
      string,
      unknown
    > = {
      userId: targetUserId
    };

    if (
      queryDto.before
    ) {
      whereConditions.createdAt = LessThan(
        new Date(
          queryDto.before
        )
      );
    }

    const queryLimit = queryDto.limit ?? 20;

    const [
      fetchError,
      fetchedItemsList
    ] = await to(
      this.notificationsRepository.find(
        {
          where: whereConditions as never,
          order: {
            createdAt: 'DESC'
          },
          take: queryLimit + 1
        }
      )
    );

    if (
      fetchError || !fetchedItemsList
    ) {
      this.logger.error(
        `Failed to fetch notifications for user ${targetUserId}`
      );
      throw fetchError;
    }

    const hasMoreItems = fetchedItemsList.length > queryLimit;
    let pageItemsList: Notification[] = [];
    if (
      hasMoreItems
    ) {
      pageItemsList = fetchedItemsList.slice(
        0,
        -1
      );
    } else {
      pageItemsList = fetchedItemsList;
    }

    let nextCursorString: string | null = null;
    if (
      hasMoreItems && pageItemsList.length > 0
    ) {
      nextCursorString = pageItemsList[
        pageItemsList.length - 1
      ].createdAt.toISOString(
      );
    } else {
      nextCursorString = null;
    }

    return {
      items: pageItemsList,
      nextCursor: nextCursorString
    };

  }

  async unreadCount(
    targetUserId: string
  ): Promise<
    number
  > {

    const [
      countError,
      unreadTotalCount
    ] = await to(
      this.notificationsRepository.count(
        {
          where: {
            userId: targetUserId,
            readAt: IsNull(
            )
          }
        }
      )
    );

    if (
      countError || unreadTotalCount === undefined
    ) {
      this.logger.error(
        `Failed counting unread notifications for user ${targetUserId}`
      );
      throw countError;
    }

    return unreadTotalCount;

  }

  async markRead(
    notificationId: string,
    targetUserId: string
  ): Promise<
    Notification
  > {

    const [
      lookupError,
      targetNotificationRecord
    ] = await to(
      this.notificationsRepository.findOne(
        {
          where: {
            id: notificationId,
            userId: targetUserId
          }
        }
      )
    );

    if (
      lookupError
    ) {
      throw lookupError;
    }

    if (
      !targetNotificationRecord
    ) {
      throw new NotFoundException(
        'Notification not found'
      );
    }

    if (
      !targetNotificationRecord.readAt
    ) {
      targetNotificationRecord.readAt = new Date(
      );
      const [
        saveError
      ] = await to(
        this.notificationsRepository.save(
          targetNotificationRecord
        )
      );

      if (
        saveError
      ) {
        this.logger.error(
          `Failed saving read status for notification ${notificationId}`
        );
        throw saveError;
      }
    }

    return targetNotificationRecord;

  }

  async markAllRead(
    targetUserId: string
  ): Promise<
    {
      updated: number;
    }
  > {

    const [
      updateError,
      updateResultRecord
    ] = await to(
      this.notificationsRepository.createQueryBuilder(
      ).update(
        Notification
      ).set(
        {
          readAt: (
          ) => 'now()'
        }
      ).where(
        'user_id = :userId AND read_at IS NULL',
        {
          userId: targetUserId
        }
      ).execute(
      )
    );

    if (
      updateError || !updateResultRecord
    ) {
      this.logger.error(
        `Failed marking all notifications read for user ${targetUserId}`
      );
      throw updateError;
    }

    let affectedRowsCount = 0;
    if (
      updateResultRecord.affected
    ) {
      affectedRowsCount = updateResultRecord.affected;
    } else {
      affectedRowsCount = 0;
    }

    return {
      updated: affectedRowsCount
    };

  }

}
