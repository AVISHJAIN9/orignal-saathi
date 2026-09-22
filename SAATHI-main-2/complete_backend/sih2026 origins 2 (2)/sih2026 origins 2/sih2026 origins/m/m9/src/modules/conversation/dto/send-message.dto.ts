import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsObject,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    description: 'User query or question to the BIS assistant',
    example: 'What is the acceptable pH range in drinking water as per IS 10500?',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(4000)
  query: string;

  @ApiPropertyOptional({
    description: 'Language code for output response (e.g. "en", "hi")',
    example: 'en',
    default: 'en',
  })
  @IsOptional()
  @IsString()
  userLanguage?: string = 'en';

  @ApiPropertyOptional({
    description: 'Prompt persona template: "standard_qa" or "msme_x11"',
    example: 'standard_qa',
    default: 'standard_qa',
  })
  @IsOptional()
  @IsString()
  @IsIn(['standard_qa', 'msme_x11'])
  promptTemplate?: string = 'standard_qa';

  @ApiPropertyOptional({
    description: 'Optional metadata filters passed to retrieval module m3',
    example: { doc_type: 'standard', category: 'Food & Agriculture' },
  })
  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;
}
