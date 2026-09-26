import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  MessageEvent,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { P1JwtAuthGuard } from '../common/guards/p1-jwt-auth.guard';
import { ChatService } from './services/chat.service';
import { SseProxyService } from './services/sse-proxy.service';
import { IndicService } from './services/indic.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { SaveDirectMessageDto } from './dto/save-message.dto';
import {
  ConversationDetailDto,
  ConversationSummaryDto,
  MessageResponseDto,
} from './dto/conversation-response.dto';

@ApiTags('D1 - Conversational Engine')
@ApiBearerAuth()
@UseGuards(P1JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly sseProxyService: SseProxyService,
    private readonly indicService: IndicService,
  ) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Create a new chat conversation session' })
  @ApiResponse({ status: 201, type: ConversationDetailDto })
  async createConversation(@Body() dto: CreateConversationDto) {
    return this.chatService.createConversation(dto);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'List chat conversation sessions' })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiResponse({ status: 200, type: [ConversationSummaryDto] })
  async listConversations(@Query('userId') userId?: string) {
    const conversations = await this.chatService.listConversations(userId);
    return conversations.map((c) => ({
      id: c.id,
      title: c.title,
      userId: c.userId,
      lastMessage:
        c.messages && c.messages.length > 0
          ? c.messages[c.messages.length - 1].content
          : null,
      messageCount: c.messages ? c.messages.length : 0,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get full conversation session and message history' })
  @ApiParam({ name: 'id', description: 'Conversation UUID' })
  @ApiResponse({ status: 200, type: ConversationDetailDto })
  async getConversation(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.chatService.getConversation(id);
  }

  @Delete('conversations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete conversation and all messages' })
  @ApiParam({ name: 'id', description: 'Conversation UUID' })
  @ApiResponse({ status: 204 })
  async deleteConversation(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.chatService.deleteConversation(id);
  }

  @Post('message')
  @ApiOperation({
    summary: 'Process incoming multi-lingual prompt with Sarvam Indic translation hand-off',
  })
  @ApiHeader({
    name: 'accept-language',
    required: false,
    description: 'Language code (e.g. hi-IN, ta-IN, auto)',
  })
  @ApiResponse({
    status: 200,
    description: 'Payload translated and dispatched to AI RAG pipeline',
  })
  async sendMessageWithTranslation(
    @Body()
    body: {
      message: string;
      conversationId?: string;
      language?: string;
      promptTemplate?: string;
    },
    @Headers('accept-language') acceptLanguage?: string,
  ) {
    const sourceLang = body.language || acceptLanguage || 'auto';

    // 1. Translate regional prompt to English using Sarvam AI if non-English
    let processedMessage = body.message;
    if (sourceLang !== 'en' && sourceLang !== 'en-IN') {
      processedMessage = await this.indicService.translateToEnglish(
        body.message,
        sourceLang,
      );
    }

    // 2. Ensure conversation session exists
    let conversationId = body.conversationId;
    if (!conversationId) {
      const newConv = await this.chatService.createConversation({
        title: body.message.slice(0, 60),
      });
      conversationId = newConv.id;
    }

    // 3. Dispatch to streaming or synchronous pipeline
    const dto: SendMessageDto = {
      query: processedMessage,
      userLanguage: sourceLang,
      promptTemplate: body.promptTemplate || 'standard_qa',
    };

    return {
      conversationId,
      originalMessage: body.message,
      translatedQuery: processedMessage,
      detectedLanguage: sourceLang,
      streamUrl: `/api/v1/chat/conversations/${conversationId}/messages/stream?query=${encodeURIComponent(processedMessage)}&userLanguage=${sourceLang}`,
    };
  }

  @Sse('conversations/:id/messages/stream')
  @ApiOperation({
    summary: 'Stream RAG assistant response via Server-Sent Events (SSE) (GET)',
  })
  @ApiParam({ name: 'id', description: 'Conversation UUID' })
  @ApiQuery({ name: 'query', description: 'User question/query', required: true })
  @ApiQuery({ name: 'userLanguage', required: false, example: 'en' })
  @ApiQuery({ name: 'promptTemplate', required: false, example: 'standard_qa' })
  async streamMessageGet(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query('query') query: string,
    @Query('userLanguage') userLanguage?: string,
    @Query('promptTemplate') promptTemplate?: string,
  ): Promise<Observable<MessageEvent>> {
    const dto: SendMessageDto = {
      query: query || 'Hello',
      userLanguage: userLanguage || 'en',
      promptTemplate: promptTemplate || 'standard_qa',
    };
    return this.sseProxyService.streamConversationMessage(id, dto);
  }

  @Post('conversations/:id/messages/stream')
  @ApiOperation({
    summary: 'Stream RAG assistant response via Server-Sent Events (SSE) (POST)',
  })
  @ApiParam({ name: 'id', description: 'Conversation UUID' })
  async streamMessagePost(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: SendMessageDto,
  ): Promise<Observable<MessageEvent>> {
    return this.sseProxyService.streamConversationMessage(id, dto);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Save a direct message turn without triggering RAG' })
  @ApiParam({ name: 'id', description: 'Conversation UUID' })
  @ApiResponse({ status: 201, type: MessageResponseDto })
  async saveDirectMessage(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: SaveDirectMessageDto,
  ) {
    return this.chatService.saveDirectMessage(
      id,
      dto.sender,
      dto.content,
      dto.citations,
      dto.confidence,
      dto.isDeclined,
    );
  }
}
