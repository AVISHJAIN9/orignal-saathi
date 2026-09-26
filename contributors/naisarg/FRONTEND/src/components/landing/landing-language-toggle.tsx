import { LanguageDropdown } from "@/components/language-dropdown";
import { cn } from "@/lib/utils";

/**
 * A language selector re-themed in the plate world for the landing page.
 * Kept separate from @/components/language-dropdown so the landing page's
 * own plate palette (--plate-* tokens) is applied cleanly.
 */
export function LandingLanguageToggle({ className }: { className?: string }) {
  return (
    <LanguageDropdown
      variant="full"
      fullNameFrom="2xl"
      plateTheme
      className={cn("h-8 text-xs", className)}
    />
  );
}
