import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatService } from '../src/chat/services/chat.service';
import { Conversation } from '../src/chat/entities/conversation.entity';
import { Message, MessageRole } from '../src/chat/entities/message.entity';
import { NotFoundException } from '@nestjs/common';

describe('ChatService', () => {
  let service: ChatService;
  let conversationRepo: any;
  let messageRepo: any;

  const mockConversation: Partial<Conversation> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: 'test-user',
    title: 'Test Conversation',
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: [],
  };

  const mockMessage: Partial<Message> = {
    id: '987fcdeb-51a2-43d7-9876-543210987654',
    conversationId: '123e4567-e89b-12d3-a456-426614174000',
    role: MessageRole.USER,
    content: 'What is IS 10500?',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    conversationRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((entity) => Promise.resolve({ id: '123', ...entity })),
      findOne: jest.fn().mockResolvedValue(mockConversation),
      find: jest.fn().mockResolvedValue([mockConversation]),
      remove: jest.fn().mockResolvedValue(mockConversation),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      createQueryBuilder: jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockConversation]),
      }),
    };

    messageRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((entity) => Promise.resolve({ id: 'msg-123', ...entity })),
      findOne: jest.fn().mockResolvedValue(mockMessage),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
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

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a conversation', async () => {
    const res = await service.createConversation({ title: 'New chat', userId: 'user-1' });
    expect(res).toBeDefined();
    expect(conversationRepo.create).toHaveBeenCalled();
  });

  it('should get a conversation by id', async () => {
    const res = await service.getConversation('123e4567-e89b-12d3-a456-426614174000');
    expect(res).toBeDefined();
    expect(res.id).toEqual(mockConversation.id);
  });

  it('should throw NotFoundException if conversation does not exist', async () => {
    conversationRepo.findOne.mockResolvedValueOnce(null);
    await expect(service.getConversation('non-existent')).rejects.toThrow(NotFoundException);
  });

  it('should save user message and create assistant placeholder', async () => {
    const userMsg = await service.saveUserMessage('123e4567-e89b-12d3-a456-426614174000', 'Hello BIS');
    expect(userMsg).toBeDefined();

    const placeholder = await service.createAssistantPlaceholder('123e4567-e89b-12d3-a456-426614174000');
    expect(placeholder).toBeDefined();
  });

  it('should finalize assistant message', async () => {
    const finalized = await service.finalizeAssistantMessage(
      'msg-123',
      'Here is the BIS answer.',
      [{ claim: 'Clause 1', document_id: 'IS 10500' }],
      0.98,
      false,
    );
    expect(finalized).toBeDefined();
    expect(messageRepo.save).toHaveBeenCalled();
  });
});
