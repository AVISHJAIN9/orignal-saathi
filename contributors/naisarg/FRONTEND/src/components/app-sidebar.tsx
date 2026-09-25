import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { BackToHomeLink } from "@/components/back-to-home-link";
import { BrandMark } from "@/components/brand-mark";
import { ConversationHistoryList } from "@/components/conversation-history-list";
import { LogoutButton } from "@/components/logout-button";
import { NewChatButton } from "@/components/new-chat-button";
import { ProfileSettings } from "@/components/profile-settings";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { StoredConversation } from "@/hooks/use-conversation-history";
import type { UserProfile } from "@/lib/profile";

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
  conversations: StoredConversation[];
  activeConversationId: string;
  onSelectConversation: (conversation: StoredConversation) => void;
  onDeleteConversation: (id: string) => void;
  onNewChat: () => void;
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  // Both default false: AppHeader (see src/routes/__root.tsx) is now the
  // single source of top-level branding and back-navigation for every
  // route this sidebar renders on, so this sidebar's own copies are off by
  // default to avoid the duplication. Left as props (not deleted) so any
  // future route that mounts this sidebar without AppHeader can flip
  // one back on without re-deriving this.
  showBrandHeader?: boolean;
  showBackLink?: boolean;
}

const navStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

export function AppSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
  profile,
  onProfileChange,
  showBrandHeader = false,
  showBackLink = false,
}: AppSidebarProps) {
  const { t } = useTranslation(["chat", "history"]);
  const prefersReducedMotion = useReducedMotion();

  return (
    <aside className="chat-sidebar plate-texture plate-texture-drift plate-texture-glow relative hidden w-72 shrink-0 flex-col overflow-hidden border-e [--plate-texture-opacity:0.26] border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {showBrandHeader ? (
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="shrink-0 border-b border-sidebar-border px-5 pb-5 pt-5"
          >
            <div className="flex items-center gap-3">
              <BrandMark className="rounded-xl shadow-sm" />
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold tracking-tight text-primary">
                  {t("chat:logo")}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  BIS Navigator
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="shrink-0 border-b border-sidebar-border px-5 pb-3 pt-4"
          >
            <span className="text-sm font-semibold text-sidebar-foreground">
              BIS Navigator
            </span>
          </motion.div>
        )}

        {showBackLink && (
          <nav className="custom-scrollbar max-h-[45vh] shrink-0 overflow-y-auto border-b border-sidebar-border px-5 pb-4 pt-5">
            <motion.div
              variants={prefersReducedMotion ? undefined : navStagger}
              initial={prefersReducedMotion ? false : "hidden"}
              animate={prefersReducedMotion ? undefined : "show"}
              className="flex flex-col gap-2"
            >
              <BackToHomeLink />
            </motion.div>
          </nav>
        )}

        <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-5">
          <h2 className="text-sm font-semibold text-sidebar-foreground">
            {t("history:title")}
          </h2>
          {conversations.length > 0 && (
            <span className="rounded-md border border-sidebar-border bg-sidebar-accent px-1.5 py-0.5 text-xs font-medium tabular-nums text-sidebar-foreground">
              {conversations.length}
            </span>
          )}
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex min-h-full flex-col px-5 pb-3 pt-2">
            <ConversationHistoryList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelect={onSelectConversation}
              onDelete={onDeleteConversation}
            />
          </div>
        </ScrollArea>

        <div className="relative flex shrink-0 flex-col gap-2 border-t border-sidebar-border bg-sidebar px-5 pb-3 pt-4">
          <ProfileSettings profile={profile} onSave={onProfileChange} compact />
          <NewChatButton
            onNewChat={onNewChat}
            className="w-full rounded-md px-3"
          />
          <LogoutButton className="w-full rounded-md border border-sidebar-border bg-sidebar transition-colors hover:bg-sidebar-accent" />
        </div>
      </div>
    </aside>
  );
}
