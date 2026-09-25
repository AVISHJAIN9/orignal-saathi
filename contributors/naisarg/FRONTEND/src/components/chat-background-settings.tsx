import { Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type ChatBackgroundMode = "animated" | "paused" | "off";

interface ChatBackgroundSettingsProps {
  mode: ChatBackgroundMode;
  onModeChange: (mode: ChatBackgroundMode) => void;
}

const MODES: ChatBackgroundMode[] = ["animated", "paused", "off"];

function isChatBackgroundMode(value: string): value is ChatBackgroundMode {
  return MODES.includes(value as ChatBackgroundMode);
}

export function ChatBackgroundSettings({ mode, onModeChange }: ChatBackgroundSettingsProps) {
  const { t } = useTranslation("chat");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="border-border/50 bg-card/70 text-muted-foreground shadow-sm hover:bg-card/70"
          aria-label={t("backgroundSettings.open")}
          title={t("backgroundSettings.open")}
        >
          <Settings2 aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-2xl border-border/50 p-2 shadow-[0_18px_42px_rgba(0,0,0,0.1)] backdrop-blur-xl"
      >
        <DropdownMenuLabel className="px-2 pb-1 pt-1 text-xs font-semibold text-muted-foreground">
          {t("backgroundSettings.title")}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={mode}
          onValueChange={(value) => {
            if (isChatBackgroundMode(value)) onModeChange(value);
          }}
        >
          <DropdownMenuRadioItem value="animated" className="rounded-xl py-2.5 pl-8 pr-2">
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-medium">{t("backgroundSettings.animated")}</span>
              <span className="text-2xs leading-snug text-muted-foreground">
                {t("backgroundSettings.animatedDescription")}
              </span>
            </span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="paused" className="rounded-xl py-2.5 pl-8 pr-2">
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-medium">{t("backgroundSettings.paused")}</span>
              <span className="text-2xs leading-snug text-muted-foreground">
                {t("backgroundSettings.pausedDescription")}
              </span>
            </span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="off" className="rounded-xl py-2.5 pl-8 pr-2">
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-medium">{t("backgroundSettings.off")}</span>
              <span className="text-2xs leading-snug text-muted-foreground">
                {t("backgroundSettings.offDescription")}
              </span>
            </span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator className="bg-border/60" />
        <p className="px-2 pb-1 pt-1 font-mono text-2xs leading-relaxed tracking-wide text-muted-foreground">
          {t("backgroundSettings.hint")}
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
