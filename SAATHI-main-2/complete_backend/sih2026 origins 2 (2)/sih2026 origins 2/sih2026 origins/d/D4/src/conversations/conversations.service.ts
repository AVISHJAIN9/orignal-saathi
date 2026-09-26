import {
  Injectable,
  Logger
} from '@nestjs/common';
import {
  InjectRepository
} from '@nestjs/typeorm';
import {
  Brackets,
  Repository
} from 'typeorm';
import to from 'await-to-js';
import {
  Conversation
} from './entities/conversation.entity';
import {
  Message,
  MessageRole
} from './entities/message.entity';
import {
  ConversationCursor,
  encodeCursor
} from './cursor.util';

const DEFAULT_MAX_RESUME_MESSAGES = 2000;

export interface PublicConversation {

  id: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;

}

export interface PublicMessage {

  id: string;
  role: MessageRole;
  content: string;
  citations: unknown[] | null;
  createdAt: Date;

}

export interface ConversationListResult {

  conversations: PublicConversation[];
  nextCursor: string | null;
  hasMore: boolean;

}

export interface ResumeResult {

  conversation: PublicConversation;
  messages: PublicMessage[];

}

function toPublicConversation(
  conversationRecord: Conversation
): PublicConversation {

  return {
    id: conversationRecord.id,
    title: conversationRecord.title,
    createdAt: conversationRecord.createdAt,
    updatedAt: conversationRecord.updatedAt
  };

}

function toPublicMessage(
  messageRecord: Message
): PublicMessage {

  return {
    id: messageRecord.id,
    role: messageRecord.role,
    content: messageRecord.content,
    citations: messageRecord.citations,
    createdAt: messageRecord.createdAt
  };

}

@Injectable(
)
export class ConversationsService {

  private readonly logger = new Logger(
    ConversationsService.name
  );

  constructor(
    @InjectRepository(
      Conversation
    )
    private readonly conversationRepository: Repository<
      Conversation
    >,
    @InjectRepository(
      Message
    )
    private readonly messageRepository: Repository<
      Message
    >
  ) {

  }

  private get maxResumeMessages(
  ): number {

    const rawParsedLimitValue = parseInt(
      process.env.MAX_RESUME_MESSAGES || '',
      10
    );

    let effectiveResumeMessagesLimit = DEFAULT_MAX_RESUME_MESSAGES;

    if (
      Number.isFinite(
        rawParsedLimitValue
      ) && rawParsedLimitValue > 0
    ) {
      effectiveResumeMessagesLimit = rawParsedLimitValue;
    } else {
      effectiveResumeMessagesLimit = DEFAULT_MAX_RESUME_MESSAGES;
    }

    return effectiveResumeMessagesLimit;

  }

  // GET /conversations - cursor-paginated list of conversations for a user
  async listForUser(
    targetUserId: string,
    paginationCursor: ConversationCursor | undefined,
    paginationPageLimit: number
  ): Promise<
    ConversationListResult
  > {

    const conversationQueryBuilder = this.conversationRepository.createQueryBuilder(
      'c'
    ).where(
      'c.userId = :userId',
      {
        userId: targetUserId
      }
    );

    if (
      paginationCursor
    ) {
      conversationQueryBuilder.andWhere(
        new Brackets(
          (
            subQueryBuilder
          ) => {

            subQueryBuilder.where(
              'c.updatedAt < :cursorUpdatedAt',
              {
                cursorUpdatedAt: paginationCursor.updatedAt
              }
            ).orWhere(
              new Brackets(
                (
                  tieBreakerQueryBuilder
                ) => {

                  tieBreakerQueryBuilder.where(
                    'c.updatedAt = :cursorUpdatedAt',
                    {
                      cursorUpdatedAt: paginationCursor.updatedAt
                    }
                  ).andWhere(
                    'c.id < :cursorId',
                    {
                      cursorId: paginationCursor.id
                    }
                  );

                }
              )
            );

          }
        )
      );
    }

    conversationQueryBuilder.orderBy(
      'c.updatedAt',
      'DESC'
    ).addOrderBy(
      'c.id',
      'DESC'
    ).take(
      paginationPageLimit + 1
    );

    const [
      fetchError,
      conversationEntityRecordList
    ] = await to(
      conversationQueryBuilder.getMany(
      )
    );

    if (
      fetchError
    ) {
      this.logger.error(
        `Failed to fetch conversations for user ${targetUserId}`
      );
      throw fetchError;
    }

    const hasMoreRecords = conversationEntityRecordList.length > paginationPageLimit;

    let pagedConversationEntityList: Conversation[];
    if (
      hasMoreRecords
    ) {
      pagedConversationEntityList = conversationEntityRecordList.slice(
        0,
        paginationPageLimit
      );
    } else {
      pagedConversationEntityList = conversationEntityRecordList;
    }

    const lastConversationRecord = pagedConversationEntityList[
      pagedConversationEntityList.length - 1
    ];

    let nextPaginationCursorString: string | null = null;
    if (
      hasMoreRecords && lastConversationRecord
    ) {
      nextPaginationCursorString = encodeCursor(
        {
          updatedAt: lastConversationRecord.updatedAt,
          id: lastConversationRecord.id
        }
      );
    } else {
      nextPaginationCursorString = null;
    }

    return {
      conversations: pagedConversationEntityList.map(
        toPublicConversation
      ),
      nextCursor: nextPaginationCursorString,
      hasMore: hasMoreRecords
    };

  }

  // GET /conversations/:id/resume - loads full message history for a conversation
  async resume(
    targetConversationId: string,
    targetUserId: string
  ): Promise<
    ResumeResult | null
  > {

    const [
      lookupError,
      targetConversationRecord
    ] = await to(
      this.conversationRepository.findOne(
        {
          where: {
            id: targetConversationId,
            userId: targetUserId
          }
        }
      )
    );

    if (
      lookupError
    ) {
      this.logger.error(
        `Failed to lookup conversation ${targetConversationId}`
      );
      throw lookupError;
    }

    if (
      !targetConversationRecord
    ) {
      return null;
    }

    const maximumMessageHistoryCap = this.maxResumeMessages;

    const [
      messageFetchError,
      messageRecordList
    ] = await to(
      this.messageRepository.find(
        {
          where: {
            conversationId: targetConversationId
          },
          order: {
            createdAt: 'ASC'
          },
          take: maximumMessageHistoryCap
        }
      )
    );

    if (
      messageFetchError
    ) {
      this.logger.error(
        `Failed to fetch messages for conversation ${targetConversationId}`
      );
      throw messageFetchError;
    }

    if (
      messageRecordList.length === maximumMessageHistoryCap
    ) {
      this.logger.warn(
        `Conversation ${targetConversationId} returned ${maximumMessageHistoryCap} messages (the MAX_RESUME_MESSAGES cap) - history may have been truncated`
      );
    }

    return {
      conversation: toPublicConversation(
        targetConversationRecord
      ),
      messages: messageRecordList.map(
        toPublicMessage
      )
    };

  }

}
