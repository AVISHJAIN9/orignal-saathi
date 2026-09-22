import { BhashiniSttClient } from '../src/bhashini-stt.client';

describe('X7: Bhashini STT & TTS Client', () => {
  let client: BhashiniSttClient;

  beforeEach(() => {
    client = new BhashiniSttClient();
  });

  it('should transcribe audio payload with high confidence', async () => {
    const audioPayload = {
      buffer: Buffer.from('FAKE_AUDIO_SAMPLE'),
      mimetype: 'audio/wav',
      sizeBytes: 1024 * 50,
      languageHint: 'hi-IN' as const,
    };

    const res = await client.transcribe(audioPayload);
    expect(res.rawTranscript).toBeDefined();
    expect(res.confidence).toBeGreaterThanOrEqual(0.9);
    expect(res.provider).toBe('BHASHINI');
  });

  it('should synthesize spoken audio response', async () => {
    const res = await client.synthesizeSpeech('Drinking water standard is IS 10500', 'en-IN');
    expect(res.audioBuffer).toBeDefined();
    expect(res.mimetype).toBe('audio/wav');
  });
});
