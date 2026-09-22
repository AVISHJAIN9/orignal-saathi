export type ApiKeyScope =
  | 'standards:read'
  | 'chat:query'
  | 'checklists:generate'
  | 'admin:metrics';

export type ApiKeyTier = 'FREE' | 'STARTUP' | 'ENTERPRISE_GOV';

export interface ApiKeyRecord {
  keyId: string;
  keyPrefix: string;
  keyHash: string;
  ownerName: string;
  organization: string;
  email: string;
  tier: ApiKeyTier;
  scopes: ApiKeyScope[];
  rateLimitPerMinute: number;
  monthlyQuota: number;
  monthlyUsed: number;
  isRevoked: boolean;
  revokedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiUsageLog {
  logId: string;
  keyId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTimeMs: number;
  ipAddress?: string;
  timestamp: string;
}

export interface CreateApiKeyDto {
  ownerName: string;
  organization: string;
  email: string;
  tier?: ApiKeyTier;
  scopes?: ApiKeyScope[];
  rateLimitPerMinute?: number;
  monthlyQuota?: number;
  expiresInDays?: number;
}

export interface GeneratedKeyResult {
  rawSecretKey: string;
  keyRecord: ApiKeyRecord;
}

export interface PublicStandardDto {
  standardNumber: string;
  title: string;
  category: string;
  year: number;
  status: string;
  isMandatoryQCO: boolean;
  citationUrl: string;
}

export interface PublicChatRequestDto {
  query: string;
  conversationId?: string;
  includeCitations?: boolean;
}

export interface PublicChatResponseDto {
  conversationId: string;
  answer: string;
  isGrounded: boolean;
  citations: Array<{ standardNumber: string; clauseNumber?: string; sectionTitle?: string }>;
  groundednessScore: number;
}
