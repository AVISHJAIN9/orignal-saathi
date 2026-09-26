import { useTranslation } from "react-i18next";

import { LANGUAGES, type Language } from "@/i18n";
import { SUPPORTED_LANGUAGES } from "@/i18n/languages";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// LANGUAGES (src/i18n/index.ts) is the list of locales with real translation
// resources registered — the only ones this dropdown offers. Adding a
// language later means adding it there (plus its resource bundles); this
// component picks it up automatically. SUPPORTED_LANGUAGES only supplies the
// native-script label for each already-registered code.
const NATIVE_NAME = Object.fromEntries(
  LANGUAGES.map((code) => [
    code,
    SUPPORTED_LANGUAGES.find((language) => language.code === code)
      ?.nativeName ?? code,
  ]),
) as Record<Language, string>;

/**
 * A language picker re-themed in the plate world for the landing page.
 * Kept separate from @/components/language-toggle so the chat app's own
 * toggle (and its --primary token) stays completely untouched.
 */
export function LandingLanguageToggle({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const current = i18n.language as Language;

  return (
    <Select value={current} onValueChange={(code) => i18n.changeLanguage(code)}>
      <SelectTrigger
        aria-label="Select language"
        className={cn(
          "h-auto w-auto gap-1.5 rounded-sm border-[var(--plate-line)] bg-transparent px-2.5 py-1.5 font-mono text-xs font-semibold tracking-wide text-[var(--plate-ink)] uppercase shadow-none focus:ring-[var(--plate-accent-line)]",
          className,
        )}
      >
        <SelectValue>{NATIVE_NAME[current]}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end" className="border-border">
        {LANGUAGES.map((code) => (
          <SelectItem
            key={code}
            value={code}
            className="font-mono text-xs tracking-wide uppercase"
          >
            {NATIVE_NAME[code]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
