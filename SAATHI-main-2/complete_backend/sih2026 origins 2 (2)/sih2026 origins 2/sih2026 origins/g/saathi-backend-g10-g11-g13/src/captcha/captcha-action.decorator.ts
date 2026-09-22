import { SetMetadata } from '@nestjs/common';

export const CAPTCHA_ACTION_KEY = 'captchaAction';

/**
 * @CaptchaAction('chat_submit') on a route, read by CaptchaGuard. Must match
 * the action name the frontend passes to grecaptcha.execute(key, {action}).
 * Optional — omit it and the guard just skips the action check (fine for
 * hCaptcha, which has no action concept anyway).
 */
export const CaptchaAction = (action: string) => SetMetadata(CAPTCHA_ACTION_KEY, action);
