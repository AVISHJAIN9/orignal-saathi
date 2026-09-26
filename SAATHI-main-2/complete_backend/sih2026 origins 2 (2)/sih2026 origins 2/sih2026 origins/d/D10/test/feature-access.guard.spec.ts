import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FeatureAccessGuard } from '../src/common/guards/feature-access.guard';

function makeContext(allowedFeatures: string[]): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ allowedFeatures }),
    }),
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
  } as unknown as ExecutionContext;
}

describe('FeatureAccessGuard', () => {
  it('allows access when no @RequireFeature() metadata is present', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(undefined),
    } as unknown as Reflector;
    const guard = new FeatureAccessGuard(reflector);
    expect(guard.canActivate(makeContext([]))).toBe(true);
  });

  it('allows access when the feature is in req.allowedFeatures', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue('X6'),
    } as unknown as Reflector;
    const guard = new FeatureAccessGuard(reflector);
    expect(guard.canActivate(makeContext(['X6', 'D1']))).toBe(true);
  });

  it('rejects access when the feature is missing from req.allowedFeatures', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue('X6'),
    } as unknown as Reflector;
    const guard = new FeatureAccessGuard(reflector);
    expect(() => guard.canActivate(makeContext(['D1']))).toThrow(ForbiddenException);
  });
});
