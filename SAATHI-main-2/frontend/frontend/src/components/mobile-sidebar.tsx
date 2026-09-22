import { Menu } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { BackToHomeLink } from "@/components/back-to-home-link";
import { BrandMark } from "@/components/brand-mark";
import { ClearChatButton } from "@/components/clear-chat-button";
import { ConversationHistoryList } from "@/components/conversation-history-list";
import { LogoutButton } from "@/components/logout-button";
import { NavExtras } from "@/components/nav-extras";
import { ProfileSettings } from "@/components/profile-settings";
import { isRtlLanguage } from "@/i18n/languages";
import type { UserProfile } from "@/lib/profile";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { ChatMessage } from "@/lib/types";

/**
 * Sidebar spacing convention — keep every section aligned to this rather
 * than hand-tuning padding/gaps per section (mirrors AppSidebar, the
 * desktop counterpart of this drawer):
 *   - Section horizontal padding: px-5 (20px) on every section's own
 *     container (brand header, nav, history header, history list, footer),
 *     so every left edge lines up regardless of how narrow the content
 *     inside it is.
 *   - Section top padding: pt-5 (20px) on every section's own top edge.
 *   - Item gap within a section (nav links, history rows, footer actions):
 *     gap-2 (8px), always via a flex `gap-*` on the shared parent — never
 *     hand-tuned margins on individual children.
 * Bottom padding is deliberately NOT part of this convention — different
 * sections close differently depending on what follows them.
 */
interface MobileSidebarProps {
  messages: ChatMessage[];
  onSelect: (index: number) => void;
  onClear: () => void;
  profile: UserProfile;
  soundEnabled: boolean;
  onProfileChange: (profile: UserProfile) => void;
  onSoundEnabledChange: (enabled: boolean) => void;
}

/** Mobile-only drawer holding branding, navigation, and history — the desktop persistent AppSidebar covers this on wider screens. */
export function MobileSidebar({
  messages,
  onSelect,
  onClear,
  profile,
  soundEnabled,
  onProfileChange,
  onSoundEnabledChange,
}: MobileSidebarProps) {
  const { t, i18n } = useTranslation(["chat", "history"]);
  const [open, setOpen] = useState(false);
  const questionCount = messages.filter(
    (message) => message.sender === "user",
  ).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="shrink-0 md:hidden" />
        }
        aria-label={t("history:triggerAriaLabel")}
      >
        <Menu />
      </SheetTrigger>
      <SheetContent
        // A left-hand nav drawer reads as "opens from the start edge" — for
        // an RTL language that's the right side of the screen, not the left.
        side={isRtlLanguage(i18n.language) ? "right" : "left"}
        className="chat-mobile-sidebar w-[min(86vw,22rem)] border-border bg-card p-0 text-foreground shadow-[0_24px_60px_rgba(12,50,86,0.18)] backdrop-blur-2xl sm:max-w-xs"
      >
        <div className="chat-sidebar relative flex h-full min-h-0 flex-col overflow-hidden">
          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            <SheetHeader className="shrink-0 border-b border-border px-5 pb-5 pt-5 text-left">
              <SheetTitle className="flex items-center gap-3 text-primary">
                <BrandMark className="rounded-xl shadow-[inset_0_1px_0_var(--border),0_10px_18px_rgba(12,50,86,0.14)]" />
                <span className="flex flex-col items-start gap-1">
                  <span className="text-lg tracking-tight">
                    {t("chat:logo")}
                  </span>
                  <span className="font-mono text-[0.54rem] tracking-[0.18em] text-muted-foreground uppercase">
                    BIS navigator
                  </span>
                </span>
              </SheetTitle>
            </SheetHeader>

            <nav className="custom-scrollbar max-h-[45vh] shrink-0 overflow-y-auto border-b border-border px-5 pb-4 pt-5">
              <div className="flex flex-col gap-2">
                <BackToHomeLink />
                <NavExtras />
              </div>
            </nav>

            <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-5">
              <h2 className="font-mono text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                {t("history:title")}
              </h2>
              <span className="rounded-full border border-[var(--card)]/75 bg-[var(--card)]/45 px-2 py-1 font-mono text-[0.54rem] font-semibold tracking-[0.12em] text-primary">
                {String(questionCount).padStart(2, "0")}
              </span>
            </div>
            <ScrollArea className="min-h-0 flex-1">
              <div className="px-5 pb-3 pt-2">
                <ConversationHistoryList
                  messages={messages}
                  onSelect={(index) => {
                    onSelect(index);
                    setOpen(false);
                  }}
                />
              </div>
            </ScrollArea>

            <div className="flex shrink-0 flex-col gap-2 border-t border-[var(--card)]/65 bg-[var(--card)]/20 px-5 pb-3 pt-5">
              <ProfileSettings
                profile={profile}
                soundEnabled={soundEnabled}
                onSave={onProfileChange}
                onSoundEnabledChange={onSoundEnabledChange}
                compact
              />
              <ClearChatButton
                onClear={onClear}
                className="w-full rounded-xl px-3"
              />
              <LogoutButton className="w-full rounded-xl border border-[var(--card)]/70 bg-[var(--card)]/35 transition-colors hover:bg-[var(--card)]/60" />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
