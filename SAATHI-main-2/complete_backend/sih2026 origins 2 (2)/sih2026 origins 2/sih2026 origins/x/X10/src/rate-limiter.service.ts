export interface RateLimitStatus {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export class SlidingWindowRateLimiter {
  private readonly requestTimestamps: Map<string, number[]> = new Map();

  /**
   * Evaluates if a request from keyId is permitted under sliding 60-second window
   */
  public checkLimit(keyId: string, limitPerMinute: number): RateLimitStatus {
    const now = Date.now();
    const windowMs = 60 * 1000;
    const windowStart = now - windowMs;

    const timestamps = this.requestTimestamps.get(keyId) || [];

    // Filter out timestamps older than 60 seconds
    const activeTimestamps = timestamps.filter((t) => t > windowStart);

    if (activeTimestamps.length >= limitPerMinute) {
      const oldest = activeTimestamps[0];
      const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);

      this.requestTimestamps.set(keyId, activeTimestamps);

      return {
        allowed: false,
        limit: limitPerMinute,
        remaining: 0,
        resetSeconds: Math.max(1, resetSeconds),
      };
    }

    // Append current timestamp
    activeTimestamps.push(now);
    this.requestTimestamps.set(keyId, activeTimestamps);

    const remaining = limitPerMinute - activeTimestamps.length;
    const resetSeconds = 60;

    return {
      allowed: true,
      limit: limitPerMinute,
      remaining,
      resetSeconds,
    };
  }

  /**
   * Resets rate limit counters (useful for testing)
   */
  public reset(keyId?: string): void {
    if (keyId) {
      this.requestTimestamps.delete(keyId);
    } else {
      this.requestTimestamps.clear();
    }
  }
}
