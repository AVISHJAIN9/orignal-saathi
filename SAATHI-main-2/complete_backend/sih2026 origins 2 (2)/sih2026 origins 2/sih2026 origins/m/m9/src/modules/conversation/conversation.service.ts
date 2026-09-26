import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message, CitationPayload } from './entities/message.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);

  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  /**
   * Create a new chat conversation session.
   */
  async createConversation(dto: CreateConversationDto): Promise<Conversation> {
    const conversation = this.conversationRepo.create({
      title: dto.title || 'New BIS Consultation',
      userId: dto.userId,
    });

    const saved = await this.conversationRepo.save(conversation);
    this.logger.log(`Created conversation ${saved.id} for user: ${dto.userId || 'anonymous'}`);

    if (dto.initialMessage) {
      await this.saveMessage(saved.id, 'user', dto.initialMessage);
    }

    return this.getConversation(saved.id);
  }

  /**
   * Retrieve a conversation session with its complete message history.
   * Enforces user ownership verification if requestingUserId is provided.
   */
  async getConversation(id: string, requestingUserId?: string): Promise<Conversation> {
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
      throw new NotFoundException(`Conversation with ID ${id} not found.`);
    }

    if (
      requestingUserId &&
      conversation.userId &&
      conversation.userId !== requestingUserId
    ) {
      throw new ForbiddenException(
        `Access denied: You do not have permission to access conversation ${id}.`,
      );
    }

    return conversation;
  }

  /**
   * List all conversations with optional userId filter.
   */
  async listConversations(userId?: string): Promise<Conversation[]> {
    const query = this.conversationRepo
      .createQueryBuilder('conv')
      .leftJoinAndSelect('conv.messages', 'msg')
      .orderBy('conv.updatedAt', 'DESC')
      .addOrderBy('msg.createdAt', 'ASC');

    if (userId) {
      query.where('conv.userId = :userId', { userId });
    }

    return query.getMany();
  }

  /**
   * Delete a conversation and all cascaded messages.
   * Enforces user ownership verification if requestingUserId is provided.
   */
  async deleteConversation(id: string, requestingUserId?: string): Promise<void> {
    const conversation = await this.conversationRepo.findOne({ where: { id } });
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found.`);
    }

    if (
      requestingUserId &&
      conversation.userId &&
      conversation.userId !== requestingUserId
    ) {
      throw new ForbiddenException(
        `Access denied: You do not have permission to delete conversation ${id}.`,
      );
    }

    const result = await this.conversationRepo.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Conversation with ID ${id} not found.`);
    }
    this.logger.log(`Deleted conversation ${id}`);
  }

  /**
   * Save a single message in a conversation.
   */
  async saveMessage(
    conversationId: string,
    sender: 'user' | 'assistant',
    content: string,
    citations: CitationPayload[] = [],
    confidence?: number,
    isDeclined: boolean = false,
  ): Promise<Message> {
    // Verify conversation exists
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation ${conversationId} not found.`);
    }

    const message = this.messageRepo.create({
      conversationId,
      sender,
      content,
      citations: citations || [],
      confidence: confidence !== undefined ? confidence : null,
      isDeclined: Boolean(isDeclined),
    });

    const savedMessage = await this.messageRepo.save(message);

    // Update conversation updatedAt timestamp
    await this.conversationRepo.update(conversationId, {
      updatedAt: new Date(),
    });

    return savedMessage;
  }

  /**
   * Fetch recent chat history (e.g. last 5 turns) for context window resolution.
   */
  async getRecentHistory(conversationId: string, limit: number = 5): Promise<Message[]> {
    return this.messageRepo.find({
      where: { conversationId },
      order: { createdAt: 'DESC' },
      take: limit,
    }).then((messages) => messages.reverse());
  }

  /**
   * Auto-update conversation title from first user query if still default.
   */
  async updateTitleIfDefault(conversationId: string, queryText: string): Promise<void> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });
    if (conversation && conversation.title === 'New BIS Consultation') {
      const newTitle = queryText.length > 50 ? `${queryText.substring(0, 47)}...` : queryText;
      await this.conversationRepo.update(conversationId, { title: newTitle });
    }
  }
}
