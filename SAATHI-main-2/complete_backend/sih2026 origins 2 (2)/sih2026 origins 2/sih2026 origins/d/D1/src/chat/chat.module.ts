import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { ChatService } from './services/chat.service';
import { SseProxyService } from './services/sse-proxy.service';
import { IndicService } from './services/indic.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message])],
  controllers: [ChatController],
  providers: [ChatService, SseProxyService, IndicService],
  exports: [ChatService, SseProxyService, IndicService],
})
export class ChatModule {}
