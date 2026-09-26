import { useTranslation } from "react-i18next";
import { MessageSquarePlus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NexusHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAskDialog: () => void;
}

export function NexusHeader({
  searchQuery,
  onSearchChange,
  onOpenAskDialog,
}: NexusHeaderProps) {
  const { t } = useTranslation("nexus");

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-5 shadow-xs backdrop-blur-md sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <span className="w-fit rounded-full bg-primary/10 px-3 py-0.5 font-mono text-xs font-semibold tracking-wide text-primary uppercase">
            {t("eyebrow")}
          </span>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {t("heading")}
          </h1>
          <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {t("subheading")}
          </p>
        </div>

        <Button onClick={onOpenAskDialog} className="shrink-0 gap-2 shadow-sm">
          <MessageSquarePlus className="size-4" />
          {t("askQuestion")}
        </Button>
      </div>

      <div className="flex flex-col items-center gap-3 border-t border-border/60 pt-2 sm:flex-row">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-10 bg-background/80 pl-10 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
