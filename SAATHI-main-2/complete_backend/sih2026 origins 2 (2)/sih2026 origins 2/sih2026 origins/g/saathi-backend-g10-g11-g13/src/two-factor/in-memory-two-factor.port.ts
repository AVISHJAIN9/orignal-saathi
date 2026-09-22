import { Injectable } from '@nestjs/common';
import { TwoFactorPort, TwoFactorState } from '../common/ports/two-factor.port';

/**
 * Placeholder only — see users port note in the G4 password-reset module for
 * the same caveat. Forgets everything on restart; DO NOT ship this.
 * Delete once P1's real adapter (writing to the admin credentials table) is
 * wired in via two-factor.module.ts.
 */
@Injectable()
export class InMemoryTwoFactorPort implements TwoFactorPort {
  private readonly states = new Map<string, TwoFactorState>();

  private getOrInit(userId: string): TwoFactorState {
    let state = this.states.get(userId);
    if (!state) {
      state = { pendingSecret: null, confirmedSecret: null, enabled: false, backupCodeHashes: [] };
      this.states.set(userId, state);
    }
    return state;
  }

  async getState(userId: string): Promise<TwoFactorState> {
    return { ...this.getOrInit(userId) };
  }

  async setPendingSecret(userId: string, secret: string): Promise<void> {
    this.getOrInit(userId).pendingSecret = secret;
  }

  async enable(userId: string, secret: string, backupCodeHashes: string[]): Promise<void> {
    const state = this.getOrInit(userId);
    state.confirmedSecret = secret;
    state.pendingSecret = null;
    state.enabled = true;
    state.backupCodeHashes = backupCodeHashes;
  }

  async disable(userId: string): Promise<void> {
    const state = this.getOrInit(userId);
    state.confirmedSecret = null;
    state.pendingSecret = null;
    state.enabled = false;
    state.backupCodeHashes = [];
  }

  async consumeBackupCode(userId: string, codeHash: string): Promise<void> {
    const state = this.getOrInit(userId);
    state.backupCodeHashes = state.backupCodeHashes.filter((h) => h !== codeHash);
  }
}
