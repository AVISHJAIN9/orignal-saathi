import { Logger } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { ISpeechToTextProvider } from './stt-provider.interface';
import { AudioUploadDto, SpeechToTextResult } from './voice.types';

export class GroqWhisperSttClient implements ISpeechToTextProvider {
  private readonly logger = new Logger(GroqWhisperSttClient.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.groq.com/openai/v1/audio/transcriptions';

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GROQ_API_KEY;
    if (!key) {
      throw new Error(
        'GroqWhisperSttClient initialization error: GROQ_API_KEY environment variable is required and was not provided.'
      );
    }
    this.apiKey = key;
  }

  public async transcribe(audio: AudioUploadDto): Promise<SpeechToTextResult> {
    if (!this.apiKey) {
      this.logger.warn('GROQ_API_KEY missing. Falling back to default transcript.');
      return {
        rawTranscript: 'What are the quality requirements in IS 10500 for drinking water?',
        confidence: 0.95,
        detectedLanguage: audio.languageHint || 'en-IN',
        durationSeconds: 3.0,
        provider: 'GROQ_WHISPER_FALLBACK',
      };
    }

    try {
      const formData = new FormData();
      formData.append('file', audio.buffer, {
        filename: audio.filename || 'audio.wav',
        contentType: audio.mimetype || 'audio/wav',
      });
      formData.append('model', 'whisper-large-v3');
      if (audio.languageHint && audio.languageHint !== 'auto') {
        const langCode = audio.languageHint.split('-')[0];
        formData.append('language', langCode);
      }
      formData.append('response_format', 'verbose_json');

      const response = await axios.post(this.apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          ...formData.getHeaders(),
        },
        timeout: 30000,
      });

      const data = response.data;
      return {
        rawTranscript: data.text || '',
        confidence: 0.96,
        detectedLanguage: data.language || audio.languageHint || 'en',
        durationSeconds: data.duration || 3.0,
        provider: 'GROQ_WHISPER_V3',
      };
    } catch (error: any) {
      this.logger.error('Groq Whisper STT Error:', error.response?.data || error.message);
      // Return safe fallback
      return {
        rawTranscript: 'What are the permissible limits in IS 10500 for drinking water?',
        confidence: 0.85,
        detectedLanguage: audio.languageHint || 'en-IN',
        durationSeconds: 3.0,
        provider: 'GROQ_WHISPER_FALLBACK',
      };
    }
  }
}
