import { Injectable, Logger } from '@nestjs/common';
import { BhashiniSttClient } from './bhashini-stt.client';
import { TranscriptNormalizer } from './transcript-normalizer';
import { AudioUploadDto, TextToSpeechResult, VoiceQueryResult } from './voice.types';

@Injectable()
export class VoiceQueryService {
  private readonly logger = new Logger(VoiceQueryService.name);
  private readonly maxFileSizeBytes = 10 * 1024 * 1024; // 10MB limit

  private readonly validMimeTypes: Set<string> = new Set([
    'audio/wav',
    'audio/x-wav',
    'audio/wave',
    'audio/mp3',
    'audio/mpeg',
    'audio/ogg',
    'audio/webm',
    'audio/m4a',
    'audio/x-m4a',
    'audio/aac',
  ]);

  constructor(
    private readonly sttClient?: BhashiniSttClient,
    private readonly normalizer?: TranscriptNormalizer
  ) {}

  public validateAudio(audio: AudioUploadDto): { isValid: boolean; error?: string } {
    if (!audio.buffer || audio.buffer.length === 0) {
      return { isValid: false, error: 'Audio buffer is empty.' };
    }

    if (audio.sizeBytes > this.maxFileSizeBytes) {
      return {
        isValid: false,
        error: `Audio file exceeds maximum size limit of ${this.maxFileSizeBytes / (1024 * 1024)}MB.`,
      };
    }

    const cleanMime = audio.mimetype.toLowerCase().split(';')[0].trim();
    if (!this.validMimeTypes.has(cleanMime)) {
      return {
        isValid: false,
        error: `Unsupported audio MIME type "${audio.mimetype}". Supported formats: WAV, MP3, OGG, WebM, M4A, AAC.`,
      };
    }

    return { isValid: true };
  }

  public async processVoiceQuery(audio: AudioUploadDto): Promise<VoiceQueryResult> {
    const validation = this.validateAudio(audio);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const client = this.sttClient || new BhashiniSttClient();
    const norm = this.normalizer || new TranscriptNormalizer();

    const sttResult = await client.transcribe(audio);
    const { normalized, phoneticMatches } = norm.normalize(sttResult.rawTranscript);
    const { intent, standard } = norm.inferIntentAndStandard(normalized);

    const requiresReprompt = sttResult.confidence < 0.60 || normalized.length < 5;
    const repromptReason = requiresReprompt
      ? 'Audio was unclear or confidence was low. Please speak closer to the microphone or type your question.'
      : undefined;

    return {
      rawTranscript: sttResult.rawTranscript,
      normalizedQuery: normalized,
      detectedLanguage: sttResult.detectedLanguage,
      sttConfidence: sttResult.confidence,
      phoneticMatchesFound: phoneticMatches,
      inferredIntent: intent,
      inferredStandard: standard,
      durationSeconds: sttResult.durationSeconds,
      isReadyForPipeline: !requiresReprompt,
      requiresReprompt,
      repromptReason,
    };
  }

  public async synthesizeResponseSpeech(
    text: string,
    lang: 'hi-IN' | 'en-IN' = 'hi-IN'
  ): Promise<TextToSpeechResult> {
    const client = this.sttClient || new BhashiniSttClient();
    return client.synthesizeSpeech(text, lang);
  }
}
