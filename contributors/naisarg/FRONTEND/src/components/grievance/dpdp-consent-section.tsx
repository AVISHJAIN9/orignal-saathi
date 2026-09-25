import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  acceptConsent,
  getConsentRecord,
  type ConsentRecord,
} from "@/lib/mock-consent";

type LoadState = "loading" | "ready";

/**
 * S16 — DPDP consent notice + accept action. Acceptance is recorded via
 * mock-consent.ts, keyed by the signed-in user's id (not one shared
 * localStorage key) precisely because a consent record — unlike Vault or
 * a registration draft — must never appear to have been given by someone
 * who didn't actually give it, even on a shared demo device.
 */
export function DpdpConsentSection() {
  const { t } = useTranslation("grievance");
  const { currentUser } = useAuth();

  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setLoadState("ready");
      return;
    }
    let cancelled = false;
    setLoadState("loading");
    getConsentRecord(currentUser.id).then((result) => {
      if (cancelled) return;
      setRecord(result);
      setLoadState("ready");
    });
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  async function handleAccept() {
    if (!currentUser) return;
    setIsSubmitting(true);
    try {
      const result = await acceptConsent(currentUser.id);
      setRecord(result);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="elevation-1 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-5 text-primary" aria-hidden />
        <h2 className="text-lg font-semibold text-foreground">
          {t("consent.heading")}
        </h2>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("consent.prototypeNote")}
      </p>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed text-foreground">
        <p>{t("consent.noticeIntro")}</p>
        <ul className="list-disc pl-5 text-sm text-foreground">
          <li>{t("consent.noticeItems.purpose")}</li>
          <li>{t("consent.noticeItems.dataUsed")}</li>
          <li>{t("consent.noticeItems.retention")}</li>
          <li>{t("consent.noticeItems.rights")}</li>
        </ul>
      </div>

      {!currentUser ? (
        <p className="text-sm text-muted-foreground">
          {t("consent.signInToRecord")}
        </p>
      ) : loadState === "loading" ? (
        <p className="text-sm text-muted-foreground">{t("consent.loading")}</p>
      ) : record?.accepted ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          {t("consent.acceptedOn", {
            date: new Date(record.acceptedAt).toLocaleString(),
          })}
        </div>
      ) : (
        <Button
          type="button"
          onClick={() => void handleAccept()}
          disabled={isSubmitting}
          className="w-fit"
        >
          {isSubmitting ? t("consent.submitting") : t("consent.acceptButton")}
        </Button>
      )}
    </div>
  );
}
