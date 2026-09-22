export interface CaptchaVerification {
  success: boolean;
  /** 0.0-1.0, present for score-based providers like reCAPTCHA v3. Absent for pass/fail providers like hCaptcha. */
  score?: number;
  /** The action name the provider recorded for this token, if it supports one (reCAPTCHA v3 only). */
  action?: string;
  errorCodes?: string[];
  /**
   * True only when success:false is due to OUR side failing to reach/read
   * the provider (network error, timeout, missing secret) — never true for
   * a genuine negative verdict the provider itself returned. This is what
   * CaptchaService.resolveOutcome() checks before honoring fail-open.
   */
  infrastructureError?: boolean;
}

export interface CaptchaProvider {
  verify(token: string, remoteIp?: string): Promise<CaptchaVerification>;
}

export const CAPTCHA_PROVIDER = Symbol('CAPTCHA_PROVIDER');
