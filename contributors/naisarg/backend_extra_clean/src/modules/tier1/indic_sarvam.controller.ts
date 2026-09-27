import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import axios from 'axios';
import * as FormData from 'form-data';
import { Public } from '../../common/guards/public.decorator';

@ApiTags('Indic AI & Voice (Sarvam)')
@Public()
@Controller('api/v1/indic')
export class IndicSarvamController {
  private readonly logger = new Logger('IndicSarvamController');
  private readonly sarvamApiKey = process.env.SARVAM_API_KEY || 'sk_krcpnwir_L5wQZIIDqsCJ4kegSE6LEP6a';

  /**
   * [Indic Speech-to-Text] Convert spoken audio in 10+ Indic languages to text via saaras:v3
   */
  @Public()
  @Post('speech-to-text')
  @ApiOperation({ summary: 'Transcribe Indian language speech to text (saaras:v3)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async speechToText(
    @UploadedFile() file: Express.Multer.File,
    @Body('language_code') languageCode?: string
  ) {
    if (!file) {
      throw new HttpException('Audio file is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname || 'speech.wav',
        contentType: file.mimetype || 'audio/wav'
      });
      formData.append('model', 'saaras:v3');
      if (languageCode) {
        formData.append('language_code', languageCode);
      }

      const response = await axios.post('https://api.sarvam.ai/speech-to-text', formData, {
        headers: {
          'api-subscription-key': this.sarvamApiKey,
          ...formData.getHeaders()
        },
        timeout: 20000
      });

      return {
        status: 'success',
        transcript: response.data.transcript || '',
        language_code: response.data.language_code || languageCode || 'hi-IN',
        request_id: response.data.request_id
      };
    } catch (err: any) {
      this.logger.error('Sarvam STT failed: ' + (err.response?.data?.error?.message || err.message));
      throw new HttpException(
        err.response?.data?.error?.message || 'Failed to transcribe audio',
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  /**
   * [Indic Text-to-Speech] Generate real-time Indian language speech from compliance text via bulbul:v3
   */
  @Public()
  @Post('text-to-speech')
  @ApiOperation({ summary: 'Synthesize Indian language audio from text (bulbul:v3)' })
  async textToSpeech(
    @Body() body: { text: string; target_language_code?: string; speaker?: string }
  ) {
    const text = body.text?.trim();
    if (!text) {
      throw new HttpException('Text is required', HttpStatus.BAD_REQUEST);
    }

    const targetLang = body.target_language_code || 'hi-IN';
    const speaker = body.speaker || 'ritu';

    try {
      const response = await axios.post(
        'https://api.sarvam.ai/text-to-speech',
        {
          inputs: [text],
          target_language_code: targetLang,
          speaker: speaker,
          model: 'bulbul:v3'
        },
        {
          headers: {
            'api-subscription-key': this.sarvamApiKey,
            'Content-Type': 'application/json'
          },
          timeout: 20000
        }
      );

      const audios = response.data.audios || [];
      return {
        status: 'success',
        audioBase64: audios[0] || '',
        speaker,
        target_language_code: targetLang,
        request_id: response.data.request_id
      };
    } catch (err: any) {
      this.logger.error('Sarvam TTS failed: ' + (err.response?.data?.error?.message || err.message));
      throw new HttpException(
        err.response?.data?.error?.message || 'Failed to synthesize speech',
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  /**
   * [Indic Translation] High-fidelity translation of technical standards clauses via mayura:v1
   */
  @Public()
  @Post('translate')
  @ApiOperation({ summary: 'Translate compliance text into regional Indian languages (Sarvam 105B & Mayura)' })
  async translate(
    @Body() body: { text: string; source_language_code?: string; target_language_code: string }
  ) {
    const text = body.text?.trim();
    if (!text) {
      throw new HttpException('Text is required', HttpStatus.BAD_REQUEST);
    }

    const sourceLang = body.source_language_code || 'en-IN';
    const targetLang = body.target_language_code || 'hi-IN';

    const langNames: Record<string, string> = {
      'hi-IN': 'Hindi', 'ta-IN': 'Tamil', 'te-IN': 'Telugu', 'mr-IN': 'Marathi',
      'bn-IN': 'Bengali', 'gu-IN': 'Gujarati', 'kn-IN': 'Kannada', 'ml-IN': 'Malayalam',
      'pa-IN': 'Punjabi', 'od-IN': 'Odia', 'hi': 'Hindi', 'gu': 'Gujarati'
    };
    const targetLanguageName = langNames[targetLang] || 'Hindi';

    // 1. Use Sarvam 105B for multi-paragraph or long text
    try {
      const prompt = `Translate the following Indian Standards compliance text accurately and fluently into ${targetLanguageName}. Keep all Indian Standard numbers (such as [IS 16102], [IS 17803:2022]) intact in English bracket notation. Maintain all bullet points and numbered lists. Return ONLY the direct translation:\n\n${text}`;
      const response = await axios.post(
        'https://api.sarvam.ai/v1/chat/completions',
        {
          model: 'sarvam-105b-conversations',
          messages: [{ role: 'user', content: prompt }]
        },
        {
          headers: {
            'api-subscription-key': this.sarvamApiKey,
            'Content-Type': 'application/json'
          },
          timeout: 25000
        }
      );
      const translated = response.data.choices?.[0]?.message?.content?.trim();
      if (translated) {
        return {
          status: 'success',
          sourceText: text,
          translatedText: translated,
          source_language_code: sourceLang,
          target_language_code: targetLang
        };
      }
    } catch (e: any) {
      this.logger.warn('Sarvam 105B translate failed: ' + e.message);
    }

    // 2. Fallback to Mayura for short texts
    if (text.length <= 900) {
      try {
        const response = await axios.post(
          'https://api.sarvam.ai/translate',
          {
            input: text,
            source_language_code: sourceLang,
            target_language_code: targetLang,
            model: 'mayura:v1'
          },
          {
            headers: {
              'api-subscription-key': this.sarvamApiKey,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );

        return {
          status: 'success',
          sourceText: text,
          translatedText: response.data.translated_text || text,
          source_language_code: sourceLang,
          target_language_code: targetLang
        };
      } catch (err: any) {
        this.logger.error('Sarvam Translation failed: ' + (err.response?.data?.error?.message || err.message));
      }
    }

    return {
      status: 'fallback',
      sourceText: text,
      translatedText: text,
      source_language_code: sourceLang,
      target_language_code: targetLang
    };
  }

  /**
   * [Indic Chat Completion] Conversational AI in native Indic languages via sarvam-105b-conversations
   */
  @Public()
  @Post('chat')
  @ApiOperation({ summary: 'Conversational compliance assistant in Indic languages (sarvam-105b)' })
  async chat(@Body() body: { query: string; systemPrompt?: string }) {
    const query = body.query?.trim();
    if (!query) {
      throw new HttpException('Query is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await axios.post(
        'https://api.sarvam.ai/v1/chat/completions',
        {
          model: 'sarvam-105b-conversations',
          messages: [
            {
              role: 'system',
              content:
                body.systemPrompt ||
                'You are SAATHI, the official Bureau of Indian Standards (BIS) assistant. Provide accurate, clear compliance answers in the user\'s language.'
            },
            {
              role: 'user',
              content: query
            }
          ]
        },
        {
          headers: {
            'api-subscription-key': this.sarvamApiKey,
            'Content-Type': 'application/json'
          },
          timeout: 25000
        }
      );

      const content = response.data.choices?.[0]?.message?.content || '';
      return {
        status: 'success',
        reply: content,
        model: 'sarvam-105b-conversations',
        usage: response.data.usage
      };
    } catch (err: any) {
      this.logger.error('Sarvam Chat failed: ' + (err.response?.data?.error?.message || err.message));
      throw new HttpException(
        err.response?.data?.error?.message || 'Failed to complete chat query',
        HttpStatus.BAD_GATEWAY
      );
    }
  }
}
