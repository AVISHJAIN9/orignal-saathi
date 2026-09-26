// MOCK: S16 — DPDP consent-notice acceptance. There is no consent-log
// backend in this repo (same honest-mock pattern every other lib/mock-*
// module follows: no api/ directory, no OpenAPI spec). This module stands
// in for a future
//   GET  /api/v1/consent/dpdp-notice          getConsentRecord
//   POST /api/v1/consent/dpdp-notice/accept   acceptConsent
// with the same async, response-shaped-out signature those endpoints
// would have.
//
// Unlike Vault (mock-vault.ts) or the registration drafts
// (mock-registration.ts), which are deliberately unscoped per-browser for
// demo convenience, a consent-acceptance record is a legal/compliance
// record in spirit even as a prototype — it must never silently transfer
// to a different person signing into the same shared device/browser. So
// this is keyed by the signed-in user's id, not one fixed storage key.

const CONSENT_STORAGE_PREFIX = "saathi:consent:dpdp:";
const LATENCY_MS = 400;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) =>
    window.setTimeout(() => resolve(value), LATENCY_MS),
  );
}

export interface ConsentRecord {
  accepted: boolean;
  acceptedAt: string; // ISO timestamp
}

function isConsentRecord(value: unknown): value is ConsentRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<ConsentRecord>;
  return (
    typeof record.accepted === "boolean" &&
    typeof record.acceptedAt === "string"
  );
}

function storageKey(userId: string): string {
  return `${CONSENT_STORAGE_PREFIX}${userId}`;
}

/** GET /api/v1/consent/dpdp-notice stand-in. */
export async function getConsentRecord(
  userId: string,
): Promise<ConsentRecord | null> {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(storageKey(userId)) ?? "null",
    );
    return delay(isConsentRecord(parsed) ? parsed : null);
  } catch {
    return delay(null);
  }
}

/** POST /api/v1/consent/dpdp-notice/accept stand-in. */
export async function acceptConsent(userId: string): Promise<ConsentRecord> {
  const record: ConsentRecord = {
    accepted: true,
    acceptedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(record));
  } catch {
    // Ignore — the in-memory UI state still reflects acceptance for this
    // session even if it isn't persisted.
  }
  return delay(record);
}
