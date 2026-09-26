import { Injectable, Logger, MessageEvent } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Observable, Subject } from 'rxjs';
import { ChatService } from './chat.service';
import { SendMessageDto } from '../dto/send-message.dto';
import { CitationItem } from '../entities/message.entity';

@Injectable()
export class SseProxyService {
  private readonly logger = new Logger(SseProxyService.name);
  private readonly ragServiceUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly chatService: ChatService,
  ) {
    this.ragServiceUrl = this.configService.get<string>(
      'RAG_SERVICE_URL',
      'http://localhost:8000',
    );
  }

  async streamConversationMessage(
    conversationId: string,
    dto: SendMessageDto,
  ): Promise<Observable<MessageEvent>> {
    const subject = new Subject<MessageEvent>();

    // 1. Save user message to database
    await this.chatService.saveUserMessage(conversationId, dto.query);

    // 2. Create placeholder assistant message
    const assistantPlaceholder =
      await this.chatService.createAssistantPlaceholder(conversationId);

    // Emit initial event notifying client of message creation
    subject.next({
      type: 'meta',
      data: {
        conversationId,
        messageId: assistantPlaceholder.id,
        status: 'generating',
      },
    });

    let accumulatedTokens = '';
    const citations: CitationItem[] = [];
    let finalConfidence = 0.95;
    let isDeclined = false;

    const streamUrl = `${this.ragServiceUrl}/api/v1/generate/stream`;

    try {
      this.logger.log(
        `Proxying RAG stream from ${streamUrl} for conversation ${conversationId}`,
      );

      const response = await axios.post(
        streamUrl,
        {
          query: dto.query,
          user_language: dto.userLanguage || 'en',
          prompt_template: dto.promptTemplate || 'standard_qa',
        },
        {
          responseType: 'stream',
          timeout: 60000,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
        },
      );

      let buffer = '';

      response.data.on('data', (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const block of lines) {
          if (!block.trim()) continue;

          let eventName = 'message';
          let eventData = '';

          const blockLines = block.split('\n');
          for (const line of blockLines) {
            if (line.startsWith('event:')) {
              eventName = line.substring(6).trim();
            } else if (line.startsWith('data:')) {
              eventData = line.substring(5).trim();
            }
          }

          if (eventName === 'token') {
            accumulatedTokens += eventData;
            subject.next({
              type: 'token',
              data: { token: eventData },
            });
          } else if (eventName === 'citation') {
            try {
              const parsed = JSON.parse(eventData);
              citations.push(parsed);
              subject.next({
                type: 'citation',
                data: parsed,
              });
            } catch {
              // Non-JSON citation
            }
          } else if (eventName === 'structured_answer') {
            try {
              const parsed = JSON.parse(eventData);
              if (parsed.confidence !== undefined) finalConfidence = parsed.confidence;
              if (parsed.is_declined !== undefined) isDeclined = parsed.is_declined;
              if (parsed.answer && !accumulatedTokens) {
                accumulatedTokens = parsed.answer;
              }
              subject.next({
                type: 'structured_answer',
                data: parsed,
              });
            } catch {
              // Ignore parse error
            }
          } else if (eventName === 'done') {
            subject.next({
              type: 'done',
              data: { status: 'completed' },
            });
          } else {
            // General message or fallback
            subject.next({
              type: eventName,
              data: eventData,
            });
          }
        }
      });

      response.data.on('end', async () => {
        try {
          const finalContent =
            accumulatedTokens.trim().length > 0
              ? accumulatedTokens
              : 'Answer generation completed.';

          await this.chatService.finalizeAssistantMessage(
            assistantPlaceholder.id,
            finalContent,
            citations,
            finalConfidence,
            isDeclined,
          );

          this.logger.log(
            `Finalized assistant message ${assistantPlaceholder.id} for conversation ${conversationId}`,
          );
        } catch (saveErr) {
          this.logger.error(`Error saving finalized message: ${saveErr}`);
        } finally {
          subject.complete();
        }
      });

      response.data.on('error', async (err: Error) => {
        this.logger.error(`Upstream RAG stream error: ${err.message}`);
        subject.next({
          type: 'error',
          data: { error: 'Upstream RAG service encountered an error' },
        });
        await this.chatService.finalizeAssistantMessage(
          assistantPlaceholder.id,
          'Sorry, the assistant encountered an error generating the response.',
          [],
          0.0,
          true,
        );
        subject.complete();
      });
    } catch (err: any) {
      this.logger.warn(
        `Failed to reach RAG upstream (${this.ragServiceUrl}). Falling back to local offline response mode.`,
      );

      // Graceful offline fallback
      const fallbackAnswer =
        `[SAATHI Offline Gateway Mode]: Received query "${dto.query}". Connect M5 FastAPI RAG service on ${this.ragServiceUrl} for real-time live grounding.`;

      // Emit simulated streaming tokens
      setTimeout(async () => {
        const words = fallbackAnswer.split(' ');
        for (const w of words) {
          subject.next({
            type: 'token',
            data: { token: w + ' ' },
          });
        }

        subject.next({
          type: 'done',
          data: { status: 'completed' },
        });

        await this.chatService.finalizeAssistantMessage(
          assistantPlaceholder.id,
          fallbackAnswer,
          [],
          1.0,
          false,
        );

        subject.complete();
      }, 50);
    }

    return subject.asObservable();
  }
}
