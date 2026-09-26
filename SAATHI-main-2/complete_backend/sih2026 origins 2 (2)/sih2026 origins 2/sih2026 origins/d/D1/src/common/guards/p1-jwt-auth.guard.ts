import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class P1JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(P1JwtAuthGuard.name);

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const authHeader: string = req.headers['authorization'] ?? '';

    // Allow DEV_BYPASS only if explicitly configured in non-production
    if (process.env.AUTH_DEV_BYPASS === 'true' && process.env.NODE_ENV !== 'production') {
      req.user = { id: 'dev-user-001', role: 'ADMIN', email: 'dev@saathi.local' };
      return true;
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header. Expected Bearer token.');
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      throw new UnauthorizedException('Bearer token string cannot be empty.');
    }

    const authUrl = process.env.AUTH_SERVICE_URL ?? 'http://localhost:8001';
    try {
      const response = await axios.post(`${authUrl}/auth/verify`, { token }, { timeout: 3500 });
      req.user = response.data?.user ?? response.data;
      return true;
    } catch (error) {
      this.logger.warn(`JWT verification failed against P1 Auth (${authUrl}): ${error.message}`);
      throw new UnauthorizedException('Invalid, expired, or rejected authentication token.');
    }
  }
}
