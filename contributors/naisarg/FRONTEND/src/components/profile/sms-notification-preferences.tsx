import { MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Switch } from "@/components/ui/switch";

const SMS_CATEGORY_KEYS = ["renewalAlerts", "criticalStatusChanges"] as const;

/**
 * S14 — UI-only scaffolding for a future SMS notification channel. This
 * repo has no SMS provider, no phone-number field on the account, and no
 * backend to call, so every toggle here is permanently disabled rather
 * than simulating an enabled state, a masked phone number, or delivery
 * status that would misrepresent what this prototype can actually do.
 */
export function SmsNotificationPreferences() {
  const { t } = useTranslation("profile");

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
        <MessageSquare className="size-4 text-primary" aria-hidden />
        {t("preferences.sms.heading")}
      </span>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("preferences.sms.intro")}
      </p>

      <div className="flex flex-col gap-2">
        {SMS_CATEGORY_KEYS.map((key) => (
          <div
            key={key}
            className="flex flex-col gap-2 rounded-lg border border-dashed border-border bg-background/60 px-3 py-3 opacity-80 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <span>
              <span className="block text-sm font-medium text-foreground">
                {t(`preferences.sms.categories.${key}.label`)}
              </span>
              <span className="block text-xs text-muted-foreground">
                {t(`preferences.sms.categories.${key}.description`)}
              </span>
              <span className="mt-1 block text-2xs font-medium text-muted-foreground">
                {t("preferences.sms.unavailableNote")}
              </span>
            </span>
            <Switch
              checked={false}
              disabled
              aria-label={t(`preferences.sms.categories.${key}.label`)}
              className="shrink-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
