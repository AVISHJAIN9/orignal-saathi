import { History, MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { BackToHomeLink } from "@/components/back-to-home-link";
import { BrandMark } from "@/components/brand-mark";
import { ConversationHistoryList } from "@/components/conversation-history-list";
import { LogoutButton } from "@/components/logout-button";
import { NewChatButton } from "@/components/new-chat-button";
import { ProfileSettings } from "@/components/profile-settings";
import type { StoredConversation } from "@/hooks/use-conversation-history";
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
  conversations: StoredConversation[];
  activeConversationId: string;
  onSelectConversation: (conversation: StoredConversation) => void;
  onDeleteConversation: (id: string) => void;
  onNewChat: () => void;
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  // Both default false: AppHeader (see src/routes/__root.tsx) is now the
  // single source of top-level branding and back-navigation for every
  // route this drawer renders on, so this drawer's own copies are off by
  // default to avoid the duplication. Left as props (not deleted) so any
  // future route that mounts this drawer without AppHeader can flip one
  // back on without re-deriving this.
  showBrandHeader?: boolean;
  showBackLink?: boolean;
}

const navStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

/** Mobile-only drawer holding branding, navigation, and history — the desktop persistent AppSidebar covers this on wider screens. */
export function MobileSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
  profile,
  onProfileChange,
  showBrandHeader = false,
  showBackLink = false,
}: MobileSidebarProps) {
  const { t } = useTranslation(["chat", "history"]);
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 gap-1.5 md:hidden"
          />
        }
        aria-label={t("history:triggerAriaLabel")}
      >
        <History />
        <span>{t("history:title")}</span>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="chat-mobile-sidebar w-[min(86vw,22rem)] border-sidebar-border bg-sidebar p-0 text-sidebar-foreground sm:max-w-xs"
      >
        <div className="chat-sidebar plate-texture plate-texture-drift plate-texture-glow relative flex h-full min-h-0 flex-col overflow-hidden [--plate-texture-opacity:0.2]">
          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            {showBrandHeader ? (
              <SheetHeader className="shrink-0 border-b border-sidebar-border px-5 pb-5 pt-5 text-start">
                <SheetTitle className="flex items-center gap-3 text-primary">
                  <BrandMark className="rounded-xl shadow-sm" />
                  <span className="flex flex-col items-start gap-1">
                    <span className="text-lg tracking-tight">
                      {t("chat:logo")}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      BIS Navigator
                    </span>
                  </span>
                </SheetTitle>
              </SheetHeader>
            ) : (
              <SheetHeader className="shrink-0 border-b border-sidebar-border px-5 pb-3 pt-4 text-start">
                <SheetTitle className="text-sm font-semibold text-sidebar-foreground">
                  BIS Navigator
                </SheetTitle>
              </SheetHeader>
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
                  onSelect={(conversation) => {
                    onSelectConversation(conversation);
                    setOpen(false);
                  }}
                  onDelete={onDeleteConversation}
                />
              </div>
            </ScrollArea>

            <div className="flex shrink-0 flex-col gap-2 border-t border-sidebar-border bg-sidebar px-5 pb-3 pt-4">
              <ProfileSettings
                profile={profile}
                onSave={onProfileChange}
                compact
              />
              <NewChatButton
                onNewChat={() => {
                  onNewChat();
                  setOpen(false);
                }}
                className="w-full rounded-md px-3"
              />
              <Link
                to="/whatsapp"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-md bg-[#25D366]/15 border border-[#25D366]/30 px-3 py-2 text-xs font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/25 dark:text-[#25D366]"
              >
                <MessageCircle className="size-4 fill-current" />
                <span>WhatsApp Bot [T1-27]</span>
              </Link>
              <LogoutButton className="w-full rounded-md border border-sidebar-border bg-sidebar transition-colors hover:bg-sidebar-accent" />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
