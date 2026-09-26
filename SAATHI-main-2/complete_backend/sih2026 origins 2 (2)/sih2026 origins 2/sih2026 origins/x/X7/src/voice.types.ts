export type SupportedAudioMimeType =
  | 'audio/wav'
  | 'audio/x-wav'
  | 'audio/wave'
  | 'audio/mp3'
  | 'audio/mpeg'
  | 'audio/ogg'
  | 'audio/webm'
  | 'audio/m4a'
  | 'audio/x-m4a'
  | 'audio/aac';

export type SupportedLanguageCode = 'hi-IN' | 'en-IN' | 'hi-Latn' | 'ta-IN' | 'te-IN' | 'bn-IN' | 'mr-IN' | 'auto';

export interface AudioUploadDto {
  buffer: Buffer;
  mimetype: string;
  originalFilename?: string;
  filename?: string;
  sizeBytes: number;
  durationSeconds?: number;
  languageHint?: SupportedLanguageCode;
  conversationId?: string;
  userId?: string;
}

export interface SpeechToTextResult {
  rawTranscript: string;
  confidence: number;
  detectedLanguage: SupportedLanguageCode;
  durationSeconds?: number;
  provider: 'BHASHINI' | 'WHISPER' | 'GOOGLE_SPEECH' | 'GROQ_WHISPER_V3' | 'GROQ_WHISPER_FALLBACK';
}

export interface TextToSpeechResult {
  audioBuffer: Buffer;
  mimetype: string;
  durationSeconds?: number;
}

export interface VoiceQueryResult {
  rawTranscript: string;
  normalizedQuery: string;
  detectedLanguage: SupportedLanguageCode;
  sttConfidence: number;
  phoneticMatchesFound: string[];
  inferredIntent?: 'STANDARD_LOOKUP' | 'PRODUCT_COMPLIANCE' | 'CLAUSE_REQUIREMENTS' | 'FEE_LAB_PROCEDURE';
  inferredStandard?: string;
  durationSeconds?: number;
  isReadyForPipeline: boolean;
  requiresReprompt: boolean;
  repromptReason?: string;
}
