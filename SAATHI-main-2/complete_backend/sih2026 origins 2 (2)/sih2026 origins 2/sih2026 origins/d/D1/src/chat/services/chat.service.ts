import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { CitationItem, Message, MessageRole } from '../entities/message.entity';
import { CreateConversationDto } from '../dto/create-conversation.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async createConversation(dto: CreateConversationDto): Promise<Conversation> {
    const conversation = this.conversationRepo.create({
      userId: dto.userId || 'anonymous',
      title: dto.title || null,
    });
    return this.conversationRepo.save(conversation);
  }

  async getConversation(id: string): Promise<Conversation> {
    const conversation = await this.conversationRepo.findOne({
      where: { id },
      relations: ['messages'],
      order: {
        messages: {
          createdAt: 'ASC',
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return conversation;
  }

  async listConversations(userId?: string): Promise<Conversation[]> {
    const query = this.conversationRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.messages', 'm')
      .orderBy('c.updatedAt', 'DESC')
      .addOrderBy('m.createdAt', 'ASC');

    if (userId) {
      query.where('c.userId = :userId', { userId });
    }

    return query.getMany();
  }

  async deleteConversation(id: string): Promise<void> {
    const conversation = await this.conversationRepo.findOne({ where: { id } });
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    await this.conversationRepo.remove(conversation);
  }

  async saveUserMessage(
    conversationId: string,
    content: string,
  ): Promise<Message> {
    const conversation = await this.getConversation(conversationId);

    // Auto-derive title if not set
    if (!conversation.title) {
      const truncated = content.slice(0, 80).trim();
      conversation.title = truncated.length > 0 ? `${truncated}...` : 'New Conversation';
      await this.conversationRepo.save(conversation);
    }

    const message = this.messageRepo.create({
      conversationId,
      role: MessageRole.USER,
      content,
    });

    const saved = await this.messageRepo.save(message);

    // Update conversation updatedAt
    conversation.updatedAt = new Date();
    await this.conversationRepo.save(conversation);

    return saved;
  }

  async createAssistantPlaceholder(conversationId: string): Promise<Message> {
    const placeholder = this.messageRepo.create({
      conversationId,
      role: MessageRole.ASSISTANT,
      content: '',
      confidence: null,
      isDeclined: false,
    });
    return this.messageRepo.save(placeholder);
  }

  async finalizeAssistantMessage(
    messageId: string,
    content: string,
    citations?: CitationItem[],
    confidence?: number,
    isDeclined?: boolean,
  ): Promise<Message> {
    const message = await this.messageRepo.findOne({ where: { id: messageId } });
    if (!message) {
      throw new NotFoundException(`Message placeholder ${messageId} not found`);
    }

    message.content = content;
    message.citations = citations || null;
    message.confidence = confidence !== undefined ? confidence : null;
    message.isDeclined = !!isDeclined;

    const saved = await this.messageRepo.save(message);

    // Update conversation timestamp
    await this.conversationRepo.update(message.conversationId, {
      updatedAt: new Date(),
    });

    return saved;
  }

  async saveDirectMessage(
    conversationId: string,
    role: MessageRole,
    content: string,
    citations?: CitationItem[],
    confidence?: number,
    isDeclined?: boolean,
  ): Promise<Message> {
    await this.getConversation(conversationId);

    const message = this.messageRepo.create({
      conversationId,
      role,
      content,
      citations: citations || null,
      confidence: confidence !== undefined ? confidence : null,
      isDeclined: !!isDeclined,
    });

    const saved = await this.messageRepo.save(message);

    await this.conversationRepo.update(conversationId, {
      updatedAt: new Date(),
    });

    return saved;
  }
}
