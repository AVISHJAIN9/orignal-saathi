import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { BackToHomeLink } from "@/components/back-to-home-link";
import { BrandMark } from "@/components/brand-mark";
import { ClearChatButton } from "@/components/clear-chat-button";
import { ConversationHistoryList } from "@/components/conversation-history-list";
import { LogoutButton } from "@/components/logout-button";
import { NavExtras } from "@/components/nav-extras";
import { ProfileSettings } from "@/components/profile-settings";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UserProfile } from "@/lib/profile";
import type { ChatMessage } from "@/lib/types";

/**
 * Sidebar spacing convention — keep every section aligned to this rather
 * than hand-tuning padding/gaps per section:
 *   - Section horizontal padding: px-5 (20px) on every section's own
 *     container (brand header, nav, history header, history list, footer),
 *     so every left edge lines up regardless of how narrow the content
 *     inside it is.
 *   - Section top padding: pt-5 (20px) on every section's own top edge.
 *   - Item gap within a section (nav links, history rows, footer actions):
 *     gap-2 (8px), always via a flex `gap-*` on the shared parent — never
 *     hand-tuned margins on individual children, which is how this drifted
 *     to two different values (mb-2 then mb-1) in the footer before.
 * Bottom padding is deliberately NOT part of this convention — different
 * sections close differently depending on what follows them (a footer at
 * the very bottom of the sidebar vs. a section handing off to another
 * section's own top padding), so don't assume bottom values should match
 * just because top/horizontal do.
 */
interface AppSidebarProps {
  messages: ChatMessage[];
  onSelect: (index: number) => void;
  onClear: () => void;
  profile: UserProfile;
  soundEnabled: boolean;
  onProfileChange: (profile: UserProfile) => void;
  onSoundEnabledChange: (enabled: boolean) => void;
}

export function AppSidebar({
  messages,
  onSelect,
  onClear,
  profile,
  soundEnabled,
  onProfileChange,
  onSoundEnabledChange,
}: AppSidebarProps) {
  const { t } = useTranslation(["chat", "history"]);
  const questionCount = messages.filter((message) => message.sender === "user").length;

  return (
    <aside className="chat-sidebar relative hidden w-72 shrink-0 flex-col overflow-hidden border-e border-white/70 bg-card shadow-[inset_-1px_0_0_rgba(255,255,255,0.8),8px_0_30px_rgba(12,50,86,0.07)] backdrop-blur-2xl md:flex">
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="shrink-0 border-b border-white/65 px-5 pb-5 pt-5"
        >
          <div className="flex items-center gap-3">
            <BrandMark className="rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_18px_rgba(12,50,86,0.14)]" />
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold tracking-tight text-primary">
                {t("chat:logo")}
              </span>
              <span className="font-mono text-[0.58rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                BIS navigator
              </span>
            </div>
          </div>
        </motion.div>

        <nav className="custom-scrollbar max-h-[45vh] shrink-0 overflow-y-auto border-b border-white/65 px-5 pb-4 pt-5">
          <div className="flex flex-col gap-2">
            <BackToHomeLink />
            <NavExtras />
          </div>
        </nav>

        <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-5">
          <h2 className="font-mono text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {t("history:title")}
          </h2>
          <span className="rounded-full border border-white/75 bg-white/45 px-2 py-1 font-mono text-[0.54rem] font-semibold tracking-[0.12em] text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            {String(questionCount).padStart(2, "0")}
          </span>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div className="px-5 pb-3 pt-2">
            <ConversationHistoryList messages={messages} onSelect={onSelect} />
          </div>
        </ScrollArea>

        <div className="flex shrink-0 flex-col gap-2 border-t border-white/65 bg-white/20 px-5 pb-3 pt-5">
          <ProfileSettings
            profile={profile}
            soundEnabled={soundEnabled}
            onSave={onProfileChange}
            onSoundEnabledChange={onSoundEnabledChange}
            compact
          />
          <ClearChatButton onClear={onClear} className="w-full rounded-xl px-3" />
          <LogoutButton className="w-full rounded-xl border border-white/70 bg-white/35 transition-colors hover:bg-white/60" />
        </div>
      </div>
    </aside>
  );
}
