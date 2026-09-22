import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CaptchaService } from './captcha.service';
import { CAPTCHA_PROVIDER } from './captcha-provider.interface';

describe('CaptchaService', () => {
  let service: CaptchaService;
  const providerMock = { verify: jest.fn() };
  const configMock = { get: jest.fn((_key: string, fallback?: unknown) => fallback) };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        CaptchaService,
        { provide: CAPTCHA_PROVIDER, useValue: providerMock },
        { provide: ConfigService, useValue: configMock },
      ],
    }).compile();
    service = moduleRef.get(CaptchaService);
  });

  it('rejects an empty token without calling the provider', async () => {
    const result = await service.isHuman('');
    expect(result).toBe(false);
    expect(providerMock.verify).not.toHaveBeenCalled();
  });

  it('rejects when the provider reports failure', async () => {
    providerMock.verify.mockResolvedValue({ success: false, errorCodes: ['invalid-input-response'] });
    expect(await service.isHuman('tok')).toBe(false);
  });

  it('rejects a reCAPTCHA v3 score below the configured threshold', async () => {
    providerMock.verify.mockResolvedValue({ success: true, score: 0.2 });
    expect(await service.isHuman('tok')).toBe(false);
  });

  it('accepts a reCAPTCHA v3 score at or above the threshold', async () => {
    providerMock.verify.mockResolvedValue({ success: true, score: 0.9 });
    expect(await service.isHuman('tok')).toBe(true);
  });

  it('accepts a pass/fail provider (hCaptcha) with no score field', async () => {
    providerMock.verify.mockResolvedValue({ success: true });
    expect(await service.isHuman('tok')).toBe(true);
  });

  it('rejects an action mismatch even with a high score', async () => {
    providerMock.verify.mockResolvedValue({ success: true, score: 0.95, action: 'login' });
    expect(await service.isHuman('tok', { expectedAction: 'chat_submit' })).toBe(false);
  });

  it('accepts a matching action', async () => {
    providerMock.verify.mockResolvedValue({ success: true, score: 0.95, action: 'chat_submit' });
    expect(await service.isHuman('tok', { expectedAction: 'chat_submit' })).toBe(true);
  });

  it('fails closed on an infrastructure error by default, even with CAPTCHA_FAIL_OPEN unset', async () => {
    providerMock.verify.mockResolvedValue({
      success: false,
      errorCodes: ['verification-request-timeout'],
      infrastructureError: true,
    });
    expect(await service.isHuman('tok')).toBe(false);
  });

  it('fails open on an infrastructure error only when CAPTCHA_FAIL_OPEN=true', async () => {
    configMock.get.mockImplementation((key: string, fallback?: unknown) =>
      key === 'CAPTCHA_FAIL_OPEN' ? 'true' : fallback,
    );
    providerMock.verify.mockResolvedValue({
      success: false,
      errorCodes: ['verification-request-timeout'],
      infrastructureError: true,
    });
    expect(await service.isHuman('tok')).toBe(true);
  });

  it('never fails open for a genuine negative verdict, even with CAPTCHA_FAIL_OPEN=true', async () => {
    configMock.get.mockImplementation((key: string, fallback?: unknown) =>
      key === 'CAPTCHA_FAIL_OPEN' ? 'true' : fallback,
    );
    providerMock.verify.mockResolvedValue({ success: false, errorCodes: ['invalid-input-response'] });
    expect(await service.isHuman('tok')).toBe(false);
  });
});
