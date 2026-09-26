import { FileClock, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { BisSeal } from "@/components/bis-marks";
import { Button } from "@/components/ui/button";
import { minutesAgo, type Application } from "@/lib/mock-registration";
import { getStandardByKey } from "@/lib/mock-standards";

interface DraftPickerProps {
  drafts: Application[];
  onResume: (id: string) => void;
  onStartFresh: () => void;
}

/**
 * S29 — shown only when listDrafts() finds more than one in-progress
 * application; with zero or one draft, RegistrationWizard keeps its
 * original seamless auto-resume and this component never renders.
 */
export function DraftPicker({
  drafts,
  onResume,
  onStartFresh,
}: DraftPickerProps) {
  const { t } = useTranslation("registration");

  return (
    <div className="elevation-1 flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <BisSeal className="size-7 shrink-0 text-primary" aria-hidden />
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-semibold text-foreground">
            {t("draftPicker.heading")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("draftPicker.body")}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {drafts.map((draft) => {
          const standard = draft.product.suggestedStandardKey
            ? getStandardByKey(draft.product.suggestedStandardKey)
            : undefined;
          const minutes = minutesAgo(draft.updatedAt);
          return (
            <div
              key={draft.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">
                  {draft.product.productName ||
                    t("draftPicker.untitledApplication")}
                </span>
                {(standard || draft.business.organizationName) && (
                  <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {standard && (
                      <span className="font-mono font-semibold text-primary">
                        {standard.standardNumber}
                      </span>
                    )}
                    {draft.business.organizationName}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FileClock className="size-3" aria-hidden />
                  {minutes < 1
                    ? t("savedJustNow")
                    : t("draftSavedMinutesAgo", { count: minutes })}
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => onResume(draft.id)}
              >
                {t("draftPicker.resumeButton")}
              </Button>
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-fit gap-1.5"
        onClick={onStartFresh}
      >
        <Plus className="size-4" aria-hidden />
        {t("draftPicker.startFreshButton")}
      </Button>
    </div>
  );
}
