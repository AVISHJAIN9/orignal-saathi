import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import {
  LoginDto,
  AnonymousLoginDto,
  RegisterUserDto,
  AuthResponseDto,
  SanitizedUser,
} from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserRole } from './entities/user.entity';
import { AuthenticatedUser } from './strategies/jwt.strategy';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Standard User Login (Admin / Industry / Public)
   * Applies strict throttle of 5 requests per minute to prevent brute-force attacks.
   */
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * Anonymous User Login (Issues scoped JWT for public BIS Assistant chat)
   * Allowed up to 20 requests per minute.
   */
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post('anonymous')
  @HttpCode(HttpStatus.OK)
  async loginAnonymous(
    @Body() anonymousDto?: AnonymousLoginDto,
  ): Promise<AuthResponseDto> {
    return this.authService.loginAnonymous(anonymousDto);
  }

  /**
   * User Registration Endpoint
   */
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterUserDto,
  ): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * Get Current Authenticated Profile
   * Protected by JWT Strategy Guard
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ user: AuthenticatedUser; timestamp: string }> {
    return {
      user,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Admin-Only Protected Endpoint (RBAC Example)
   * Protected by both JwtAuthGuard and RolesGuard requiring 'admin' role
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/stats')
  async getAdminStats(@CurrentUser() adminUser: AuthenticatedUser) {
    return {
      status: 'success',
      message: 'Admin access granted to BIS SAATHI administrative panel',
      admin: adminUser.username,
      system_metrics: {
        active_llm_sessions: 42,
        rate_limits_enforced_today: 13,
        vector_search_latency_ms: 24,
      },
    };
  }

  /**
   * Health Check with Rate Limiter Bypassed
   * Uses @SkipThrottle() decorator
   */
  @SkipThrottle()
  @Get('health')
  async healthCheck() {
    return {
      status: 'ok',
      service: 'SAATHI-BIS-Module-P1-Auth',
      timestamp: new Date().toISOString(),
    };
  }
}
