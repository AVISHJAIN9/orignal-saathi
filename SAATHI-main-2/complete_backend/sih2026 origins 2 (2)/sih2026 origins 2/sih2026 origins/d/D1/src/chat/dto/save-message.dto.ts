import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { MessageRole } from '../entities/message.entity';

export class SaveDirectMessageDto {
  @ApiProperty({
    enum: MessageRole,
    description: 'Sender of the message',
    example: MessageRole.USER,
  })
  @IsEnum(MessageRole)
  sender!: MessageRole;

  @ApiProperty({
    description: 'Content of the message turn',
    example: 'Thank you for the guidance.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content!: string;

  @ApiPropertyOptional({
    description: 'Array of citation items for assistant message',
  })
  @IsOptional()
  citations?: any[];

  @ApiPropertyOptional({
    description: 'Confidence score (0.0 to 1.0)',
    example: 0.95,
  })
  @IsOptional()
  @IsNumber()
  confidence?: number;

  @ApiPropertyOptional({
    description: 'Flag indicating if answer was declined due to missing context',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeclined?: boolean;
}
