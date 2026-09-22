import { FeatureScopeMiddleware } from '../src/common/middleware/feature-scope.middleware';
import { Role } from '../src/common/enums/role.enum';
import { AuthenticatedRequest } from '../src/common/interfaces/authenticated-request.interface';

describe('FeatureScopeMiddleware', () => {
  const middleware = new FeatureScopeMiddleware();

  it('defaults to PUBLIC feature scope for an anonymous request', () => {
    const req = {} as AuthenticatedRequest;
    const next = jest.fn();
    middleware.use(req, {} as any, next);
    expect(req.allowedFeatures).toContain('D1');
    expect(req.allowedFeatures).not.toContain('D5');
    expect(next).toHaveBeenCalled();
  });

  it('grants the admin feature set for an ADMIN identity', () => {
    const req = { user: { id: '1', role: Role.ADMIN } } as AuthenticatedRequest;
    const next = jest.fn();
    middleware.use(req, {} as any, next);
    expect(req.allowedFeatures).toContain('D5');
    expect(req.allowedFeatures).toContain('D10');
  });
});
