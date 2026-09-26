import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageRole } from '../entities/message.entity';

export class CitationDto {
  @ApiProperty({ example: 'The acceptable limit for TDS is 500 mg/l' })
  claim!: string;

  @ApiPropertyOptional({ example: 'chunk-10500-table1' })
  source_chunk_id?: string;

  @ApiProperty({ example: 'IS 10500:2012' })
  document_id!: string;

  @ApiPropertyOptional({ example: 'Table 1 Organoleptic and Physical Parameters' })
  section_title?: string;

  @ApiPropertyOptional({ example: 'https://bis.gov.in/standards/IS10500.pdf' })
  source_url?: string;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'b6f2f9c2-51c3-4d43-a6fe-b7d853e34bcf' })
  id!: string;

  @ApiProperty({ example: 'c8f3e2b1-6a2d-4567-9abc-123456789def' })
  conversationId!: string;

  @ApiProperty({ enum: MessageRole, example: MessageRole.ASSISTANT })
  role!: MessageRole;

  @ApiProperty({ example: 'According to IS 10500:2012, drinking water must meet...' })
  content!: string;

  @ApiPropertyOptional({ type: [CitationDto] })
  citations?: CitationDto[] | null;

  @ApiPropertyOptional({ example: 0.95 })
  confidence?: number | null;

  @ApiPropertyOptional({ example: false })
  isDeclined?: boolean;

  @ApiProperty({ example: '2026-08-31T18:00:00.000Z' })
  createdAt!: Date;
}

export class ConversationDetailDto {
  @ApiProperty({ example: 'c8f3e2b1-6a2d-4567-9abc-123456789def' })
  id!: string;

  @ApiProperty({ example: 'usr_98a72b1' })
  userId!: string;

  @ApiPropertyOptional({ example: 'Drinking Water Standards BIS Inquiry' })
  title!: string | null;

  @ApiProperty({ type: [MessageResponseDto] })
  messages!: MessageResponseDto[];

  @ApiProperty({ example: '2026-08-31T18:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-31T18:05:00.000Z' })
  updatedAt!: Date;
}

export class ConversationSummaryDto {
  @ApiProperty({ example: 'c8f3e2b1-6a2d-4567-9abc-123456789def' })
  id!: string;

  @ApiProperty({ example: 'usr_98a72b1' })
  userId!: string;

  @ApiPropertyOptional({ example: 'Drinking Water Standards BIS Inquiry' })
  title!: string | null;

  @ApiPropertyOptional({ example: 'What is the permissible limit of TDS?' })
  lastMessage?: string | null;

  @ApiProperty({ example: 2 })
  messageCount!: number;

  @ApiProperty({ example: '2026-08-31T18:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-08-31T18:05:00.000Z' })
  updatedAt!: Date;
}
