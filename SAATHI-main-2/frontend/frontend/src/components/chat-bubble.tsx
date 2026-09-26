import { Info, Volume2, VolumeX, Loader2, Globe } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { BrandMark } from "@/components/brand-mark";
import { CitationBadge } from "@/components/citation-badge";
import { MessageFeedback } from "@/components/message-feedback";
import { useStreamedText } from "@/hooks/use-streamed-text";
import { fakeTypingStream, instantText } from "@/lib/streaming";
import { synthesizeSpeech, translateText } from "@/lib/api-client";
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

  // Sarvam Voice TTS & Translation State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [targetLang, setTargetLang] = useState("hi-IN");
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    onRevealCompleteRef.current = onRevealComplete;
  });

  useEffect(() => {
    if (isDone) onRevealCompleteRef.current?.();
  }, [isDone]);

  const isBot = message.sender === "bot";

  const handleToggleVoice = async () => {
    if (isPlayingAudio && audioElement) {
      audioElement.pause();
      setIsPlayingAudio(false);
      return;
    }

    try {
      setIsSynthesizing(true);
      const textToSpeak = translatedContent || message.text;
      const res = await synthesizeSpeech(textToSpeak, targetLang, "ritu");
      if (res.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${res.audioBase64}`);
        audio.onended = () => setIsPlayingAudio(false);
        audio.play();
        setAudioElement(audio);
        setIsPlayingAudio(true);
      }
    } catch (err) {
      console.warn("Sarvam TTS error:", err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleTranslate = async (chosenLang?: string) => {
    const lang = chosenLang || targetLang;
    if (translatedContent && !chosenLang) {
      setTranslatedContent(null);
      return;
    }
    try {
      setIsTranslating(true);
      const res = await translateText(message.text, lang, "en-IN");
      if (res.translatedText) {
        setTranslatedContent(res.translatedText);
      }
    } catch (err) {
      console.warn("Sarvam Translation error:", err);
    } finally {
      setIsTranslating(false);
    }
  };

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
            className="mb-1 rounded-lg shadow-[0_5px_12px_rgba(0,0,0,0.1)]"
          />
        )}
        <div
          className={cn(
            "relative flex min-w-0 flex-col items-start gap-2 rounded-[1.25rem] px-4 py-3 text-sm leading-relaxed shadow-sm transition-shadow duration-300 sm:text-base",
            message.sender === "user" &&
              "rounded-br-md border border-primary/20 bg-primary text-primary-foreground shadow-sm",
            isBot &&
              !isDeclined &&
              "rounded-bl-md border border-primary/15 bg-secondary/60 text-secondary-foreground shadow-sm backdrop-blur-sm",
            isDeclined &&
              "rounded-bl-md border border-amber-300/60 bg-amber-50/75 text-amber-900 backdrop-blur-md dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200",
            highlighted &&
              "ring-2 ring-primary/70 ring-offset-2 ring-offset-background",
          )}
        >
          {isBot && !isDeclined && (
            <span aria-hidden className="absolute inset-x-4 top-0 h-px bg-card/70" />
          )}
          {isDeclined && <Info className="mt-0.5 size-4 shrink-0" />}
          <span className="min-w-0 break-words [word-break:break-word]">
            {translatedContent ? (
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-2xs font-semibold text-primary">
                  <span>🇮🇳 Indic Translation (Mayura)</span>
                </div>
                <p>{translatedContent}</p>
              </div>
            ) : (
              displayedText
            )}
          </span>

          {/* Sarvam Indic Audio & Translation Controls */}
          {isBot && isDone && !isDeclined && (
            <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-border/40 pt-2 text-xs text-muted-foreground">
              <select
                value={targetLang}
                onChange={(e) => {
                  const newLang = e.target.value;
                  setTargetLang(newLang);
                  if (translatedContent) {
                    handleTranslate(newLang);
                  }
                }}
                className="h-7 rounded border border-input/60 bg-background/80 px-1.5 text-2xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                aria-label="Target Indic Language"
              >
                <option value="hi-IN">🇮🇳 हिन्दी (Hindi)</option>
                <option value="ta-IN">🇮🇳 தமிழ் (Tamil)</option>
                <option value="te-IN">🇮🇳 తెలుగు (Telugu)</option>
                <option value="mr-IN">🇮🇳 मराठी (Marathi)</option>
                <option value="bn-IN">🇮🇳 বাংলা (Bengali)</option>
                <option value="gu-IN">🇮🇳 ગુજરાતી (Gujarati)</option>
                <option value="kn-IN">🇮🇳 ಕನ್ನಡ (Kannada)</option>
                <option value="ml-IN">🇮🇳 മലയാളം (Malayalam)</option>
                <option value="pa-IN">🇮🇳 ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="od-IN">🇮🇳 ଓଡ଼ିଆ (Odia)</option>
              </select>

              <button
                type="button"
                onClick={() => handleTranslate()}
                disabled={isTranslating}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-background/80 transition-colors"
                title="Translate technical clause (Sarvam Mayura:v1)"
              >
                {isTranslating ? (
                  <Loader2 className="size-3.5 animate-spin text-primary" />
                ) : (
                  <Globe className="size-3.5 text-primary" />
                )}
                <span>{translatedContent ? "Show Original" : "Translate"}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleVoice}
                disabled={isSynthesizing}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-background/80 transition-colors"
                title="Read aloud in regional accent (Sarvam Bulbul:v3)"
              >
                {isSynthesizing ? (
                  <Loader2 className="size-3.5 animate-spin text-primary" />
                ) : isPlayingAudio ? (
                  <VolumeX className="size-3.5 text-primary" />
                ) : (
                  <Volume2 className="size-3.5 text-primary" />
                )}
                <span>{isPlayingAudio ? "Stop Audio" : "Listen (Bulbul)"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {isDone && hasCitations && (
        <div className="flex flex-wrap gap-1.5 pl-9">
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
          className="pl-9"
        >
          <MessageFeedback feedback={feedback} onChange={onFeedbackChange} />
        </motion.div>
      )}
    </motion.div>
  );
}
