import { useEffect, useRef, useState } from "react";

import type { TextChunkSource } from "@/lib/streaming";

/**
 * Streams `text` in via `source`, keyed on `streamKey` rather than on `text`
 * itself. This means a genuinely new message (new `streamKey`) plays the
 * full reveal animation, while `text` changing for an existing message
 * (e.g. a language toggle re-translating an already-shown message) just
 * swaps the displayed text instantly instead of replaying the animation.
 */
export function useStreamedText(text: string, source: TextChunkSource, streamKey: string) {
  const [streamedText, setStreamedText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
  });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setStreamedText("");
      setIsDone(false);

      let accumulated = "";
      for await (const chunk of source(textRef.current)) {
        if (cancelled) return;
        accumulated += chunk;
        setStreamedText(accumulated);
      }
      if (!cancelled) setIsDone(true);
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [streamKey, source]);

  // Once the reveal has finished once for this streamKey, always reflect the
  // latest `text` instantly rather than replaying the animation for it.
  return { displayedText: isDone ? text : streamedText, isDone };
}
