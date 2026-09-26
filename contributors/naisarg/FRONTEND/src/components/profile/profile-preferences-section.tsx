import { Check, Globe, Laptop, Moon, Save, Sliders, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { CosmeticPreferencesForm } from "@/components/profile/cosmetic-preferences-form";
import { SmsNotificationPreferences } from "@/components/profile/sms-notification-preferences";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/language-toggle";
import { useTheme, type Theme } from "@/components/theme-provider";
import type { UserProfile } from "@/lib/profile";
import { cn } from "@/lib/utils";

const THEME_OPTIONS: { value: Theme; icon: typeof Sun }[] = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Laptop },
];

interface ProfilePreferencesSectionProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

/** Renders the exact same CosmeticPreferencesForm the sidebar's
 * ProfileSettings dialog uses — this section just owns its own draft
 * state and save button around it, since a full page (unlike a dialog)
 * has nowhere to "cancel" back to. */
export function ProfilePreferencesSection({
  profile,
  onSave,
}: ProfilePreferencesSectionProps) {
  const { t } = useTranslation(["profile", "chat"]);
  const { theme, setTheme } = useTheme();
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  function handleSave() {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="elevation-1 flex flex-col gap-6 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Sliders className="size-5 text-primary" aria-hidden />
          <h2 className="text-lg font-semibold text-foreground">
            {t("preferences.heading")}
          </h2>
        </div>
        {saved && (
          <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Check className="size-3.5" aria-hidden />
            {t("preferences.saved")}
          </span>
        )}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("preferences.body")}
      </p>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-4">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Globe className="size-4 text-primary" aria-hidden />
          {t("preferences.languageLabel")}
        </span>
        <LanguageToggle />
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-4">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Sun className="size-4 text-primary" aria-hidden />
          {t("preferences.theme.heading", "Theme")}
        </span>
        <div
          className="flex gap-2"
          role="radiogroup"
          aria-label={t("preferences.theme.heading", "Theme")}
        >
          {THEME_OPTIONS.map(({ value, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={theme === value}
              onClick={() => setTheme(value)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                theme === value
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {t(`preferences.theme.${value}`, value)}
            </button>
          ))}
        </div>
      </div>

      <CosmeticPreferencesForm draft={draft} onChange={setDraft} />

      <SmsNotificationPreferences />

      <div className="flex justify-end border-t border-border pt-4">
        <Button type="button" onClick={handleSave} className="gap-2">
          <Save className="size-4" aria-hidden />
          {t("chat:profile.save")}
        </Button>
      </div>
    </div>
  );
}
