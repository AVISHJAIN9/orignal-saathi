import { AlertTriangle, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * S16 — placeholder-but-labeled-as-such Grievance Officer contact block.
 * No real BIS-appointed Grievance Officer data exists anywhere in this
 * repo, so every field below is an obviously-fake placeholder (a .test
 * domain, an all-zero phone number) rather than something that could be
 * mistaken for a real contact — same honesty bar as the payment/document
 * disclaimers elsewhere in this prototype.
 */
export function GrievanceOfficerSection() {
  const { t } = useTranslation("grievance");

  return (
    <div className="elevation-1 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <UserRound className="size-5 text-primary" aria-hidden />
        <h2 className="text-lg font-semibold text-foreground">
          {t("officer.heading")}
        </h2>
      </div>

      <div className="elevation-1 flex items-start gap-3 rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
        <AlertTriangle
          className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-400"
          aria-hidden
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            {t("officer.disclaimer.heading")}
          </p>
          <p className="text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90">
            {t("officer.disclaimer.body")}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">
            {t("officer.designationLabel")}
          </dt>
          <dd className="font-medium text-foreground">
            {t("officer.designationValue")}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">
            {t("officer.nameLabel")}
          </dt>
          <dd className="font-medium text-foreground">
            {t("officer.nameValue")}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mail className="size-3" aria-hidden />
            {t("officer.emailLabel")}
          </dt>
          <dd className="font-mono font-medium text-foreground">
            {t("officer.emailValue")}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="size-3" aria-hidden />
            {t("officer.phoneLabel")}
          </dt>
          <dd className="font-mono font-medium text-foreground">
            {t("officer.phoneValue")}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:col-span-2">
          <dt className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" aria-hidden />
            {t("officer.addressLabel")}
          </dt>
          <dd className="font-medium text-foreground">
            {t("officer.addressValue")}
          </dd>
        </div>
      </dl>
    </div>
  );
}
