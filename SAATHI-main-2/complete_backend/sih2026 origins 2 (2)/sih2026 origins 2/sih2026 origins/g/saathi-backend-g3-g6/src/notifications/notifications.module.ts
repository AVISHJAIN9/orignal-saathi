import {
  Module
} from '@nestjs/common';
import {
  TypeOrmModule
} from '@nestjs/typeorm';
import {
  Notification
} from './notification.entity';
import {
  NotificationsService
} from './notifications.service';
import {
  NotificationsController
} from './notifications.controller';
import {
  NotificationsListener
} from './events/notifications.listener';

@Module(
  {
    imports: [
      TypeOrmModule.forFeature(
        [
          Notification
        ]
      )
    ],
    controllers: [
      NotificationsController
    ],
    providers: [
      NotificationsService,
      NotificationsListener
    ],
    exports: [
      NotificationsService
    ]
  }
)
export class NotificationsModule {

}
