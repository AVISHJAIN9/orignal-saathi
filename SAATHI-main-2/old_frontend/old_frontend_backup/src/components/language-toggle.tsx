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

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const current = i18n.language as Language;

  return (
    <Select value={current} onValueChange={(code) => i18n.changeLanguage(code)}>
      <SelectTrigger
        aria-label="Select language"
        className="h-auto w-auto gap-1.5 rounded-lg border-border bg-transparent px-2 py-1 text-xs font-medium shadow-none"
      >
        <SelectValue>{NATIVE_NAME[current]}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {LANGUAGES.map((code) => (
          <SelectItem key={code} value={code}>
            {NATIVE_NAME[code]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
