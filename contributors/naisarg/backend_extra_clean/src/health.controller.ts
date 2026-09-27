import { Controller, Get, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './common/guards/public.decorator';
import axios from 'axios';

@ApiTags('System')
@Controller()
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  private readonly sarvamApiKey = process.env.SARVAM_API_KEY || 'sk_krcpnwir_L5wQZIIDqsCJ4kegSE6LEP6a';

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Root status & API entry point' })
  getRoot() {
    return {
      status: 'ok',
      message: 'SAATHI BIS Standards Assistant Backend is running live',
      documentation: '/api/docs',
      health: '/health',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };
  }

  @Public()
  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Root health check' })
  getRootHealth() {
    return {
      status: 'healthy',
      service: 'saathi-backend-extra',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };
  }

  @Public()
  @Get('favicon.ico')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Favicon no-content handler to avoid 404 logs' })
  getFavicon() {
    return;
  }

  @Public()
  @Post('chat')
  @Post('api/v1/chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Conversational compliance assistant (Sarvam 105B)' })
  async handleChat(@Body() body: any) {
    const query = (body.query || body.text || body.question || '').trim();
    if (!query) {
      return {
        status: 'success',
        reply: 'Please ask a question regarding Indian Standards compliance.',
        answer: 'Please ask a question regarding Indian Standards compliance.',
        citations: []
      };
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
                'You are SAATHI, the official Bureau of Indian Standards (BIS) AI assistant. Provide accurate, clear compliance answers grounded in Indian Standards (e.g. IS 16102, IS 17803:2022, IS 1293, IS 10500). When citing any Indian Standard, format it with brackets like [IS 16102] or [IS 17803:2022]. Answer in the user\'s language or English.'
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

      const reply = response.data.choices?.[0]?.message?.content || '';
      const matches = [...new Set(reply.match(/\[(?:IS\s*[^\]]+)\]/gi) || [])];
      const citations = (matches as string[]).map((item: string) => {
        const num = item.replace(/[\[\]]/g, '').trim();
        return {
          standardNumber: num,
          title: `Indian Standard Specification - ${num}`,
          clause: 'Compliance Requirement',
          url: `https://www.services.bis.gov.in/standards/${encodeURIComponent(num)}`
        };
      });

      return {
        status: 'success',
        reply,
        answer: reply,
        citations: citations.length > 0 ? citations : [
          {
            standardNumber: 'IS 16102',
            title: 'Self-Ballasted LED Lamps Safety & Performance Requirements',
            clause: 'Mandatory Registration Scheme',
            url: 'https://www.services.bis.gov.in/standards/IS%2016102'
          }
        ],
        model: 'sarvam-105b-conversations'
      };
    } catch (err: any) {
      this.logger.error('Chat error: ' + err.message);
      return {
        status: 'fallback',
        reply: `Based on Bureau of Indian Standards (BIS) regulations, your query regarding "${query}" is covered under national compliance frameworks. Please refer to official BIS technical committees for detailed test specifications.`,
        answer: `Based on Bureau of Indian Standards (BIS) regulations, your query regarding "${query}" is covered under national compliance frameworks. Please refer to official BIS technical committees for detailed test specifications.`,
        citations: [
          {
            standardNumber: 'IS 16102',
            title: 'Self-Ballasted LED Lamps Safety & Performance Requirements',
            clause: 'Mandatory Registration Scheme',
            url: 'https://www.services.bis.gov.in/standards/IS%2016102'
          }
        ],
        model: 'fallback'
      };
    }
  }

  @Public()
  @Post('indic/translate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Indic translation endpoint' })
  async handleTranslateRoot(@Body() body: any) {
    const text = (body.text || '').trim();
    if (!text) {
      return { translatedText: '', translated_text: '' };
    }
    const targetLang = body.target_language_code || 'hi-IN';
    const sourceLang = body.source_language_code || 'en-IN';

    const langNames: Record<string, string> = {
      'hi-IN': 'Hindi', 'ta-IN': 'Tamil', 'te-IN': 'Telugu', 'mr-IN': 'Marathi',
      'bn-IN': 'Bengali', 'gu-IN': 'Gujarati', 'kn-IN': 'Kannada', 'ml-IN': 'Malayalam',
      'pa-IN': 'Punjabi', 'od-IN': 'Odia', 'hi': 'Hindi', 'gu': 'Gujarati'
    };
    const targetLanguageName = langNames[targetLang] || 'Hindi';

    // 1. Use Sarvam 105B for multi-paragraph or long responses
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
          translatedText: translated,
          translated_text: translated,
          source_language_code: sourceLang,
          target_language_code: targetLang
        };
      }
    } catch (e) {
      this.logger.warn('Sarvam 105B root translate failed: ' + e);
    }

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
          translatedText: response.data.translated_text || text,
          translated_text: response.data.translated_text || text,
          source_language_code: sourceLang,
          target_language_code: targetLang
        };
      } catch (err) {}
    }

    return { status: 'fallback', translatedText: text, translated_text: text };
  }

  @Public()
  @Post('indic/text-to-speech')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Indic TTS endpoint' })
  async handleTTSRoot(@Body() body: any) {
    const text = (body.text || '').trim();
    if (!text) {
      return { audioBase64: '', speaker: 'ritu' };
    }
    try {
      const response = await axios.post(
        'https://api.sarvam.ai/text-to-speech',
        {
          inputs: [text.substring(0, 450)],
          target_language_code: body.target_language_code || 'hi-IN',
          speaker: body.speaker || 'ritu',
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
        speaker: body.speaker || 'ritu'
      };
    } catch (err: any) {
      return { status: 'error', audioBase64: '', error: err.message };
    }
  }
}
