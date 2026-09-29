import {
  MOCK_STANDARDS,
  getStandardByKey,
  registerAllStandards,
  type StandardDatum,
} from "@/lib/mock-standards";
import type { RecentDocumentEntry } from "@/lib/mock-document-analysis";

const VAULT_STORAGE_KEY = "saathi:vault";
const LATENCY_MS = 200;

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
  savedStandards?: Record<string, StandardDatum>;
  documents: SavedDocumentRecord[];
}

const EMPTY_STORE: VaultStore = { standardKeys: [], savedStandards: {}, documents: [] };

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
    if (!isVaultStore(parsed)) return EMPTY_STORE;
    if (!parsed.savedStandards || typeof parsed.savedStandards !== "object") {
      parsed.savedStandards = {};
    }
    return parsed as VaultStore;
  } catch {
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

let standardsFetchPromise: Promise<void> | null = null;
async function fetchAndIndexStandards(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!standardsFetchPromise) {
    standardsFetchPromise = (async () => {
      try {
        const res = await fetch("/data/standards.json");
        if (!res.ok) return;
        const data = await res.json();
        if (data && Array.isArray(data.rows)) {
          const unpacked: StandardDatum[] = data.rows.map((r: any[]) => ({
            id: r[0],
            key: r[1],
            standardNumber: r[2],
            title: r[3],
            description: r[4],
            categoryKey: r[5],
            categoryLabel: r[6],
            status: r[7],
          }));
          registerAllStandards(unpacked);
        }
      } catch (err) {
        console.warn("Vault standards index fetch error:", err);
      }
    })();
  }
  await standardsFetchPromise;
}

/** GET /api/v1/vault/items stand-in. */
export async function listVaultItems(): Promise<VaultItem[]> {
  const store = readStore();

  // If any standard keys are not yet in savedStandards or memory, attempt to load standards.json
  const missingKeys = store.standardKeys.filter(
    (key) => !store.savedStandards?.[key] && !getStandardByKey(key),
  );
  if (missingKeys.length > 0) {
    await fetchAndIndexStandards();
  }

  const standardItems: VaultItem[] = store.standardKeys.map((key) => {
    let standard =
      store.savedStandards?.[key] ||
      getStandardByKey(key) ||
      MOCK_STANDARDS.find((s) => s.key === key);

    if (!standard) {
      // Fallback object so bookmarked standards never vanish
      standard = {
        key,
        standardNumber: key.toUpperCase().replace(/^IS-?/, "IS "),
        title: `Indian Standard (${key})`,
        categoryKey: "general",
        categoryLabel: "Standards",
        status: "Active",
      };
    }

    return {
      kind: "standard",
      id: vaultItemId("standard", standard.key),
      standard,
    };
  });

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
  standardData?: Partial<StandardDatum>,
): Promise<boolean> {
  const store = readStore();
  const alreadySaved = store.standardKeys.includes(standardKey);
  const nextSavedStandards = { ...(store.savedStandards || {}) };

  let nextStandardKeys: string[];
  if (alreadySaved) {
    nextStandardKeys = store.standardKeys.filter((key) => key !== standardKey);
    delete nextSavedStandards[standardKey];
  } else {
    nextStandardKeys = [...store.standardKeys, standardKey];
    if (standardData && standardData.standardNumber) {
      nextSavedStandards[standardKey] = {
        key: standardKey,
        standardNumber: standardData.standardNumber,
        categoryKey: standardData.categoryKey || "general",
        id: standardData.id,
        title: standardData.title,
        description: standardData.description,
        categoryLabel: standardData.categoryLabel,
        status: standardData.status,
      };
    } else {
      const found = getStandardByKey(standardKey);
      if (found) {
        nextSavedStandards[standardKey] = found;
      }
    }
  }

  const next: VaultStore = {
    ...store,
    standardKeys: nextStandardKeys,
    savedStandards: nextSavedStandards,
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
  let next: VaultStore;
  if (item.kind === "standard") {
    const nextSaved = { ...(store.savedStandards || {}) };
    delete nextSaved[item.standard.key];
    next = {
      ...store,
      standardKeys: store.standardKeys.filter(
        (key) => key !== item.standard.key,
      ),
      savedStandards: nextSaved,
    };
  } else {
    next = {
      ...store,
      documents: store.documents.filter(
        (doc) => doc.id !== item.document.id,
      ),
    };
  }
  writeStore(next);
  return delay(undefined);
}

