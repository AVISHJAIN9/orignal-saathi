import { useTranslation } from "react-i18next";
import {
  FileText,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Layers,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AppealEvidence } from "@/lib/appeals-api";
import { cn } from "@/lib/utils";

interface SupportingEvidenceProps {
  evidence: AppealEvidence[];
  className?: string;
}

export function SupportingEvidence({ evidence, className }: SupportingEvidenceProps) {
  const { t } = useTranslation(["appeals"]);

  if (!evidence || evidence.length === 0) {
    return (
      <div className={cn("rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground", className)}>
        {t("appeals:evidence.empty")}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {evidence.map((doc) => (
        <div
          key={doc.id}
          className="group relative flex flex-col gap-2 rounded-xl border border-border/50 bg-card/80 p-3.5 shadow-sm transition-all hover:border-primary/30 dark:border-border/50 dark:bg-card/40 sm:p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs font-semibold text-foreground sm:text-sm">
                  {doc.fileName}
                </span>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-2xs py-0 px-1.5 font-normal">
                    {doc.category}
                  </Badge>

                  {doc.source === "vault" ? (
                    <Badge variant="outline" className="gap-1 border-blue-500/30 bg-blue-500/10 text-2xs text-blue-700 dark:text-blue-300 py-0 px-1.5">
                      <Layers className="size-2.5" />
                      {t("appeals:evidence.fromVault")}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-border text-2xs text-muted-foreground py-0 px-1.5">
                      Uploaded File
                    </Badge>
                  )}

                  {doc.fileSize && (
                    <span className="font-mono text-2xs text-muted-foreground">
                      {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  )}
                </div>
              </div>
            </div>

            <time className="font-mono text-2xs text-muted-foreground shrink-0">
              {doc.uploadedAt}
            </time>
          </div>

          {/* Document Cortex verification chip */}
          {doc.cortexVerified && (
            <div className="mt-1 flex flex-col gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                  <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  {t("appeals:evidence.cortexAnalyzed")}
                </span>
                {doc.cortexScore && (
                  <span className="font-mono text-2xs font-medium text-emerald-700 dark:text-emerald-400">
                    {t("appeals:evidence.cortexScore", { score: doc.cortexScore })}
                  </span>
                )}
              </div>
              {doc.cortexSummary && (
                <p className="text-2xs text-emerald-900/80 dark:text-emerald-200/80 leading-snug">
                  {doc.cortexSummary}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
