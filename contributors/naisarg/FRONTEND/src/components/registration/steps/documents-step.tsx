import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  Clock,
  FileText,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { DocumentDropzone } from "@/components/admin/document-dropzone";
import { Button } from "@/components/ui/button";
import { useVault } from "@/hooks/use-vault";
import {
  getDocumentChecklist,
  resolveConditionalApplicability,
  type ChecklistItemTier,
} from "@/lib/mock-document-checklist";
import type {
  ApplicantType,
  DocumentStatus,
  RequirementDocument,
} from "@/lib/mock-registration";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<DocumentStatus, string> = {
  accepted: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  processing: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  required: "bg-muted text-foreground",
  rejected: "bg-red-500/15 text-red-700 dark:text-red-400",
};

const STATUS_ICONS: Record<DocumentStatus, typeof CheckCircle2> = {
  accepted: CheckCircle2,
  processing: Clock,
  required: CircleDashed,
  rejected: XCircle,
};

const TIER_STYLES: Record<ChecklistItemTier, string> = {
  required: "bg-primary/12 text-primary",
  conditional: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  supporting: "bg-muted text-foreground",
};

interface DocumentsStepProps {
  documents: RequirementDocument[];
  standardKey: string | null;
  applicantType: ApplicantType;
  uploadingKey: string | null;
  onUpload: (documentKey: string, fileName: string) => void;
}

/**
 * S15 — tier badges (Required/Conditional/Supporting) come from
 * mock-document-checklist.ts, keyed by this application's real standard
 * + applicant type, additively alongside the existing
 * accepted/processing/required/rejected upload-status badge. "Select
 * existing" now lists the visitor's real Vault documents (useVault) —
 * previously this listed mock-document-analysis.ts's SEED_RECENT_DOCUMENTS,
 * a second, unrelated document source.
 */
export function DocumentsStep({
  documents,
  standardKey,
  applicantType,
  uploadingKey,
  onUpload,
}: DocumentsStepProps) {
  const { t } = useTranslation("registration");
  const { items: vaultItems } = useVault();
  const vaultDocuments = vaultItems.filter(
    (item): item is Extract<typeof item, { kind: "document" }> =>
      item.kind === "document",
  );
  const checklist = standardKey ? getDocumentChecklist(standardKey) : null;
  const tierByKey =
    checklist?.status === "generated"
      ? new Map(checklist.items.map((item) => [item.key, item.tier]))
      : null;
  // Unlike the Standards page's hypothetical "preview" selector, this
  // applicant type is the real value the visitor already entered in the
  // Applicant step — so a conditional item's applicability is resolved
  // for real here, not previewed.
  const conditionalAppliesByKey =
    checklist?.status === "generated"
      ? new Map(
          checklist.items
            .filter((item) => item.tier === "conditional")
            .map((item) => [
              item.key,
              resolveConditionalApplicability(item.key, applicantType),
            ]),
        )
      : null;

  if (documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("documents.noRequirementsYet")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="elevation-1 flex items-start gap-3 rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
        <AlertTriangle
          className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-400"
          aria-hidden
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            {t("documents.checklistDisclaimer.heading")}
          </p>
          <p className="text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90">
            {t("documents.checklistDisclaimer.body")}
          </p>
        </div>
      </div>

      {documents.map((doc) => (
        <DocumentRow
          key={doc.key}
          document={doc}
          tier={tierByKey?.get(doc.key) ?? null}
          conditionalApplies={conditionalAppliesByKey?.get(doc.key) ?? null}
          isUploading={uploadingKey === doc.key}
          vaultDocuments={vaultDocuments.map((item) => item.document)}
          onUpload={(fileName) => onUpload(doc.key, fileName)}
        />
      ))}
    </div>
  );
}

function DocumentRow({
  document,
  tier,
  conditionalApplies,
  isUploading,
  vaultDocuments,
  onUpload,
}: {
  document: RequirementDocument;
  tier: ChecklistItemTier | null;
  conditionalApplies: boolean | null;
  isUploading: boolean;
  vaultDocuments: { id: string; fileName: string }[];
  onUpload: (fileName: string) => void;
}) {
  const { t } = useTranslation("registration");
  const [expanded, setExpanded] = useState<"dropzone" | "existing" | null>(
    null,
  );
  const Icon = STATUS_ICONS[document.status];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {document.label}
          </span>
          {tier && (
            <span
              className={cn(
                "inline-flex w-fit shrink-0 items-center rounded-full px-2 py-0.5 text-2xs font-semibold uppercase",
                TIER_STYLES[tier],
              )}
            >
              {t(`documents.tiers.${tier}`)}
            </span>
          )}
        </span>
        <span
          className={cn(
            "inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-2xs font-semibold uppercase",
            STATUS_STYLES[document.status],
          )}
        >
          <Icon className="size-3" aria-hidden />
          {t(`documents.status.${document.status}`)}
        </span>
      </div>

      {tier === "conditional" && conditionalApplies !== null && (
        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
          {conditionalApplies
            ? t("documents.conditionalApplies")
            : t("documents.conditionalNotApplicable")}
        </p>
      )}

      {document.fileName && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileText className="size-3.5 shrink-0" aria-hidden />
          {document.fileName}
        </p>
      )}

      {document.status === "rejected" && document.rejectionReason && (
        <p className="text-xs text-destructive">{document.rejectionReason}</p>
      )}

      {isUploading ? (
        <p className="text-sm text-muted-foreground">
          {t("documents.uploading")}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setExpanded(expanded === "dropzone" ? null : "dropzone")
            }
          >
            {t("documents.uploadNew")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setExpanded(expanded === "existing" ? null : "existing")
            }
          >
            {t("documents.selectExisting")}
          </Button>
        </div>
      )}

      {expanded === "dropzone" && !isUploading && (
        <DocumentDropzone
          multiple={false}
          onFilesAdded={(files) => {
            const file = files[0];
            if (file) {
              onUpload(file.name);
              setExpanded(null);
            }
          }}
        />
      )}

      {expanded === "existing" && !isUploading && (
        <div className="flex flex-col gap-1.5 rounded-lg border border-dashed border-border p-2">
          {vaultDocuments.length === 0 ? (
            <p className="px-2 py-1.5 text-xs text-muted-foreground">
              {t("documents.vaultEmpty")}
            </p>
          ) : (
            vaultDocuments.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => {
                  onUpload(entry.fileName);
                  setExpanded(null);
                }}
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span className="truncate">{entry.fileName}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
