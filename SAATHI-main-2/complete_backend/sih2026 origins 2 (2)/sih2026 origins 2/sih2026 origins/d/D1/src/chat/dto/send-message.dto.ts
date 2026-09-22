import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'Natural language query regarding Indian Standards or BIS certification',
    example: 'What is the permissible limit of TDS in drinking water according to IS 10500?',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  query!: string;

  @ApiPropertyOptional({
    description: 'Language code for response (en / hi)',
    example: 'en',
    default: 'en',
  })
  @IsOptional()
  @IsString()
  userLanguage?: string = 'en';

  @ApiPropertyOptional({
    description: 'Persona or prompt template mode (standard_qa | msme_x11)',
    example: 'standard_qa',
    default: 'standard_qa',
  })
  @IsOptional()
  @IsString()
  promptTemplate?: string = 'standard_qa';
}
