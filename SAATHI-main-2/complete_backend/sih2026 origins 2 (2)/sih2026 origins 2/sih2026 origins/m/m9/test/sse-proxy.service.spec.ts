import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SseProxyService } from '../src/modules/conversation/sse-proxy.service';
import { ConversationService } from '../src/modules/conversation/conversation.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SseProxyService', () => {
  let service: SseProxyService;
  let conversationService: any;

  beforeEach(async () => {
    conversationService = {
      saveMessage: jest.fn().mockResolvedValue({ id: 'msg-1' }),
      updateTitleIfDefault: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SseProxyService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'services.m3RetrievalUrl') return 'http://localhost:8003/api/v1/retrieval';
              if (key === 'services.m5GenerationUrl') return 'http://localhost:8005/api/v1/generate';
              return null;
            }),
          },
        },
        {
          provide: ConversationService,
          useValue: conversationService,
        },
      ],
    }).compile();

    service = module.get<SseProxyService>(SseProxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseSseLine', () => {
    it('should parse valid SSE block with event and data', () => {
      const block = 'event: token\ndata: {"token": "According to IS 10500"}\n';
      const result = service.parseSseLine(block);

      expect(result).toEqual({
        event: 'token',
        data: '{"token": "According to IS 10500"}',
      });
    });

    it('should default event to "message" if event line is missing', () => {
      const block = 'data: {"status": "ok"}';
      const result = service.parseSseLine(block);

      expect(result).toEqual({
        event: 'message',
        data: '{"status": "ok"}',
      });
    });

    it('should return null if data is empty', () => {
      const block = 'event: ping';
      const result = service.parseSseLine(block);

      expect(result).toBeNull();
    });
  });

  describe('fetchRetrievedChunks', () => {
    it('should return results array from M3 response', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          results: [
            {
              id: 'c-1',
              document_id: 'IS 10500:2012',
              content: 'Water standards specifications',
            },
          ],
        },
      });

      const chunks = await service.fetchRetrievedChunks('water standards');
      expect(chunks).toHaveLength(1);
      expect(chunks[0].document_id).toBe('IS 10500:2012');
    });

    it('should return empty array on M3 request failure without throwing', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Connection refused'));

      const chunks = await service.fetchRetrievedChunks('water standards');
      expect(chunks).toEqual([]);
    });
  });
});
