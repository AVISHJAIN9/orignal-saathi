import { MessagesSquare, Trash2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { StoredConversation } from "@/hooks/use-conversation-history";
import { cn } from "@/lib/utils";

const listStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

interface ConversationHistoryListProps {
  conversations: StoredConversation[];
  activeConversationId: string;
  onSelect: (conversation: StoredConversation) => void;
  onDelete: (id: string) => void;
}

/** The list of past conversations (each a full saved thread, not an
 * individual question) — shared between the mobile history Sheet and the
 * persistent desktop sidebar. Clicking a row loads that whole conversation
 * back into the chat view; the trash icon removes it from history without
 * opening it. */
export function ConversationHistoryList({
  conversations,
  activeConversationId,
  onSelect,
  onDelete,
}: ConversationHistoryListProps) {
  const { t } = useTranslation("history");
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={prefersReducedMotion ? undefined : listStagger}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion ? undefined : "show"}
      className="flex flex-1 flex-col gap-2"
    >
      {conversations.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-8 text-center">
          <MessagesSquare className="size-5 text-muted-foreground/70" aria-hidden />
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        </div>
      )}
      {conversations.map((conversation) => (
        <motion.div key={conversation.id} variants={rowVariants}>
          <div
            className={cn(
              "group flex items-center gap-1 rounded-md border border-transparent transition-colors duration-200 hover:bg-sidebar-accent",
              conversation.id === activeConversationId &&
                "border-sidebar-border bg-sidebar-accent",
            )}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onSelect(conversation)}
                  className="block min-w-0 flex-1 px-3 py-2 text-start text-sm text-sidebar-foreground"
                >
                  <span className="line-clamp-2">{conversation.title}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{t("openTooltip")}</TooltipContent>
            </Tooltip>
            <button
              type="button"
              onClick={() => onDelete(conversation.id)}
              aria-label={t("deleteConversation")}
              title={t("deleteConversation")}
              className="me-1 shrink-0 rounded-sm p-1.5 text-muted-foreground opacity-0 transition-[opacity,background-color,color] duration-150 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
