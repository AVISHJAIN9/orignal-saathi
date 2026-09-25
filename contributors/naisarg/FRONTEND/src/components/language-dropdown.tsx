import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SUPPORTED_LANGUAGES } from "@/i18n/languages";

// Group languages by speaker volume hierarchy without numeric counts
const LANGUAGE_GROUPS = [
  {
    label: "Primary & Major Languages",
    codes: ["hi", "en", "bn", "mr", "te", "ta", "gu", "ur"],
  },
  {
    label: "Regional Languages",
    codes: ["kn", "or", "ml", "pa", "as", "mai"],
  },
  {
    label: "Scheduled Languages",
    codes: ["sat", "ks", "ne", "doi", "kok", "mni", "brx", "sa"],
  },
];

interface LanguageDropdownProps {
  className?: string;
  /** compact: shows short code (EN/HI); full: shows native name */
  variant?: "compact" | "full";
  /** "full" variant only: breakpoint from which the native name replaces
   * the short code. */
  fullNameFrom?: keyof typeof FULL_NAME_CLASSES;
  /** Override for landing page plate palette */
  plateTheme?: boolean;
}

// Where the "full" variant switches from the short code (EN) to the native
// name. Static class strings so Tailwind can see them.
const FULL_NAME_CLASSES = {
  sm: {
    code: "sm:hidden",
    name: "hidden sm:inline",
    minWidth: "sm:min-w-[7rem]",
  },
  "2xl": {
    code: "2xl:hidden",
    name: "hidden 2xl:inline",
    minWidth: "2xl:min-w-[7rem]",
  },
} as const;

export function LanguageDropdown({
  className,
  variant = "full",
  fullNameFrom = "sm",
  plateTheme = false,
}: LanguageDropdownProps) {
  const full = FULL_NAME_CLASSES[fullNameFrom];
  const { i18n } = useTranslation();
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language);
  const displayValue =
    variant === "compact"
      ? (currentLang?.code.toUpperCase() ?? "EN")
      : (currentLang?.nativeName ?? "English");

  return (
    <Select value={i18n.language} onValueChange={(v) => i18n.changeLanguage(v)}>
      <SelectTrigger
        className={cn(
          "h-8 gap-1 font-mono text-xs",
          variant === "full" && full.minWidth,
          plateTheme &&
            "border-[var(--plate-line)] bg-transparent text-[var(--plate-ink)] focus:ring-[var(--plate-accent)]",
          className,
        )}
      >
        <SelectValue>
          {variant === "full" ? (
            <>
              {/* Short code on phones, full native name from sm up */}
              <span className={full.code}>
                {currentLang?.code.toUpperCase() ?? "EN"}
              </span>
              <span className={full.name}>{displayValue}</span>
            </>
          ) : (
            displayValue
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {LANGUAGE_GROUPS.map((group) => {
          const langs = group.codes
            .map((code) => SUPPORTED_LANGUAGES.find((l) => l.code === code))
            .filter(Boolean) as typeof SUPPORTED_LANGUAGES;
          if (!langs.length) return null;
          return (
            <SelectGroup key={group.label}>
              <SelectLabel className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                {group.label}
              </SelectLabel>
              {langs.map((lang) => (
                <SelectItem
                  key={lang.code}
                  value={lang.code}
                  className="flex items-center justify-between gap-2"
                >
                  <span>{lang.nativeName}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          );
        })}
      </SelectContent>
    </Select>
  );
}
