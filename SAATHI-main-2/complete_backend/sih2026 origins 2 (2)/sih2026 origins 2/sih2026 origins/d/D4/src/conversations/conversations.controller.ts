import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query
} from '@nestjs/common';
import to from 'await-to-js';
import {
  ConversationListResult,
  ConversationsService,
  ResumeResult
} from './conversations.service';
import {
  ListConversationsQueryDto
} from './dto/list-conversations-query.dto';
import {
  ResumeQueryDto
} from './dto/resume-query.dto';
import {
  ConversationCursor,
  decodeCursor
} from './cursor.util';

// Controller translating HTTP requests to conversation service operations
@Controller(
  'conversations'
)
export class ConversationsController {

  constructor(
    private readonly conversationsService: ConversationsService
  ) {

  }

  @Get(
  )
  async list(
    @Query(
    )
    queryDto: ListConversationsQueryDto
  ): Promise<
    ConversationListResult
  > {

    let decodedPaginationCursor: ConversationCursor | undefined;

    if (
      queryDto.cursor
    ) {
      const [
        decodeErrorRecord,
        decodedCursorResult
      ] = await to(
        decodeCursor(
          queryDto.cursor
        )
      );

      if (
        decodeErrorRecord
      ) {
        throw new BadRequestException(
          'Invalid or expired cursor'
        );
      }

      decodedPaginationCursor = decodedCursorResult;
    }

    return this.conversationsService.listForUser(
      queryDto.userId,
      decodedPaginationCursor,
      queryDto.limit
    );

  }

  @Get(
    ':id/resume'
  )
  async resume(
    @Param(
      'id',
      ParseUUIDPipe
    )
    conversationIdString: string,
    @Query(
    )
    resumeQueryDto: ResumeQueryDto
  ): Promise<
    ResumeResult
  > {

    const [
      resumeErrorRecord,
      resumeOperationResult
    ] = await to(
      this.conversationsService.resume(
        conversationIdString,
        resumeQueryDto.userId
      )
    );

    if (
      resumeErrorRecord
    ) {
      throw resumeErrorRecord;
    }

    if (
      !resumeOperationResult
    ) {
      throw new NotFoundException(
        'Conversation not found'
      );
    }

    return resumeOperationResult;

  }

}
