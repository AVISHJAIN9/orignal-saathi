import {
  NotificationType
} from '../notification.entity';

export interface CreateNotificationDto {

  userId: string;
  type: NotificationType;
  message: string;
  metadata?: Record<
    string,
    unknown
  >;

}
