import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateConversationDto {
  @ApiPropertyOptional({
    description: 'Title or initial topic for the conversation',
    example: 'Drinking Water Standards BIS Inquiry',
  })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  title?: string;

  @ApiPropertyOptional({
    description: 'User ID owning the conversation session',
    example: 'usr_98a72b1',
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  userId?: string;
}
