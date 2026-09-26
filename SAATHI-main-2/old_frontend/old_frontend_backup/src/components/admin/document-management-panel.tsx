import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { AmbientBackground } from "@/components/ambient-background";
import { DocumentDropzone } from "@/components/admin/document-dropzone";
import { DocumentStatusBadge } from "@/components/admin/document-status-badge";
import { Button } from "@/components/ui/button";
import { SEED_DOCUMENTS, type DocumentRow } from "@/lib/mock-documents";

// "a couple of seconds" of simulated processing before Re-ingest resolves.
const REINGEST_DELAY_MS = 2000;

export function DocumentManagementPanel() {
  const { t, i18n } = useTranslation(["admin", "standards"]);
  const [documents, setDocuments] = useState<DocumentRow[]>(SEED_DOCUMENTS);
  const reingestTimeoutsRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const timeouts = reingestTimeoutsRef.current;
    return () => {
      Object.values(timeouts).forEach(window.clearTimeout);
    };
  }, []);

  function handleFilesAdded(files: FileList) {
    const newDocs: DocumentRow[] = Array.from(files).map((file, index) => ({
      id: `upload-${Date.now()}-${index}-${file.name}`,
      kind: "upload",
      fileName: file.name,
      status: "queued",
      lastUpdated: new Date().toISOString(),
    }));
    setDocuments((prev) => [...newDocs, ...prev]);
  }

  function handleReingest(id: string) {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status: "processing" } : doc)),
    );

    const timeoutId = window.setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? { ...doc, status: "indexed", lastUpdated: new Date().toISOString() }
            : doc,
        ),
      );
      delete reingestTimeoutsRef.current[id];
    }, REINGEST_DELAY_MS);
    reingestTimeoutsRef.current[id] = timeoutId;
  }

  function handleRetire(id: string) {
    const pendingTimeout = reingestTimeoutsRef.current[id];
    if (pendingTimeout !== undefined) {
      window.clearTimeout(pendingTimeout);
      delete reingestTimeoutsRef.current[id];
    }
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  }

  function getDocumentName(doc: DocumentRow) {
    return doc.kind === "seed"
      ? `${doc.standardNumber} — ${t(`standards:list.${doc.key}`)}`
      : doc.fileName;
  }

  function getCategoryLabel(doc: DocumentRow) {
    return doc.kind === "seed"
      ? t(`admin:topics.${doc.categoryKey}`)
      : t("admin:documents.uncategorized");
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
            {t("admin:documents.pageTitle")}
          </h1>
          <Link
            to="/chat"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            {t("admin:backToChat")}
          </Link>
        </div>

        <DocumentDropzone onFilesAdded={handleFilesAdded} />

        <div className="elevation-2 custom-scrollbar overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-border bg-muted">
                <th className="px-4 py-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {t("admin:documents.table.name")}
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {t("admin:documents.table.category")}
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {t("admin:documents.table.status")}
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {t("admin:documents.table.lastUpdated")}
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {t("admin:documents.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="elevation-transition relative border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                >
                  <td
                    className="max-w-[240px] truncate px-4 py-3 font-medium text-foreground"
                    title={getDocumentName(doc)}
                  >
                    {getDocumentName(doc)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {getCategoryLabel(doc)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <DocumentStatusBadge status={doc.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatDate(doc.lastUpdated)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={() => handleReingest(doc.id)}
                        disabled={doc.status === "processing"}
                      >
                        {t("admin:documents.reingest")}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => handleRetire(doc.id)}
                      >
                        {t("admin:documents.retire")}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                    {t("admin:documents.emptyState")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
