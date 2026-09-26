/**
 * G11 stores its data as fields on P1's admin credentials row (secret,
 * enabled flag, backup-code hashes) rather than a new table — per spec.
 * Same reasoning as G4's UsersPort: depending on P1's real entity directly
 * would block this module from compiling until P1's code exists. Whoever
 * owns P1 implements this against the real table and swaps the provider in
 * two-factor.module.ts.
 */
export interface TwoFactorState {
  /** Set once setup() is called, before the user has confirmed with a valid code. */
  pendingSecret: string | null;
  /** Set once enable() succeeds; null means 2FA is off. */
  confirmedSecret: string | null;
  enabled: boolean;
  /** SHA-256 hashes only — raw codes are shown once at enable time and never stored. */
  backupCodeHashes: string[];
}

export interface TwoFactorPort {
  getState(userId: string): Promise<TwoFactorState>;
  setPendingSecret(userId: string, secret: string): Promise<void>;
  enable(userId: string, secret: string, backupCodeHashes: string[]): Promise<void>;
  disable(userId: string): Promise<void>;
  consumeBackupCode(userId: string, codeHash: string): Promise<void>;
}

export const TWO_FACTOR_PORT = Symbol('TWO_FACTOR_PORT');
