import { Bookmark, FileText, ScanSearch } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";

import { AmbientBackground } from "@/components/ambient-background";
import { DocumentDropzone } from "@/components/admin/document-dropzone";
import { DocumentAnalysisResult } from "@/components/document-cortex/document-analysis-result";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  pickDocumentAnalysisResult,
  SEED_RECENT_DOCUMENTS,
  type DocumentAnalysisResult as AnalysisResultData,
  type RecentDocumentEntry,
} from "@/lib/mock-document-analysis";
import { isDocumentSaved, toggleDocumentSaved } from "@/lib/mock-vault";
import { useRole } from "@/lib/role";
import { cn } from "@/lib/utils";

type Stage = "idle" | "analyzing" | "result";

const ANALYZE_MS = 2400;

export function DocumentCortexPage() {
  const { t } = useTranslation(["cortex", "admin"]);
  const { role, ready } = useRole();
  const [stage, setStage] = useState<Stage>("idle");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<AnalysisResultData | null>(null);
  const [currentEntry, setCurrentEntry] = useState<RecentDocumentEntry | null>(
    null,
  );
  const [recentDocuments, setRecentDocuments] = useState<RecentDocumentEntry[]>(
    SEED_RECENT_DOCUMENTS,
  );
  const prefersReducedMotion = useReducedMotion();
  const analyzeTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(analyzeTimeoutRef.current), []);

  function runAnalysis(name: string) {
    setFileName(name);
    setStage("analyzing");
    window.clearTimeout(analyzeTimeoutRef.current);
    analyzeTimeoutRef.current = window.setTimeout(
      () => {
        const nextResult = pickDocumentAnalysisResult(name);
        const entry: RecentDocumentEntry = {
          id: `upload-${Date.now()}`,
          fileName: name,
          resultKey: nextResult.key,
          analyzedAgoKey: "justNow",
        };
        setResult(nextResult);
        setStage("result");
        setCurrentEntry(entry);
        setRecentDocuments((prev) => [
          entry,
          ...prev.filter((doc) => doc.fileName !== name),
        ]);
      },
      prefersReducedMotion ? 200 : ANALYZE_MS,
    );
  }

  function handleFilesAdded(files: FileList) {
    const file = files[0];
    if (!file) return;
    runAnalysis(file.name);
  }

  function reset() {
    setStage("idle");
    setResult(null);
    setFileName("");
    setCurrentEntry(null);
  }

  // Wait for the persisted role before deciding what to show, so the
  // server-rendered markup matches the first client render.
  if (!ready) return null;

  if (role !== "industry" && role !== "admin") {
    return <PlaceholderPage title={t("cortex:title")} allowed={false} />;
  }

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium tracking-wide text-primary uppercase">
              {t("cortex:eyebrow")}
            </span>
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
              {t("cortex:heading")}
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              {t("cortex:subheading")}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              <DocumentDropzone
                onFilesAdded={handleFilesAdded}
                multiple={false}
              />
              <RecentDocumentsSection
                documents={recentDocuments}
                onSelect={runAnalysis}
              />
            </motion.div>
          )}

          {stage === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="elevation-1 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-12 text-center"
            >
              <div className="relative flex size-14 items-center justify-center">
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full border-2 border-primary/50"
                  animate={{ opacity: [0, 0.5, 0], scale: [0.6, 1.3, 1.3] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <motion.span
                  aria-hidden
                  className="relative flex items-center justify-center text-primary"
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ScanSearch className="size-7" aria-hidden />
                </motion.span>
              </div>
              <p className="max-w-xs truncate text-sm font-medium text-foreground">
                {fileName}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("cortex:analyzing")}
              </p>
            </motion.div>
          )}

          {stage === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="flex flex-col gap-4"
            >
              <DocumentAnalysisResult result={result} fileName={fileName} />

              <div className="flex flex-wrap items-center gap-4">
                {currentEntry && <SaveToVaultButton entry={currentEntry} />}
                <button
                  type="button"
                  onClick={reset}
                  className="text-sm font-medium text-primary underline underline-offset-4"
                >
                  {t("cortex:tryAnother")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function RecentDocumentsSection({
  documents,
  onSelect,
}: {
  documents: RecentDocumentEntry[];
  onSelect: (fileName: string) => void;
}) {
  const { t } = useTranslation("cortex");

  if (documents.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-foreground">
        {t("recentDocuments.title")}
      </h2>
      <div className="flex flex-col gap-2">
        {/* Each row is a plain container holding two sibling controls — the
            open-document button (most of the row) and the save button at
            its edge — so neither interactive element is nested in the
            other. */}
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="elevation-1 elevation-lift flex items-center gap-2 rounded-xl border border-border bg-card pe-3 transition-colors hover:bg-muted/50"
          >
            <button
              type="button"
              onClick={() => onSelect(doc.fileName)}
              className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <FileText className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {doc.fileName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {t(`results.${doc.resultKey}.product`)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Badge
                  variant="outline"
                  className="border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                >
                  {t("recentDocuments.analyzedBadge")}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {t(`recentDocuments.${doc.analyzedAgoKey}`)}
                </span>
              </div>
            </button>
            <SaveToVaultButton entry={doc} compact />
          </div>
        ))}
      </div>
    </div>
  );
}

// Saves a document to the Compliance Vault (mock-vault.ts). `compact` is
// the icon-only form used at the edge of a Recent documents row.
function SaveToVaultButton({
  entry,
  compact = false,
}: {
  entry: RecentDocumentEntry;
  compact?: boolean;
}) {
  const { t } = useTranslation(["vault", "cortex"]);
  const [saved, setSaved] = useState(() => isDocumentSaved(entry.id));
  const title = t(`cortex:results.${entry.resultKey}.product`);

  function handleClick(e: MouseEvent) {
    e.stopPropagation();
    void toggleDocumentSaved(entry).then(setSaved);
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={
          saved
            ? t("vault:actions.savedAriaLabel", { title })
            : t("vault:actions.saveAriaLabel", { title })
        }
        aria-pressed={saved}
        title={saved ? t("vault:actions.saved") : t("vault:actions.save")}
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
          saved
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <Bookmark
          className={cn("size-4", saved && "fill-current")}
          aria-hidden
        />
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant={saved ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      className="gap-2 rounded-xl"
    >
      <Bookmark
        className={cn("size-3.5", saved && "fill-current")}
        aria-hidden
      />
      {saved ? t("vault:actions.saved") : t("vault:actions.save")}
    </Button>
  );
}
