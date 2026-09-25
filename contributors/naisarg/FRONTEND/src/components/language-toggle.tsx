/**
 * Main app header language toggle — re-exports the shared LanguageDropdown
 * in compact variant so the header doesn't overflow on small screens.
 * Replaces the old 2-button EN/HI toggle.
 */
import { LanguageDropdown } from "@/components/language-dropdown";

export function LanguageToggle() {
  return <LanguageDropdown variant="compact" />;
}
