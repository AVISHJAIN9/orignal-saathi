import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiPropertyOptional({
    description: 'Initial title for the consultation thread',
    example: 'Drinking Water Standards Consultation (IS 10500)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'Optional User ID or Anonymous Session ID',
    example: 'user-msme-8812',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  userId?: string;

  @ApiPropertyOptional({
    description: 'Optional initial prompt message',
    example: 'What are the permissible limits for Arsenic in IS 10500:2012?',
  })
  @IsOptional()
  @IsString()
  initialMessage?: string;
}
