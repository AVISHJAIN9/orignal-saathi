import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Headers,
  Req,
  Sse,
  HttpCode,
  HttpStatus,
  MessageEvent,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { ConversationService } from './conversation.service';
import { SseProxyService } from './sse-proxy.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { SaveDirectMessageDto } from './dto/save-message.dto';
import {
  ConversationDetailDto,
  ConversationSummaryDto,
  MessageResponseDto,
} from './dto/conversation-response.dto';

@ApiTags('Conversations')
@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly sseProxyService: SseProxyService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new conversation session' })
  @ApiResponse({ status: 201, type: ConversationDetailDto })
  async createConversation(@Body() dto: CreateConversationDto) {
    return this.conversationService.createConversation(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all conversation sessions' })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiResponse({ status: 200, type: [ConversationSummaryDto] })
  async listConversations(@Query('userId') userId?: string) {
    const conversations = await this.conversationService.listConversations(userId);
    return conversations.map((c) => ({
      id: c.id,
      title: c.title,
      userId: c.userId,
      lastMessage: c.messages?.length > 0 ? c.messages[c.messages.length - 1].content : null,
      messageCount: c.messages?.length || 0,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get conversation session details and message history' })
  @ApiParam({ name: 'id', description: 'Conversation UUID' })
  @ApiQuery({ name: 'userId', required: false, description: 'User ID for ownership verification' })
  @ApiHeader({ name: 'x-user-id', required: false, description: 'User ID header for ownership verification' })
  @ApiResponse({ status: 200, type: ConversationDetailDto })
  async getConversation(
    @Param('id', new ParseUUIDPipe({ version: '4', optional: true })) id: string,
    @Query('userId') userId?: string,
    @Headers('x-user-id') headerUserId?: string,
    @Req() req?: any,
  ) {
    const requestingUserId = req?.user?.id || headerUserId || userId;
    return this.conversationService.getConversation(id, requestingUserId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete conversation and message history' })
  @ApiParam({ name: 'id', description: 'Conversation UUID' })
  @ApiQuery({ name: 'userId', required: false, description: 'User ID for ownership verification' })
  @ApiHeader({ name: 'x-user-id', required: false, description: 'User ID header for ownership verification' })
  @ApiResponse({ status: 204 })
  async deleteConversation(
    @Param('id', new ParseUUIDPipe({ version: '4', optional: true })) id: string,
    @Query('userId') userId?: string,
    @Headers('x-user-id') headerUserId?: string,
    @Req() req?: any,
  ) {
    const requestingUserId = req?.user?.id || headerUserId || userId;
    return this.conversationService.deleteConversation(id, requestingUserId);
  }

  @Sse(':id/messages/stream')
  @ApiOperation({ summary: 'Stream assistant answer via Server-Sent Events (SSE)' })
  @ApiParam({ name: 'id', description: 'Conversation UUID' })
  @ApiQuery({ name: 'query', description: 'User query string', required: true })
  @ApiQuery({ name: 'userLanguage', description: 'Target language code', required: false })
  @ApiQuery({ name: 'promptTemplate', description: 'standard_qa | msme_x11', required: false })
  @ApiHeader({ name: 'last-event-id', required: false, description: 'Last received SSE event ID for reconnection' })
  async streamMessage(
    @Param('id') id: string,
    @Query('query') query: string,
    @Query('userLanguage') userLanguage?: string,
    @Query('promptTemplate') promptTemplate?: string,
    @Headers('last-event-id') lastEventId?: string,
  ): Promise<Observable<MessageEvent>> {
    const dto: SendMessageDto = {
      query: query || 'Hello',
      userLanguage: userLanguage || 'en',
      promptTemplate: promptTemplate || 'standard_qa',
    };

    return this.sseProxyService.streamConversationMessage(id, dto, { lastEventId });
  }

  @Post(':id/messages/stream')
  @ApiOperation({ summary: 'Stream assistant answer via POST body SSE' })
  @ApiParam({ name: 'id', description: 'Conversation UUID' })
  @ApiHeader({ name: 'last-event-id', required: false, description: 'Last received SSE event ID for reconnection' })
  async streamMessagePost(
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
    @Headers('last-event-id') lastEventId?: string,
  ): Promise<Observable<MessageEvent>> {
    return this.sseProxyService.streamConversationMessage(id, dto, { lastEventId });
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Save a direct message without LLM generation (e.g. user note)' })
  @ApiParam({ name: 'id', description: 'Conversation UUID' })
  @ApiResponse({ status: 201, type: MessageResponseDto })
  async saveDirectMessage(
    @Param('id') id: string,
    @Body() dto: SaveDirectMessageDto,
  ) {
    return this.conversationService.saveMessage(
      id,
      dto.sender,
      dto.content,
      dto.citations,
      dto.confidence,
      dto.isDeclined,
    );
  }
}
