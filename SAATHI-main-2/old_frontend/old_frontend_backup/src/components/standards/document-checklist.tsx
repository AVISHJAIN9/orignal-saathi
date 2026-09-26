import { AlertTriangle, FileStack, ListChecks } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getDocumentChecklist,
  resolveConditionalApplicability,
  type ChecklistItem,
  type ChecklistItemTier,
} from "@/lib/mock-document-checklist";
import type { ApplicantType } from "@/lib/mock-registration";
import { cn } from "@/lib/utils";

const TIER_ORDER: ChecklistItemTier[] = [
  "required",
  "conditional",
  "supporting",
];

const TIER_STYLES: Record<ChecklistItemTier, string> = {
  required: "bg-primary/12 text-primary",
  conditional: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  supporting: "bg-slate-500/15 text-slate-700 dark:text-slate-400",
};

const APPLICANT_TYPES: Exclude<ApplicantType, "">[] = [
  "manufacturer",
  "importer",
  "dealer",
  "individual",
];

interface DocumentChecklistProps {
  standardKey: string;
  standardNumber: string;
}

/**
 * S15 — read-only registration document checklist for the Standards
 * Detail Requirements tab. No upload/select-existing controls here: there
 * is no application to attach documents to on this page (see
 * DocumentsStep in the registration wizard for that, which has the real
 * `application.documents` store to write into). This view only tells the
 * visitor what a registration for this standard would ask for, and links
 * to where they can actually act on it.
 */
export function DocumentChecklist({
  standardKey,
  standardNumber,
}: DocumentChecklistProps) {
  const { t } = useTranslation(["standards", "registration"]);
  const [previewApplicantType, setPreviewApplicantType] = useState<
    ApplicantType | ""
  >("");

  const outcome = getDocumentChecklist(standardKey);

  if (outcome.status === "no_checklist_data") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 py-12 text-center">
        <ListChecks className="size-6 text-muted-foreground/50" aria-hidden />
        <p className="max-w-xs text-sm text-muted-foreground">
          {t("standards:detail.notYetAvailable", { standard: standardNumber })}
        </p>
        <Link
          to="/chat"
          className="text-xs font-medium text-primary underline underline-offset-4"
        >
          {t("standards:detail.askInChat")}
        </Link>
      </div>
    );
  }

  const itemsByTier = TIER_ORDER.map((tier) => ({
    tier,
    items: outcome.items.filter((item) => item.tier === tier),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="elevation-1 flex items-start gap-3 rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
        <AlertTriangle
          className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-400"
          aria-hidden
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            {t("standards:detail.documentChecklist.disclaimer.heading")}
          </p>
          <p className="text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90">
            {t("standards:detail.documentChecklist.disclaimer.body")}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-4">
        <span className="text-xs font-semibold text-foreground">
          {t("standards:detail.documentChecklist.previewLabel")}
        </span>
        <p className="text-[0.7rem] leading-relaxed text-muted-foreground">
          {t("standards:detail.documentChecklist.previewNote")}
        </p>
        <Select
          value={previewApplicantType}
          onValueChange={(value) =>
            setPreviewApplicantType(value as ApplicantType)
          }
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue
              placeholder={t("registration:applicant.typePlaceholder")}
            />
          </SelectTrigger>
          <SelectContent>
            {APPLICANT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {t(`registration:applicant.types.${type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4">
        {itemsByTier.map(({ tier, items }) => (
          <div key={tier} className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {t(`standards:detail.documentChecklist.tiers.${tier}`)}
            </h3>
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <ChecklistRow
                  key={item.key}
                  item={item}
                  previewApplicantType={previewApplicantType}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-border pt-4">
        <Link to="/register" className={cn(buttonVariants({ size: "sm" }))}>
          {t("standards:detail.documentChecklist.startRegistration")}
        </Link>
        <Link
          to="/vault"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1.5",
          )}
        >
          <FileStack className="size-4" aria-hidden />
          {t("standards:detail.documentChecklist.openVault")}
        </Link>
      </div>
    </div>
  );
}

function ChecklistRow({
  item,
  previewApplicantType,
}: {
  item: ChecklistItem;
  previewApplicantType: ApplicantType | "";
}) {
  const { t } = useTranslation("standards");
  const applicability =
    item.tier === "conditional"
      ? resolveConditionalApplicability(item.key, previewApplicantType)
      : null;

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground">
          {item.label}
        </span>
        <span
          className={cn(
            "inline-flex w-fit shrink-0 items-center rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase",
            TIER_STYLES[item.tier],
          )}
        >
          {t(`detail.documentChecklist.tiers.${item.tier}`)}
        </span>
      </div>
      {item.clause && (
        <p className="text-xs text-muted-foreground">
          {t("detail.documentChecklist.clauseLabel", { clause: item.clause })}
        </p>
      )}
      {item.conditionalNote && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {item.conditionalNote}
        </p>
      )}
      {item.tier === "conditional" && (
        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
          {applicability === null
            ? t("detail.documentChecklist.previewUnresolved")
            : applicability
              ? t("detail.documentChecklist.previewApplies")
              : t("detail.documentChecklist.previewNotApplicable")}
        </p>
      )}
    </div>
  );
}
