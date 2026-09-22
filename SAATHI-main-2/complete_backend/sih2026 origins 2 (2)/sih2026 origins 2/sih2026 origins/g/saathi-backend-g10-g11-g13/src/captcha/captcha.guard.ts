import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { CaptchaService } from './captcha.service';
import { CAPTCHA_ACTION_KEY } from './captcha-action.decorator';

/**
 * Apply with @UseGuards(CaptchaGuard) on any public entry point the spec
 * calls out — D1's chat entry, X6's WhatsApp opt-in, a contact form, etc.
 * Deliberately does NOT live inside D1/X6's own module: this guard is
 * imported and applied by whoever owns those controllers, so this module
 * never has to depend on theirs.
 *
 * Reads the token from an `x-captcha-token` header first, then falls back
 * to `req.body.captchaToken` — pick whichever convention the frontend
 * widget (D1/X6's owner) actually sends and drop the other branch.
 *
 * Pair with @CaptchaAction('chat_submit') to reject a token that was
 * minted for a different form (reCAPTCHA v3 only; no-op for hCaptcha).
 *
 * ORDERING: per spec, this sits in front of P1's rate limiting —
 * @UseGuards(CaptchaGuard, ThrottlerGuard) — so a bot burns a captcha
 * failure before it ever touches the rate limiter's budget.
 */
@Injectable()
export class CaptchaGuard implements CanActivate {
  constructor(
    private readonly captchaService: CaptchaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token =
      (request.headers['x-captcha-token'] as string | undefined) ??
      (request.body as Record<string, unknown> | undefined)?.captchaToken;

    if (typeof token !== 'string' || token.length === 0) {
      throw new ForbiddenException('Captcha verification required.');
    }

    const expectedAction = this.reflector.getAllAndOverride<string | undefined>(
      CAPTCHA_ACTION_KEY,
      [context.getHandler(), context.getClass()],
    );

    const isHuman = await this.captchaService.isHuman(token, {
      remoteIp: request.ip,
      expectedAction,
    });
    if (!isHuman) {
      throw new ForbiddenException('Captcha verification failed.');
    }

    return true;
  }
}
