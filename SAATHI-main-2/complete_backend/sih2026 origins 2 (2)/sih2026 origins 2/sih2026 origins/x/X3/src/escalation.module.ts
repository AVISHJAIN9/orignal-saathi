import { Module } from '@nestjs/common';
import { EscalationController } from './escalation.controller';
import { EscalationService } from './escalation.service';
import { HelpdeskRouter } from './helpdesk-router';
import { NotificationDispatcherService } from './notification-dispatcher.service';

@Module({
  controllers: [EscalationController],
  providers: [EscalationService, HelpdeskRouter, NotificationDispatcherService],
  exports: [EscalationService, HelpdeskRouter, NotificationDispatcherService],
})
export class EscalationModule {}
