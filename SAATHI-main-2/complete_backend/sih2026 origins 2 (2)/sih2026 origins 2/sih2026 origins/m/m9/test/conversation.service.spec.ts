import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ConversationService } from '../src/modules/conversation/conversation.service';
import { Conversation } from '../src/modules/conversation/entities/conversation.entity';
import { Message } from '../src/modules/conversation/entities/message.entity';

describe('ConversationService', () => {
  let service: ConversationService;
  let conversationRepo: any;
  let messageRepo: any;

  const mockConversation: Partial<Conversation> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Consultation',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: [],
  };

  const mockMessage: Partial<Message> = {
    id: 'msg-1',
    conversationId: '123e4567-e89b-12d3-a456-426614174000',
    sender: 'user',
    content: 'What is IS 10500?',
    citations: [],
    confidence: null,
    isDeclined: false,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    conversationRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockResolvedValue(mockConversation),
      findOne: jest.fn().mockResolvedValue(mockConversation),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      createQueryBuilder: jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockConversation]),
      })),
    };

    messageRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockResolvedValue(mockMessage),
      find: jest.fn().mockResolvedValue([mockMessage]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        {
          provide: getRepositoryToken(Conversation),
          useValue: conversationRepo,
        },
        {
          provide: getRepositoryToken(Message),
          useValue: messageRepo,
        },
      ],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createConversation', () => {
    it('should create and save a new conversation', async () => {
      const result = await service.createConversation({
        title: 'Drinking Water Inquiry',
        userId: 'user-123',
      });

      expect(conversationRepo.create).toHaveBeenCalledWith({
        title: 'Drinking Water Inquiry',
        userId: 'user-123',
      });
      expect(conversationRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockConversation);
    });

    it('should save initial message if provided', async () => {
      await service.createConversation({
        title: 'Inquiry',
        initialMessage: 'What is the standard for cement?',
      });

      expect(messageRepo.save).toHaveBeenCalled();
    });
  });

  describe('getConversation', () => {
    it('should return conversation when found', async () => {
      const result = await service.getConversation('123e4567-e89b-12d3-a456-426614174000');
      expect(conversationRepo.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockConversation);
    });

    it('should allow retrieval when matching userId is provided', async () => {
      const result = await service.getConversation('123e4567-e89b-12d3-a456-426614174000', 'user-1');
      expect(result).toEqual(mockConversation);
    });

    it('should throw ForbiddenException when requesting userId does not match owner', async () => {
      await expect(
        service.getConversation('123e4567-e89b-12d3-a456-426614174000', 'wrong-user'),
      ).rejects.toThrow('Access denied');
    });

    it('should throw NotFoundException when not found', async () => {
      conversationRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.getConversation('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('saveMessage', () => {
    it('should save a user message and update conversation timestamp', async () => {
      const result = await service.saveMessage(
        '123e4567-e89b-12d3-a456-426614174000',
        'user',
        'Hello BIS',
      );

      expect(messageRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          conversationId: '123e4567-e89b-12d3-a456-426614174000',
          sender: 'user',
          content: 'Hello BIS',
        }),
      );
      expect(messageRepo.save).toHaveBeenCalled();
      expect(conversationRepo.update).toHaveBeenCalled();
      expect(result).toEqual(mockMessage);
    });
  });

  describe('deleteConversation', () => {
    it('should delete existing conversation', async () => {
      await expect(service.deleteConversation('123e4567-e89b-12d3-a456-426614174000')).resolves.not.toThrow();
      expect(conversationRepo.delete).toHaveBeenCalledWith({ id: '123e4567-e89b-12d3-a456-426614174000' });
    });

    it('should throw ForbiddenException when delete requested by unauthorized user', async () => {
      await expect(
        service.deleteConversation('123e4567-e89b-12d3-a456-426614174000', 'unauthorized-user'),
      ).rejects.toThrow('Access denied');
    });

    it('should throw NotFoundException if conversation does not exist', async () => {
      conversationRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.deleteConversation('unknown-id')).rejects.toThrow(NotFoundException);
    });
  });
});
