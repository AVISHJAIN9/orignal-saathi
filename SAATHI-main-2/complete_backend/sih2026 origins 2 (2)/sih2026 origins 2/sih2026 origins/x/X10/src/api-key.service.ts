import * as crypto from 'crypto';
import {
  ApiKeyRecord,
  ApiKeyScope,
  CreateApiKeyDto,
  GeneratedKeyResult,
} from './api-key.types';

export class ApiKeyService {
  private readonly keyStore: Map<string, ApiKeyRecord> = new Map();
  private readonly hashToIdMap: Map<string, string> = new Map();

  public hashKey(rawKey: string): string {
    return crypto.createHash('sha256').update(rawKey.trim()).digest('hex');
  }

  public generateApiKey(dto: CreateApiKeyDto): GeneratedKeyResult {
    const keyId = `KEY-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const randomSecret = crypto.randomBytes(24).toString('hex');
    const rawSecretKey = `saathi_live_${randomSecret}`;
    const keyPrefix = rawSecretKey.substring(0, 16);
    const keyHash = this.hashKey(rawSecretKey);

    const now = new Date().toISOString();
    let expiresAt: string | undefined = undefined;

    if (dto.expiresInDays) {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + dto.expiresInDays);
      expiresAt = expDate.toISOString();
    }

    const tier = dto.tier || 'FREE';
    let defaultRateLimit = 60;
    let defaultMonthlyQuota = 10000;

    if (tier === 'STARTUP') {
      defaultRateLimit = 300;
      defaultMonthlyQuota = 100000;
    } else if (tier === 'ENTERPRISE_GOV') {
      defaultRateLimit = 1200;
      defaultMonthlyQuota = 1000000;
    }

    const defaultScopes: ApiKeyScope[] = [
      'standards:read',
      'chat:query',
      'checklists:generate',
    ];

    const keyRecord: ApiKeyRecord = {
      keyId,
      keyPrefix,
      keyHash,
      ownerName: dto.ownerName,
      organization: dto.organization,
      email: dto.email,
      tier,
      scopes: dto.scopes || defaultScopes,
      rateLimitPerMinute: dto.rateLimitPerMinute || defaultRateLimit,
      monthlyQuota: dto.monthlyQuota || defaultMonthlyQuota,
      monthlyUsed: 0,
      isRevoked: false,
      expiresAt,
      createdAt: now,
      updatedAt: now,
    };

    this.keyStore.set(keyId, keyRecord);
    this.hashToIdMap.set(keyHash, keyId);

    return {
      rawSecretKey,
      keyRecord,
    };
  }

  public validateKey(
    rawKey: string,
    requiredScope?: ApiKeyScope
  ): { isValid: boolean; keyRecord?: ApiKeyRecord; error?: string } {
    if (!rawKey || !rawKey.startsWith('saathi_live_')) {
      return { isValid: false, error: 'Invalid API key format. Must start with "saathi_live_".' };
    }

    const keyHash = this.hashKey(rawKey);
    const keyId = this.hashToIdMap.get(keyHash);
    if (!keyId) {
      return { isValid: false, error: 'API key does not exist or has been deleted.' };
    }

    const record = this.keyStore.get(keyId);
    if (!record) {
      return { isValid: false, error: 'API key record not found.' };
    }

    if (record.isRevoked) {
      return { isValid: false, error: 'API key has been revoked.' };
    }

    if (record.expiresAt && new Date(record.expiresAt).getTime() < Date.now()) {
      return { isValid: false, error: 'API key has expired.' };
    }

    if (record.monthlyUsed >= record.monthlyQuota) {
      return { isValid: false, error: 'Monthly API usage quota exceeded.' };
    }

    if (requiredScope && !record.scopes.includes(requiredScope)) {
      return {
        isValid: false,
        error: `API key lacks required permission scope: "${requiredScope}".`,
      };
    }

    return { isValid: true, keyRecord: record };
  }

  public revokeKey(keyId: string): boolean {
    const record = this.keyStore.get(keyId);
    if (!record) return false;

    record.isRevoked = true;
    record.revokedAt = new Date().toISOString();
    record.updatedAt = new Date().toISOString();
    this.keyStore.set(keyId, record);
    return true;
  }

  public incrementUsage(keyId: string): void {
    const record = this.keyStore.get(keyId);
    if (record) {
      record.monthlyUsed++;
      this.keyStore.set(keyId, record);
    }
  }
}
