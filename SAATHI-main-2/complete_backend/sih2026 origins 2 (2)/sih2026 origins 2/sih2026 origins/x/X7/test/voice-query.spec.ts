import { BhashiniSttClient } from '../src/bhashini-stt.client';
import { TranscriptNormalizer } from '../src/transcript-normalizer';
import { VoiceQueryService } from '../src/voice-query.service';

describe('X7: Voice Query Service', () => {
  let voiceService: VoiceQueryService;
  let sttClient: BhashiniSttClient;
  let normalizer: TranscriptNormalizer;

  beforeEach(() => {
    sttClient = new BhashiniSttClient();
    normalizer = new TranscriptNormalizer();
    voiceService = new VoiceQueryService(sttClient, normalizer);
  });

  it('should validate audio format and reject unsupported files', () => {
    const valid = voiceService.validateAudio({
      buffer: Buffer.from('audio'),
      mimetype: 'audio/wav',
      sizeBytes: 100,
    });
    expect(valid.isValid).toBe(true);

    const invalid = voiceService.validateAudio({
      buffer: Buffer.from('video'),
      mimetype: 'video/mp4',
      sizeBytes: 100,
    });
    expect(invalid.isValid).toBe(false);
    expect(invalid.error).toContain('Unsupported audio MIME');
  });

  it('should process voice query end-to-end and infer intent', async () => {
    const res = await voiceService.processVoiceQuery({
      buffer: Buffer.from('sample-audio'),
      mimetype: 'audio/wav',
      sizeBytes: 1024 * 10,
      languageHint: 'hi-IN',
    });

    expect(res.rawTranscript).toBeDefined();
    expect(res.normalizedQuery).toBeDefined();
    expect(res.isReadyForPipeline).toBe(true);
    expect(res.requiresReprompt).toBe(false);
  });
});
