import { Module } from '@nestjs/common';
import { BhashiniSttClient } from './bhashini-stt.client';
import { TranscriptNormalizer } from './transcript-normalizer';
import { VoiceController } from './voice.controller';
import { VoiceQueryService } from './voice-query.service';

@Module({
  controllers: [VoiceController],
  providers: [VoiceQueryService, TranscriptNormalizer, BhashiniSttClient],
  exports: [VoiceQueryService, TranscriptNormalizer, BhashiniSttClient],
})
export class VoiceModule {}
