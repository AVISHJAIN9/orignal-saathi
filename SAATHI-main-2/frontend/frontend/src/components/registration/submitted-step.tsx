import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { BrandMark } from "@/components/brand-mark";

interface SubmittedStepProps {
  applicationId: string;
  submittedAt: string;
}

/**
 * Application ID and timestamp come only from submitApplication's mock
 * response (see mock-registration.ts) — never a client-generated id or
 * Math.random(). The copy is explicit that this is a prototype flow, not
 * a real BIS filing, so nothing here can be read as "your application was
 * actually submitted to BIS."
 */
export function SubmittedStep({
  applicationId,
  submittedAt,
}: SubmittedStepProps) {
  const { t, i18n } = useTranslation("registration");
  const submittedDate = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(submittedAt));

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-300 bg-emerald-50 p-8 text-center dark:border-emerald-900/50 dark:bg-emerald-950/20">
      <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="size-7" aria-hidden />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        {t("submitted.heading")}
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
        <div className="flex items-center justify-center gap-2">
          <dt className="text-muted-foreground">
            {t("submitted.submittedAtLabel")}
          </dt>
          <dd className="font-medium text-foreground">{submittedDate}</dd>
        </div>
      </dl>

      <div className="elevation-1 flex items-start gap-2 rounded-xl border border-border bg-background px-4 py-3 text-left text-xs text-muted-foreground">
        <BrandMark size="sm" />
        <span className="pt-0.5">{t("submitted.demoNotice")}</span>
      </div>

      <Link
        to="/dashboard"
        className="text-sm font-medium text-primary underline underline-offset-4"
      >
        {t("submitted.backToDashboard")}
      </Link>
    </div>
  );
}
