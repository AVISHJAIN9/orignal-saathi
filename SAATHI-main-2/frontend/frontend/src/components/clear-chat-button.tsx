import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ClearChatButtonProps {
  onClear: () => void;
  className?: string;
  compact?: boolean;
}

export function ClearChatButton({ onClear, className, compact = false }: ClearChatButtonProps) {
  const { t } = useTranslation("chat");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size={compact ? "sm" : "default"}
          className={cn(
            "group/clear justify-start text-muted-foreground hover:bg-red-950/[0.06] hover:text-red-900",
            compact ? "h-8 gap-1.5 px-2 text-[0.68rem]" : "w-full",
            className,
          )}
          aria-label={t("clearChat.trigger")}
        >
          <Trash2
            className="size-3.5 transition-transform duration-200 group-hover/clear:-rotate-6"
            aria-hidden
          />
          <span>{t("clearChat.trigger")}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl border-white/70 shadow-[0_24px_60px_rgba(12,50,86,0.18)] backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-2xl tracking-tight text-primary">
            {t("clearChat.title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {t("clearChat.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("clearChat.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onClear}
            className="bg-red-900 text-white hover:bg-red-950 focus-visible:ring-red-900/30"
          >
            {t("clearChat.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
