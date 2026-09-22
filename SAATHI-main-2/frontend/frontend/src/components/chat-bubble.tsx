import { Info } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { BrandMark } from "@/components/brand-mark";
import { CitationBadge } from "@/components/citation-badge";
import { MessageFeedback } from "@/components/message-feedback";
import { useStreamedText } from "@/hooks/use-streamed-text";
import { fakeTypingStream, instantText } from "@/lib/streaming";
import type { ChatMessage, MessageFeedback as MessageFeedbackValue } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: ChatMessage;
  id?: string;
  highlighted?: boolean;
  onRevealComplete?: () => void;
  feedback?: MessageFeedbackValue;
  onFeedbackChange?: (feedback: MessageFeedbackValue | undefined) => void;
}

export function ChatBubble({
  message,
  id,
  highlighted,
  onRevealComplete,
  feedback,
  onFeedbackChange,
}: ChatBubbleProps) {
  const isDeclined = message.sender === "bot" && message.status === "declined";
  const shouldAnimate = message.sender === "bot" && !isDeclined;
  const hasCitations =
    message.sender === "bot" && !isDeclined && (message.citations?.length ?? 0) > 0;
  const { displayedText, isDone } = useStreamedText(
    message.text,
    shouldAnimate ? fakeTypingStream : instantText,
    id ?? message.text,
  );
  const onRevealCompleteRef = useRef(onRevealComplete);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    onRevealCompleteRef.current = onRevealComplete;
  });

  useEffect(() => {
    if (isDone) onRevealCompleteRef.current?.();
  }, [isDone]);

  const isBot = message.sender === "bot";

  return (
    <motion.div
      id={id}
      initial={
        prefersReducedMotion
          ? false
          : { opacity: 0, y: 12, x: message.sender === "user" ? 12 : -12 }
      }
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className={cn(
        "flex min-w-0 max-w-[90%] flex-col gap-2 sm:max-w-[78%]",
        message.sender === "user" ? "self-end items-end" : "self-start items-start",
      )}
    >
      <div
        className={cn(
          "flex min-w-0 items-end gap-2.5",
          message.sender === "user" && "flex-row-reverse",
        )}
      >
        {isBot && (
          <BrandMark
            size="sm"
            className="mb-1 rounded-lg shadow-[0_5px_12px_rgba(12,50,86,0.12)]"
          />
        )}
        <div
          className={cn(
            "relative flex min-w-0 items-start gap-2 rounded-[1.25rem] px-4 py-3 text-sm leading-relaxed shadow-[inset_0_1px_0_rgba(255,255,255,0.48),0_9px_20px_rgba(38,49,56,0.07)] transition-shadow duration-300 sm:text-base",
            message.sender === "user" &&
              "rounded-br-md border border-primary/70 bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_20px_rgba(12,50,86,0.15)]",
            isBot &&
              !isDeclined &&
              "rounded-bl-md border border-white/75 bg-white/52 text-foreground backdrop-blur-xl",
            isDeclined &&
              "rounded-bl-md border border-amber-300/60 bg-amber-50/75 text-amber-900 backdrop-blur-md dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200",
            highlighted &&
              "ring-2 ring-primary/70 ring-offset-2 ring-offset-background",
          )}
        >
          {isBot && !isDeclined && (
            <span aria-hidden className="absolute inset-x-4 top-0 h-px bg-white/70" />
          )}
          {isDeclined && <Info className="mt-0.5 size-4 shrink-0" />}
          <span className="min-w-0 break-words [word-break:break-word]">{displayedText}</span>
        </div>
      </div>
      {isDone && hasCitations && (
        <div className="flex flex-wrap gap-1.5 ps-9">
          {message.citations?.map((citation, i) => (
            <CitationBadge key={`${citation.standardNumber}-${i}`} citation={citation} index={i} />
          ))}
        </div>
      )}
      {isDone && hasCitations && onFeedbackChange && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.25,
            delay: (message.citations?.length ?? 0) * 0.12 + 0.1,
          }}
          className="ps-9"
        >
          <MessageFeedback feedback={feedback} onChange={onFeedbackChange} />
        </motion.div>
      )}
    </motion.div>
  );
}
