import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CitationPayload } from '../entities/message.entity';

export class MessageResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  conversationId: string;

  @ApiProperty({ enum: ['user', 'assistant'], example: 'user' })
  sender: 'user' | 'assistant';

  @ApiProperty({ example: 'What is the acceptable pH range in drinking water?' })
  content: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        claim: { type: 'string' },
        source_chunk_id: { type: 'string' },
        document_id: { type: 'string' },
        section_title: { type: 'string' },
        source_url: { type: 'string' },
      },
    },
  })
  citations: CitationPayload[];

  @ApiPropertyOptional({ example: 0.95 })
  confidence?: number;

  @ApiProperty({ example: false })
  isDeclined: boolean;

  @ApiProperty({ example: '2026-08-28T23:55:00.000Z' })
  createdAt: Date;
}

export class ConversationDetailDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  id: string;

  @ApiProperty({ example: 'Drinking Water Standards Consultation (IS 10500)' })
  title: string;

  @ApiPropertyOptional({ example: 'user-msme-8812' })
  userId?: string;

  @ApiProperty({ type: () => [MessageResponseDto] })
  messages: MessageResponseDto[];

  @ApiProperty({ example: '2026-08-28T23:55:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-08-28T23:55:00.000Z' })
  updatedAt: Date;
}

export class ConversationSummaryDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  id: string;

  @ApiProperty({ example: 'Drinking Water Standards Consultation (IS 10500)' })
  title: string;

  @ApiPropertyOptional({ example: 'user-msme-8812' })
  userId?: string;

  @ApiPropertyOptional({ example: 'What is the acceptable pH range in drinking water?' })
  lastMessage?: string;

  @ApiProperty({ example: 4 })
  messageCount: number;

  @ApiProperty({ example: '2026-08-28T23:55:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-08-28T23:55:00.000Z' })
  updatedAt: Date;
}
