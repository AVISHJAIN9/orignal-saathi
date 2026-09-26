import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class IndicService {
  private readonly logger = new Logger(IndicService.name);
  private readonly sarvamApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.sarvamApiKey =
      this.configService.get<string>('SARVAM_API_KEY') ||
      'sk_lhvjypj7_VrWnRMvqxzRofUPkaAQGif8t';
  }

  /**
   * Translates incoming regional prompt (e.g. Hindi, Tamil, Bengali) into English.
   * Uses Sarvam AI (Mayura translation model with auto-language detection).
   */
  async translateToEnglish(text: string, sourceLang: string = 'auto'): Promise<string> {
    if (!this.sarvamApiKey) {
      this.logger.warn('SARVAM_API_KEY missing; passing original raw prompt.');
      return text;
    }

    try {
      const response = await axios.post(
        'https://api.sarvam.ai/translate',
        {
          input: text,
          source_language_code: sourceLang, // 'auto' triggers Sarvam's automatic language detection
          target_language_code: 'en-IN',
          model: 'mayura:v1',
          mode: 'formal',
        },
        {
          headers: {
            'api-subscription-key': this.sarvamApiKey,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );

      const translated = response.data?.translated_text;
      if (translated && translated.trim().length > 0) {
        this.logger.log(`Sarvam translated (${sourceLang} -> en-IN): "${text.slice(0, 40)}..." -> "${translated.slice(0, 40)}..."`);
        return translated;
      }
      return text;
    } catch (error: any) {
      this.logger.error('Sarvam Translation Error:', error.response?.data || error.message);
      return text; // Graceful fallback to original text
    }
  }

  /**
   * Translates English response back to user's preferred Indian language.
   */
  async translateFromEnglish(text: string, targetLang: string = 'hi-IN'): Promise<string> {
    if (!this.sarvamApiKey || targetLang === 'en-IN' || targetLang === 'en') {
      return text;
    }

    try {
      const response = await axios.post(
        'https://api.sarvam.ai/translate',
        {
          input: text,
          source_language_code: 'en-IN',
          target_language_code: targetLang,
          model: 'mayura:v1',
          mode: 'formal',
        },
        {
          headers: {
            'api-subscription-key': this.sarvamApiKey,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        },
      );

      return response.data?.translated_text || text;
    } catch (error: any) {
      this.logger.error('Sarvam Reverse Translation Error:', error.response?.data || error.message);
      return text;
    }
  }
}
