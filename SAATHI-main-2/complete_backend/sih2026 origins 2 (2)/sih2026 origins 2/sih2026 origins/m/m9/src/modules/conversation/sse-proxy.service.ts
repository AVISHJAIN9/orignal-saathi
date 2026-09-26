import { Injectable, Logger, MessageEvent } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { ConversationService } from './conversation.service';
import { SendMessageDto } from './dto/send-message.dto';
import { CitationPayload } from './entities/message.entity';

export interface StreamOptions {
  lastEventId?: string;
  clientAbortSignal?: AbortSignal;
}

@Injectable()
export class SseProxyService {
  private readonly logger = new Logger(SseProxyService.name);
  private readonly m3Url: string;
  private readonly m5Url: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly conversationService: ConversationService,
  ) {
    this.m3Url = this.configService.get<string>('services.m3RetrievalUrl');
    this.m5Url = this.configService.get<string>('services.m5GenerationUrl');
  }

  /**
   * Main entrypoint: Persists user message, performs retrieval, proxies stream from M5,
   * and saves final assistant message on completion.
   */
  async streamConversationMessage(
    conversationId: string,
    dto: SendMessageDto,
    options?: StreamOptions,
  ): Promise<Observable<MessageEvent>> {
    // 1. Persist User Message
    await this.conversationService.saveMessage(
      conversationId,
      'user',
      dto.query,
    );

    // Update conversation title if needed
    await this.conversationService.updateTitleIfDefault(conversationId, dto.query);

    // 2. Retrieve context chunks from Module M3
    const retrievedChunks = await this.fetchRetrievedChunks(dto.query, dto.filters);

    // 3. Initiate SSE stream to Module M5 and transform to RxJS Observable
    return this.createM5SseStreamObservable(
      conversationId,
      dto.query,
      retrievedChunks,
      dto.userLanguage || 'en',
      dto.promptTemplate || 'standard_qa',
      options,
    );
  }

  /**
   * Query Module M3 (Hybrid Search) for grounded chunks.
   */
  async fetchRetrievedChunks(query: string, filters?: Record<string, any>): Promise<any[]> {
    try {
      this.logger.log(`Fetching retrieval chunks from M3 (${this.m3Url}/hybrid)...`);
      const response = await axios.post(
        `${this.m3Url}/hybrid`,
        {
          query,
          top_k: 8,
          filters: filters || null,
          enable_is_boost: true,
        },
        { timeout: 8000 },
      );

      return response.data?.results || [];
    } catch (error) {
      this.logger.warn(
        `Failed to retrieve chunks from M3: ${error.message}. Proceeding with empty context.`,
      );
      return [];
    }
  }

  /**
   * Connect to M5 SSE stream and bridge to RxJS Observable with AbortController,
   * client disconnect teardown, Last-Event-ID tracking, and periodic heartbeat pings.
   */
  private createM5SseStreamObservable(
    conversationId: string,
    query: string,
    retrievedChunks: any[],
    userLanguage: string,
    promptTemplate: string,
    options?: StreamOptions,
  ): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      const abortController = new AbortController();
      let isAborted = false;
      let eventSequence = options?.lastEventId ? parseInt(options.lastEventId, 10) || 0 : 0;

      // Listen to incoming client abort signal if provided
      if (options?.clientAbortSignal) {
        options.clientAbortSignal.addEventListener('abort', () => {
          this.logger.log(`Client request aborted. Aborting downstream M5 stream for conversation ${conversationId}.`);
          isAborted = true;
          abortController.abort();
        });
      }

      // Accumulated assistant message state
      let accumulatedText = '';
      let accumulatedCitations: CitationPayload[] = [];
      let finalConfidence = 0.95;
      let isDeclined = false;

      // 15-second heartbeat ping timer to keep proxy connections alive
      const heartbeatInterval = setInterval(() => {
        if (!subscriber.closed) {
          subscriber.next({
            type: 'heartbeat',
            data: ': heartbeat',
            id: String(++eventSequence),
          });
        }
      }, 15000);

      // Launch async HTTP stream to M5
      (async () => {
        try {
          const payload = {
            query,
            session_id: conversationId,
            retrieved_chunks: retrievedChunks,
            user_language: userLanguage,
            prompt_template: promptTemplate,
          };

          this.logger.log(`Connecting to M5 SSE stream at ${this.m5Url}/stream...`);
          const response: AxiosResponse = await axios.post(
            `${this.m5Url}/stream`,
            payload,
            {
              responseType: 'stream',
              timeout: 30000,
              signal: abortController.signal,
              headers: {
                'Content-Type': 'application/json',
                Accept: 'text/event-stream',
              },
            },
          );

          let buffer = '';

          response.data.on('data', (chunk: Buffer) => {
            if (isAborted || subscriber.closed) {
              return;
            }

            buffer += chunk.toString('utf-8');
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (!line.trim()) continue;

              const parsedEvent = this.parseSseLine(line);
              if (!parsedEvent) continue;

              const { event, data } = parsedEvent;

              // Track state updates
              if (event === 'token') {
                try {
                  const tokenData = JSON.parse(data);
                  accumulatedText += tokenData.token || '';
                } catch {
                  accumulatedText += data;
                }
              } else if (event === 'citation') {
                try {
                  const cit = JSON.parse(data);
                  accumulatedCitations.push(cit);
                } catch (e) {
                  this.logger.warn(`Failed to parse citation event: ${e.message}`);
                }
              } else if (event === 'structured_answer') {
                try {
                  const struct = JSON.parse(data);
                  if (struct.answer) accumulatedText = struct.answer;
                  if (struct.citations) accumulatedCitations = struct.citations;
                  if (struct.confidence !== undefined) finalConfidence = struct.confidence;
                  if (struct.is_declined !== undefined) isDeclined = struct.is_declined;
                } catch (e) {
                  this.logger.warn(`Failed to parse structured_answer: ${e.message}`);
                }
              }

              // Emit SSE event to client with sequence ID
              if (!subscriber.closed) {
                subscriber.next({
                  type: event,
                  data,
                  id: String(++eventSequence),
                });
              }
            }
          });

          response.data.on('end', async () => {
            if (isAborted) return;
            this.logger.log(`M5 stream completed for conversation: ${conversationId}`);

            // Persist completed Assistant Message to Database
            try {
              await this.conversationService.saveMessage(
                conversationId,
                'assistant',
                accumulatedText || 'Response generation finished.',
                accumulatedCitations,
                finalConfidence,
                isDeclined,
              );
            } catch (persistErr) {
              this.logger.error(`Error saving assistant message: ${persistErr.message}`);
            }

            clearInterval(heartbeatInterval);
            if (!subscriber.closed) {
              subscriber.complete();
            }
          });

          response.data.on('error', (err: Error) => {
            if (axios.isCancel(err) || isAborted) {
              this.logger.log(`M5 stream aborted cleanly for conversation: ${conversationId}`);
            } else {
              this.logger.error(`Error in M5 stream: ${err.message}`);
              if (!subscriber.closed) {
                subscriber.next({
                  type: 'error',
                  data: JSON.stringify({ error: err.message }),
                  id: String(++eventSequence),
                });
              }
            }
            clearInterval(heartbeatInterval);
            if (!subscriber.closed) {
              subscriber.complete();
            }
          });
        } catch (err) {
          if (axios.isCancel(err) || isAborted) {
            this.logger.log(`M5 stream initiation cancelled for conversation: ${conversationId}`);
            clearInterval(heartbeatInterval);
            if (!subscriber.closed) {
              subscriber.complete();
            }
            return;
          }

          this.logger.error(`Failed to initiate stream with M5 service: ${err.message}`);

          // Fallback offline response
          const fallbackMsg =
            'SAATHI Assistant gateway could not reach the generation engine. Please ensure Python services are running.';

          if (!subscriber.closed) {
            subscriber.next({
              type: 'token',
              data: JSON.stringify({ token: fallbackMsg }),
              id: String(++eventSequence),
            });

            subscriber.next({
              type: 'done',
              data: '{}',
              id: String(++eventSequence),
            });
          }

          try {
            await this.conversationService.saveMessage(
              conversationId,
              'assistant',
              fallbackMsg,
              [],
              0.0,
              true,
            );
          } catch (saveErr) {
            this.logger.error(`Error saving fallback message: ${saveErr.message}`);
          }

          clearInterval(heartbeatInterval);
          if (!subscriber.closed) {
            subscriber.complete();
          }
        }
      })();

      // RxJS teardown hook when client disconnects
      return () => {
        this.logger.log(`Client disconnected from SSE stream for conversation ${conversationId}. Aborting M5 stream.`);
        isAborted = true;
        clearInterval(heartbeatInterval);
        abortController.abort();
      };
    });
  }

  /**
   * Helper to parse a single SSE block:
   * event: token
   * data: {"token": "hello"}
   */
  public parseSseLine(block: string): { event: string; data: string } | null {
    let event = 'message';
    let data = '';

    const lines = block.split('\n');
    for (const line of lines) {
      if (line.startsWith('event:')) {
        event = line.replace('event:', '').trim();
      } else if (line.startsWith('data:')) {
        data = line.replace('data:', '').trim();
      }
    }

    if (!data) return null;
    return { event, data };
  }
}
