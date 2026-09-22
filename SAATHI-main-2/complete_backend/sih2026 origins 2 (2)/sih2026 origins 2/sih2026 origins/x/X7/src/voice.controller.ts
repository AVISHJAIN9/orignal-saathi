import { Body, Controller, Post, Query } from '@nestjs/common';
import { TranscriptNormalizer } from './transcript-normalizer';
import { VoiceQueryService } from './voice-query.service';
import { AudioUploadDto } from './voice.types';

@Controller('voice')
export class VoiceController {
  constructor(
    private readonly voiceService: VoiceQueryService,
    private readonly normalizer: TranscriptNormalizer
  ) {}

  @Post('transcribe-and-normalize')
  public async handleVoiceQuery(@Body() body: { audioBase64: string; mimetype: string; languageHint?: any }) {
    const buffer = Buffer.from(body.audioBase64, 'base64');
    const audioDto: AudioUploadDto = {
      buffer,
      mimetype: body.mimetype,
      sizeBytes: buffer.length,
      languageHint: body.languageHint || 'hi-IN',
    };

    return this.voiceService.processVoiceQuery(audioDto);
  }

  @Post('normalize-text')
  public normalizeText(@Body('text') text: string) {
    const { normalized, phoneticMatches } = this.normalizer.normalize(text);
    const { intent, standard } = this.normalizer.inferIntentAndStandard(normalized);
    return { normalized, phoneticMatches, intent, standard };
  }

  @Post('synthesize-speech')
  public async synthesizeSpeech(
    @Body('text') text: string,
    @Query('lang') lang?: 'hi-IN' | 'en-IN'
  ) {
    const tts = await this.voiceService.synthesizeResponseSpeech(text, lang);
    return {
      audioBase64: tts.audioBuffer.toString('base64'),
      mimetype: tts.mimetype,
      durationSeconds: tts.durationSeconds,
    };
  }
}
