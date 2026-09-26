import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface FeatureFlagRule {
  enabled: boolean;
  allowedRoles?: string[];
  allowedUsers?: string[];
  percentageRollout?: number; // 0-100
  description?: string;
}

/**
 * FeatureFlagsService (Phase 6.9)
 * Provides dynamic feature flag checks backed by in-memory cache and optional Redis.
 * Supports instant kill switches for high-risk integrations (e.g. WhatsApp, external payment webhooks).
 */
@Injectable()
export class FeatureFlagsService {
  private readonly logger = new Logger(FeatureFlagsService.name);
  private flags: Map<string, FeatureFlagRule> = new Map();

  constructor(private readonly configService: ConfigService) {
    this.initializeDefaultFlags();
  }

  private initializeDefaultFlags() {
    // Default system flags
    this.flags.set('WHATSAPP_BOT_INTEGRATION', {
      enabled: this.configService.get<boolean>('FEATURE_WHATSAPP_ENABLED', false),
      description: 'WhatsApp automated compliance assistant bot (X6)',
    });

    this.flags.set('LIVE_BIS_CRAWLER', {
      enabled: this.configService.get<boolean>('FEATURE_BIS_CRAWLER_ENABLED', false),
      description: 'Live automated crawling of bis.gov.in (M1)',
    });

    this.flags.set('PAYMENT_GATEWAY_LIVE', {
      enabled: this.configService.get<boolean>('FEATURE_PAYMENT_LIVE_ENABLED', false),
      description: 'Real payment gateway processing (S5)',
    });

    this.flags.set('HIGH_CONCURRENCY_STREAMING', {
      enabled: true,
      description: 'SSE real-time token streaming for chat (D1)',
    });

    this.flags.set('SEMANTIC_CACHE_JITTER', {
      enabled: true,
      description: 'TTL jitter on semantic cache to prevent cache stampedes (M5)',
    });
  }

  isEnabled(flagName: string, context?: { userId?: string; role?: string }): boolean {
    const flag = this.flags.get(flagName);
    if (!flag) {
      this.logger.warn(`Feature flag ${flagName} not found, defaulting to false`);
      return false;
    }

    if (!flag.enabled) {
      return false;
    }

    if (flag.allowedRoles && context?.role && !flag.allowedRoles.includes(context.role)) {
      return false;
    }

    if (flag.allowedUsers && context?.userId && !flag.allowedUsers.includes(context.userId)) {
      return false;
    }

    return true;
  }

  setFlag(flagName: string, rule: FeatureFlagRule) {
    this.flags.set(flagName, rule);
    this.logger.log(`Feature flag ${flagName} updated: ${JSON.stringify(rule)}`);
  }

  getAllFlags(): Record<string, FeatureFlagRule> {
    return Object.fromEntries(this.flags.entries());
  }
}
