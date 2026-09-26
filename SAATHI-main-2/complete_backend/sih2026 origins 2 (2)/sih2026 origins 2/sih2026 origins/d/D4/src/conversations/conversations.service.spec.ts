import {
  Test
} from '@nestjs/testing';
import {
  getRepositoryToken
} from '@nestjs/typeorm';
import {
  ConversationsService
} from './conversations.service';
import {
  Conversation
} from './entities/conversation.entity';
import {
  Message,
  MessageRole
} from './entities/message.entity';

// Builds a minimal Conversation row for tests with sane defaults
function makeConversation(
  overrides: Partial<
    Conversation
  >
): Conversation {

  return {
    id: 'id',
    userId: 'user-demo-1',
    title: 'Untitled',
    createdAt: new Date(
      '2026-01-01T00:00:00.000Z'
    ),
    updatedAt: new Date(
      '2026-01-01T00:00:00.000Z'
    ),
    messages: [
    ],
    ...overrides
  } as Conversation;

}

// A chainable fake for TypeORM QueryBuilder
function makeQueryBuilderMock(
  mockRows: Conversation[]
) {

  const queryBuilderMockObject = {
    where: jest.fn(
    ),
    andWhere: jest.fn(
    ),
    orderBy: jest.fn(
    ),
    addOrderBy: jest.fn(
    ),
    take: jest.fn(
    ),
    getMany: jest.fn(
    ).mockResolvedValue(
      mockRows
    )
  };

  queryBuilderMockObject.where.mockReturnValue(
    queryBuilderMockObject
  );
  queryBuilderMockObject.andWhere.mockReturnValue(
    queryBuilderMockObject
  );
  queryBuilderMockObject.orderBy.mockReturnValue(
    queryBuilderMockObject
  );
  queryBuilderMockObject.addOrderBy.mockReturnValue(
    queryBuilderMockObject
  );
  queryBuilderMockObject.take.mockReturnValue(
    queryBuilderMockObject
  );

  return queryBuilderMockObject;

}

describe(
  'ConversationsService',
  (
  ) => {

    let conversationsServiceInstance: ConversationsService;
    let conversationRepositoryMock: {
      createQueryBuilder: jest.Mock;
      findOne: jest.Mock;
    };
    let messageRepositoryMock: {
      find: jest.Mock;
    };

    beforeEach(
      async (
      ) => {

        conversationRepositoryMock = {
          createQueryBuilder: jest.fn(
          ),
          findOne: jest.fn(
          )
        };
        messageRepositoryMock = {
          find: jest.fn(
          )
        };

        const testingModuleRef = await Test.createTestingModule(
          {
            providers: [
              ConversationsService,
              {
                provide: getRepositoryToken(
                  Conversation
                ),
                useValue: conversationRepositoryMock
              },
              {
                provide: getRepositoryToken(
                  Message
                ),
                useValue: messageRepositoryMock
              }
            ]
          }
        ).compile(
        );

        conversationsServiceInstance = testingModuleRef.get<
          ConversationsService
        >(
          ConversationsService
        );

      }
    );

    describe(
      'listForUser',
      (
      ) => {

        it(
          'returns empty list and hasMore=false when user has no conversations',
          async (
          ) => {

            const queryBuilderMock = makeQueryBuilderMock(
              [
              ]
            );
            conversationRepositoryMock.createQueryBuilder.mockReturnValue(
              queryBuilderMock
            );

            const listResult = await conversationsServiceInstance.listForUser(
              'user-1',
              undefined,
              20
            );

            expect(
              listResult
            ).toEqual(
              {
                conversations: [
                ],
                nextCursor: null,
                hasMore: false
              }
            );

          }
        );

        it(
          'indicates hasMore=true and produces nextCursor when rows exceed limit',
          async (
          ) => {

            const mockConversationRows = [
              makeConversation(
                {
                  id: 'conv-1',
                  updatedAt: new Date(
                    '2026-02-01T00:00:00.000Z'
                  )
                }
              ),
              makeConversation(
                {
                  id: 'conv-2',
                  updatedAt: new Date(
                    '2026-01-01T00:00:00.000Z'
                  )
                }
              )
            ];
            const queryBuilderMock = makeQueryBuilderMock(
              mockConversationRows
            );
            conversationRepositoryMock.createQueryBuilder.mockReturnValue(
              queryBuilderMock
            );

            const listResult = await conversationsServiceInstance.listForUser(
              'user-1',
              undefined,
              1
            );

            expect(
              listResult.hasMore
            ).toBe(
              true
            );
            expect(
              listResult.conversations.length
            ).toBe(
              1
            );
            expect(
              listResult.nextCursor
            ).not.toBeNull(
            );

          }
        );

      }
    );

    describe(
      'resume',
      (
      ) => {

        it(
          'returns null when conversation does not exist',
          async (
          ) => {

            conversationRepositoryMock.findOne.mockResolvedValue(
              null
            );

            const resumeResult = await conversationsServiceInstance.resume(
              'non-existent-id',
              'user-1'
            );

            expect(
              resumeResult
            ).toBeNull(
            );

          }
        );

        it(
          'returns conversation and messages when found',
          async (
          ) => {

            const foundConversation = makeConversation(
              {
                id: 'conv-1',
                userId: 'user-1'
              }
            );
            const foundMessages: Message[] = [
              {
                id: 'msg-1',
                conversationId: 'conv-1',
                conversation: foundConversation,
                role: MessageRole.USER,
                content: 'hello',
                citations: null,
                createdAt: new Date(
                  '2026-01-01T00:00:00.000Z'
                )
              }
            ];

            conversationRepositoryMock.findOne.mockResolvedValue(
              foundConversation
            );
            messageRepositoryMock.find.mockResolvedValue(
              foundMessages
            );

            const resumeResult = await conversationsServiceInstance.resume(
              'conv-1',
              'user-1'
            );

            expect(
              resumeResult
            ).not.toBeNull(
            );
            expect(
              resumeResult?.conversation.id
            ).toBe(
              'conv-1'
            );
            expect(
              resumeResult?.messages.length
            ).toBe(
              1
            );

          }
        );

      }
    );

  }
);
