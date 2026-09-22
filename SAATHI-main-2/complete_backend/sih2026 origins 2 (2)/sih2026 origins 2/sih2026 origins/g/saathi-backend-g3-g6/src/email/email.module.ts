import {
  Module
} from '@nestjs/common';
import {
  TypeOrmModule
} from '@nestjs/typeorm';
import {
  BullModule
} from '@nestjs/bullmq';
import {
  ConfigModule
} from '@nestjs/config';
import {
  EmailLog
} from './email-log.entity';
import {
  EmailService,
  EMAIL_QUEUE,
  EMAIL_DLQ
} from './email.service';
import {
  EmailProcessor
} from './email.processor';
import {
  mailTransportProvider
} from './mail-transport.provider';

@Module(
  {
    imports: [
      ConfigModule,
      TypeOrmModule.forFeature(
        [
          EmailLog
        ]
      ),
      BullModule.registerQueue(
        {
          name: EMAIL_QUEUE
        },
        {
          name: EMAIL_DLQ
        }
      )
    ],
    providers: [
      EmailService,
      EmailProcessor,
      mailTransportProvider
    ],
    exports: [
      EmailService
    ]
  }
)
export class EmailModule {

}
