import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CitationPayload } from '../entities/message.entity';

export class SaveDirectMessageDto {
  @ApiProperty({
    enum: ['user', 'assistant'],
    description: 'The sender role of the message',
    example: 'user',
  })
  @IsNotEmpty()
  @IsEnum(['user', 'assistant'], {
    message: "sender must be either 'user' or 'assistant'",
  })
  sender: 'user' | 'assistant';

  @ApiProperty({
    description: 'Text content of the message',
    example: 'What is the acceptable pH range in drinking water as per IS 10500?',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10000)
  content: string;

  @ApiPropertyOptional({
    description: 'Granular citations for the message',
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
  @IsOptional()
  @IsArray()
  citations?: CitationPayload[];

  @ApiPropertyOptional({
    description: 'Grounding confidence score',
    example: 0.95,
  })
  @IsOptional()
  @IsNumber()
  confidence?: number;

  @ApiPropertyOptional({
    description: 'Whether the answer generation was declined',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeclined?: boolean;
}
