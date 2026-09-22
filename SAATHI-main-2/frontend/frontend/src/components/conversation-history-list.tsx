import { useTranslation } from "react-i18next";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ChatMessage } from "@/lib/types";

interface ConversationHistoryListProps {
  messages: ChatMessage[];
  onSelect: (index: number) => void;
}

/** The list of past questions, shared between the mobile history Sheet and the persistent desktop sidebar. */
export function ConversationHistoryList({ messages, onSelect }: ConversationHistoryListProps) {
  const { t } = useTranslation("history");

  const questions = messages
    .map((message, index) => ({ message, index }))
    .filter(({ message }) => message.sender === "user");

  return (
    <div className="flex flex-col gap-2">
      {questions.length === 0 && <p className="px-2 text-sm text-muted-foreground">{t("empty")}</p>}
      {questions.map(({ message, index }) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => onSelect(index)}
              className="elevation-lift elevation-transition block w-full rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
            >
              <span className="line-clamp-2">{message.text}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">{t("jumpTooltip")}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
