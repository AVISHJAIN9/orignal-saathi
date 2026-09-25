import { XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

interface RejectedStepProps {
  applicationId: string;
  rejectionReason: string;
  onStartReapplication: () => void;
  isCreatingReapplication: boolean;
}

/**
 * S17 — shown in place of the wizard steps once submitApplication()
 * resolves an application to "rejected" (see mock-registration.ts's
 * resolveSubmissionOutcome). rejectionReason is always the mock backend's
 * own text — never invented here. "Start New Application" hands off to
 * createReapplication(), which pre-fills a fresh draft from this
 * application's applicant/business/product details and lands the wizard
 * back at Review rather than a blank Applicant step.
 */
export function RejectedStep({
  applicationId,
  rejectionReason,
  onStartReapplication,
  isCreatingReapplication,
}: RejectedStepProps) {
  const { t } = useTranslation("registration");

  return (
    <div className="elevation-1 flex flex-col items-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
        <XCircle className="size-7" aria-hidden />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        {t("rejected.heading")}
      </h2>
      <dl className="flex flex-col gap-1 text-sm">
        <div className="flex items-center justify-center gap-2">
          <dt className="text-muted-foreground">
            {t("submitted.applicationIdLabel")}
          </dt>
          <dd className="font-mono font-semibold text-foreground">
            {applicationId}
          </dd>
        </div>
      </dl>

      <div className="w-full rounded-xl border border-destructive/30 bg-background px-4 py-3 text-left text-sm text-foreground">
        <p className="text-xs font-semibold tracking-wide text-destructive uppercase">
          {t("rejected.reasonLabel")}
        </p>
        <p className="mt-1 leading-relaxed">{rejectionReason}</p>
      </div>

      <Button
        type="button"
        onClick={onStartReapplication}
        disabled={isCreatingReapplication}
      >
        {isCreatingReapplication
          ? t("rejected.startingReapplication")
          : t("rejected.startReapplication")}
      </Button>
    </div>
  );
}
