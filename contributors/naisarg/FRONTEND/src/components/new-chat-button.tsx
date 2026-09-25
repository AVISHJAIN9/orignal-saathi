import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NewChatButtonProps {
  onNewChat: () => void;
  className?: string;
  compact?: boolean;
}

/** Starts a fresh conversation. No confirmation dialog — unlike the old
 * "Clear chat" this replaces, nothing is destroyed: the outgoing
 * conversation is auto-saved to history (see App.tsx's save effect)
 * before the view resets to empty. */
export function NewChatButton({ onNewChat, className, compact = false }: NewChatButtonProps) {
  const { t } = useTranslation("chat");

  return (
    <Button
      type="button"
      size={compact ? "sm" : "default"}
      onClick={onNewChat}
      className={cn(
        "elevation-1 elevation-lift justify-center font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-full",
        compact ? "h-8 gap-1.5 px-2 text-2xs" : "w-full",
        className,
      )}
      aria-label={t("newChat.trigger")}
    >
      <Plus className="size-3.5" aria-hidden />
      <span>{t("newChat.trigger")}</span>
    </Button>
  );
}
