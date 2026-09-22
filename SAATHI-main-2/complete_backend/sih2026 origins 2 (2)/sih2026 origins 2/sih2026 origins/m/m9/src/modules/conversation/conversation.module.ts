import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { SseProxyService } from './sse-proxy.service';
import { RedisSessionStore } from '../session/redis-session.store';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
    HttpModule,
  ],
  controllers: [ConversationController],
  // Phase 4.3: RedisSessionStore replaces any in-process session Maps so
  // multi-turn context ("what about hallmarking for that one?") resolves
  // correctly even when load-balanced across multiple D1 / M9 replicas.
  providers: [ConversationService, SseProxyService, RedisSessionStore],
  exports: [ConversationService, SseProxyService, RedisSessionStore],
})
export class ConversationModule {}
