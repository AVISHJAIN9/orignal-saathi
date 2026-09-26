import { useCallback, useEffect, useState } from "react";

import {
  listVaultItems,
  removeVaultItem,
  type VaultItem,
} from "@/lib/mock-vault";

/**
 * Loads the signed-in visitor's saved standards/documents for the /vault
 * page. Toggling a save happens where the "Save" action actually lives
 * (Standards Browser, Document Cortex — see toggleStandardSaved /
 * toggleDocumentSaved in mock-vault.ts) rather than here; this hook only
 * needs to list and remove, plus refetch after either.
 */
export function useVault() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const next = await listVaultItems();
    setItems(next);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function remove(item: VaultItem) {
    await removeVaultItem(item);
    await refresh();
  }

  return { items, isLoading, remove, refresh };
}
