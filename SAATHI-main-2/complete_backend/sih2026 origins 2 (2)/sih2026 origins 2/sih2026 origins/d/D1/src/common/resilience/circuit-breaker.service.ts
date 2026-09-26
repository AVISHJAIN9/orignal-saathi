import { Injectable, Logger } from '@nestjs/common';

export enum CircuitState {
  CLOSED = 'CLOSED', // Normal operation
  OPEN = 'OPEN',     // Failing, fail fast without calling target
  HALF_OPEN = 'HALF_OPEN', // Probing recovery
}

export interface CircuitBreakerOptions {
  failureThreshold?: number; // consecutive failures before opening (default: 5)
  cooldownMs?: number;        // time in OPEN before attempting HALF_OPEN (default: 15000ms)
  timeoutMs?: number;         // execution timeout per call (default: 5000ms)
}

/**
 * CircuitBreakerService (Phase 6.1)
 * Wraps outgoing HTTP and external API integrations (payment, live crawlers, external BIS APIs)
 * to prevent cascading outages when third-party services fail.
 */
@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private circuits = new Map<string, {
    state: CircuitState;
    failureCount: number;
    successCount: number;
    lastFailureTime: number;
    options: Required<CircuitBreakerOptions>;
  }>();

  getCircuit(name: string, options?: CircuitBreakerOptions) {
    if (!this.circuits.has(name)) {
      this.circuits.set(name, {
        state: CircuitState.CLOSED,
        failureCount: 0,
        successCount: 0,
        lastFailureTime: 0,
        options: {
          failureThreshold: options?.failureThreshold ?? 5,
          cooldownMs: options?.cooldownMs ?? 15000,
          timeoutMs: options?.timeoutMs ?? 5000,
        },
      });
    }
    return this.circuits.get(name)!;
  }

  async execute<T>(
    circuitName: string,
    action: () => Promise<T>,
    fallback?: (error: Error) => Promise<T> | T,
    options?: CircuitBreakerOptions,
  ): Promise<T> {
    const circuit = this.getCircuit(circuitName, options);
    const now = Date.now();

    // Check if OPEN circuit has reached cooldown period to transition to HALF_OPEN
    if (circuit.state === CircuitState.OPEN) {
      if (now - circuit.lastFailureTime > circuit.options.cooldownMs) {
        circuit.state = CircuitState.HALF_OPEN;
        this.logger.warn(`Circuit [${circuitName}] moved to HALF_OPEN probe state`);
      } else {
        const err = new Error(`Circuit [${circuitName}] is OPEN. Failing fast.`);
        if (fallback) return fallback(err);
        throw err;
      }
    }

    // Execute action with timeout
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Call to [${circuitName}] timed out after ${circuit.options.timeoutMs}ms`)), circuit.options.timeoutMs);
      });

      const result = await Promise.race([action(), timeoutPromise]);

      // Success handling
      if (circuit.state === CircuitState.HALF_OPEN) {
        circuit.successCount++;
        if (circuit.successCount >= 2) {
          circuit.state = CircuitState.CLOSED;
          circuit.failureCount = 0;
          circuit.successCount = 0;
          this.logger.log(`Circuit [${circuitName}] recovered. State is now CLOSED.`);
        }
      } else {
        circuit.failureCount = 0;
      }

      return result;
    } catch (error: any) {
      circuit.failureCount++;
      circuit.lastFailureTime = Date.now();

      if (circuit.state === CircuitState.HALF_OPEN || circuit.failureCount >= circuit.options.failureThreshold) {
        circuit.state = CircuitState.OPEN;
        this.logger.error(`Circuit [${circuitName}] tripped to OPEN state! Failures: ${circuit.failureCount}. Reason: ${error.message}`);
      }

      if (fallback) {
        return fallback(error);
      }
      throw error;
    }
  }

  getCircuitStatus(name: string) {
    const circuit = this.circuits.get(name);
    return circuit ? { name, state: circuit.state, failures: circuit.failureCount } : { name, state: 'NOT_FOUND' };
  }
}
