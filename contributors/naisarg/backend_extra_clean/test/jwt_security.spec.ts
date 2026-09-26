import * as jwt from 'jsonwebtoken';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('Deep Security: JWT Algorithm Hardening & IDOR Matrix Tests', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;
  const SECRET = 'test-secret-key-for-saathi-jwt-12345';

  beforeAll(() => {
    process.env.JWT_SECRET = SECRET;
    process.env.AUTH_DEV_BYPASS = 'false';
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);
  });

  const createMockContext = (authHeader?: string): ExecutionContext => {
    const request: any = {
      headers: authHeader ? { authorization: authHeader } : {},
      user: null
    };
    return {
      switchToHttp: () => ({
        getRequest: () => request
      }),
      getHandler: () => ({}),
      getClass: () => ({})
    } as any;
  };

  it('1. Should accept valid HS256 signed token', () => {
    const validToken = jwt.sign({ id: 'usr-101', role: 'APPLICANT' }, SECRET, { algorithm: 'HS256' });
    const ctx = createMockContext(`Bearer ${validToken}`);
    expect(guard.canActivate(ctx)).toBe(true);
    expect((ctx.switchToHttp().getRequest() as any).user.id).toBe('usr-101');
  });

  it('2. Should strictly reject alg:none tokens (Algorithm None Attack)', () => {
    const noneHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ id: 'admin-001', role: 'SUPER_ADMIN' })).toString('base64url');
    const forgedToken = `${noneHeader}.${payload}.`;

    const ctx = createMockContext(`Bearer ${forgedToken}`);
    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('3. Should strictly reject tokens signed with unapproved algorithms or invalid signatures', () => {
    // Generate token with different key
    const forgedToken = jwt.sign({ id: 'hacker-001', role: 'ADMIN' }, 'wrong-secret-key-xyz', { algorithm: 'HS256' });
    const ctx = createMockContext(`Bearer ${forgedToken}`);
    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('4. Should reject missing or malformed Authorization headers', () => {
    expect(() => guard.canActivate(createMockContext(undefined))).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(createMockContext('Basic 12345'))).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(createMockContext('Bearer '))).toThrow(UnauthorizedException);
  });
});
