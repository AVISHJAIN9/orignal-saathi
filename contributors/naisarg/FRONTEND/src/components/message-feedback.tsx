import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MessageFeedback as MessageFeedbackValue } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MessageFeedbackProps {
  feedback?: MessageFeedbackValue;
  onChange: (feedback: MessageFeedbackValue | undefined) => void;
}

/** D7 — thumbs up/down under a cited bot answer, with an optional comment prompt on thumbs-down. */
export function MessageFeedback({ feedback, onChange }: MessageFeedbackProps) {
  const { t } = useTranslation("chat");
  const [commentDraft, setCommentDraft] = useState("");

  const showCommentBox = feedback?.vote === "down" && feedback.comment === undefined;

  function handleVote(vote: "up" | "down") {
    if (feedback?.vote === vote) {
      onChange(undefined);
      setCommentDraft("");
      return;
    }
    onChange({ vote });
  }

  function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onChange({ vote: "down", comment: commentDraft.trim() });
    setCommentDraft("");
  }

  return (
    <div className="flex flex-col gap-1.5 px-1">
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => handleVote("up")}
          aria-pressed={feedback?.vote === "up"}
          aria-label={t("feedback.helpfulAriaLabel")}
          className={cn(
            "elevation-1 elevation-lift rounded-full p-1.5 transition-[color,background-color,box-shadow,transform] duration-[240ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)]",
            feedback?.vote === "up"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <ThumbsUp className="size-3.5" fill={feedback?.vote === "up" ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={() => handleVote("down")}
          aria-pressed={feedback?.vote === "down"}
          aria-label={t("feedback.notHelpfulAriaLabel")}
          className={cn(
            "elevation-1 elevation-lift rounded-full p-1.5 transition-[color,background-color,box-shadow,transform] duration-[240ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)]",
            feedback?.vote === "down"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <ThumbsDown
            className="size-3.5"
            fill={feedback?.vote === "down" ? "currentColor" : "none"}
          />
        </button>
      </div>

      {showCommentBox && (
        <form
          onSubmit={handleCommentSubmit}
          className="flex flex-col gap-1.5 sm:flex-row sm:items-center"
        >
          <Input
            value={commentDraft}
            onChange={(e) => setCommentDraft(e.target.value)}
            placeholder={t("feedback.commentPrompt")}
            aria-label={t("feedback.commentPrompt")}
            className="h-7 text-xs"
          />
          <Button type="submit" size="xs" variant="outline" className="shrink-0">
            {t("feedback.submit")}
          </Button>
        </form>
      )}

      {feedback?.vote === "down" && feedback.comment !== undefined && (
        <span className="text-xs text-muted-foreground">{t("feedback.thanks")}</span>
      )}
    </div>
  );
}
