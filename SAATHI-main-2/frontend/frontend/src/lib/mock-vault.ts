// MOCK: there is no real "saved items" backend in this repo (see Step 0 of
// the task this file implements — no api/ directory, no OpenAPI spec, no
// env-configured API base URL). This module stands in for a future
//   GET    /api/v1/vault/items                 listVaultItems
//   POST   /api/v1/vault/items                  save (bookmark/toggle)
//   DELETE /api/v1/vault/items/:id               remove
// with the same async, response-shaped-out signature those endpoints would
// have, so swapping this module for a real API client is the only change
// useVault() (src/hooks/use-vault.ts) would need — same pattern as
// mock-classification.ts/mock-forum.ts.
//
// Unlike those two, this module persists to localStorage rather than
// resetting each session: "save for later" that vanishes on refresh isn't
// actually saving anything, so it follows use-user-profile.ts's
// read-after-mount localStorage pattern instead.
//
// Vault is a real aggregator, not a parallel content type — it stores only
// references (a standard `key`, a document `id` + the minimal fields
// needed to render it), never a duplicated or invented title/description.
// Saved standards are resolved live against MOCK_STANDARDS (mock-standards.ts)
// — the real 6-entry catalogue — so a bookmark can never point at a
// standard number that doesn't exist there. Saved documents snapshot the
// fields of a real RecentDocumentEntry (mock-document-analysis.ts, the
// data actually shown on Document Cortex) at the moment they're saved,
// since that list is itself just component state today and doesn't
// persist on its own.

import { MOCK_STANDARDS, type StandardDatum } from "@/lib/mock-standards";
import type { RecentDocumentEntry } from "@/lib/mock-document-analysis";

const VAULT_STORAGE_KEY = "saathi:vault";
const LATENCY_MS = 400;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) =>
    window.setTimeout(() => resolve(value), LATENCY_MS),
  );
}

export interface SavedDocumentRecord {
  id: string;
  fileName: string;
  resultKey: string;
  savedAt: string; // ISO timestamp
}

interface VaultStore {
  standardKeys: string[];
  documents: SavedDocumentRecord[];
}

const EMPTY_STORE: VaultStore = { standardKeys: [], documents: [] };

function isVaultStore(value: unknown): value is VaultStore {
  if (!value || typeof value !== "object") return false;
  const store = value as Partial<VaultStore>;
  return Array.isArray(store.standardKeys) && Array.isArray(store.documents);
}

function readStore(): VaultStore {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(VAULT_STORAGE_KEY) ?? "null",
    );
    return isVaultStore(parsed) ? parsed : EMPTY_STORE;
  } catch {
    // Storage disabled/unavailable, or corrupted JSON — fall back to empty
    // rather than crashing.
    return EMPTY_STORE;
  }
}

function writeStore(store: VaultStore) {
  try {
    window.localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore — the toggle still works for this render via React state.
  }
}

export type VaultItem =
  | {
      kind: "standard";
      id: string; // same as standard.key, prefixed so ids never collide with a document id
      standard: StandardDatum;
    }
  | {
      kind: "document";
      id: string;
      document: SavedDocumentRecord;
    };

function vaultItemId(kind: "standard" | "document", id: string): string {
  return `${kind}:${id}`;
}

/** GET /api/v1/vault/items stand-in. */
export async function listVaultItems(): Promise<VaultItem[]> {
  const store = readStore();

  const standardItems: VaultItem[] = store.standardKeys
    .map((key) => MOCK_STANDARDS.find((s) => s.key === key))
    .filter((standard): standard is StandardDatum => Boolean(standard))
    .map((standard) => ({
      kind: "standard",
      id: vaultItemId("standard", standard.key),
      standard,
    }));

  const documentItems: VaultItem[] = store.documents
    .slice()
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt))
    .map((document) => ({
      kind: "document",
      id: vaultItemId("document", document.id),
      document,
    }));

  return delay([...standardItems, ...documentItems]);
}

export function isStandardSaved(standardKey: string): boolean {
  return readStore().standardKeys.includes(standardKey);
}

export function isDocumentSaved(documentId: string): boolean {
  return readStore().documents.some((doc) => doc.id === documentId);
}

/** POST /api/v1/vault/items stand-in — toggles a standard bookmark. */
export async function toggleStandardSaved(
  standardKey: string,
): Promise<boolean> {
  const store = readStore();
  const alreadySaved = store.standardKeys.includes(standardKey);
  const next: VaultStore = {
    ...store,
    standardKeys: alreadySaved
      ? store.standardKeys.filter((key) => key !== standardKey)
      : [...store.standardKeys, standardKey],
  };
  writeStore(next);
  return delay(!alreadySaved);
}

/** POST /api/v1/vault/items stand-in — toggles a saved document. */
export async function toggleDocumentSaved(
  entry: RecentDocumentEntry,
): Promise<boolean> {
  const store = readStore();
  const alreadySaved = store.documents.some((doc) => doc.id === entry.id);
  const next: VaultStore = {
    ...store,
    documents: alreadySaved
      ? store.documents.filter((doc) => doc.id !== entry.id)
      : [
          ...store.documents,
          {
            id: entry.id,
            fileName: entry.fileName,
            resultKey: entry.resultKey,
            savedAt: new Date().toISOString(),
          },
        ],
  };
  writeStore(next);
  return delay(!alreadySaved);
}

/** DELETE /api/v1/vault/items/:id stand-in. */
export async function removeVaultItem(item: VaultItem): Promise<void> {
  const store = readStore();
  const next: VaultStore =
    item.kind === "standard"
      ? {
          ...store,
          standardKeys: store.standardKeys.filter(
            (key) => key !== item.standard.key,
          ),
        }
      : {
          ...store,
          documents: store.documents.filter(
            (doc) => doc.id !== item.document.id,
          ),
        };
  writeStore(next);
  return delay(undefined);
}
