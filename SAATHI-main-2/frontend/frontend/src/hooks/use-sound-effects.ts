import { useCallback, useRef } from "react";

type AudioWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };

type SoundKind = "send" | "clear";

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextConstructor = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
  if (!AudioContextConstructor) return null;
  return new AudioContextConstructor();
}

export function useSoundEffects(enabled: boolean) {
  const contextRef = useRef<AudioContext | null>(null);

  const playTone = useCallback(
    (kind: SoundKind) => {
      if (!enabled) return;

      const context = contextRef.current ?? (contextRef.current = getAudioContext());
      if (!context) return;

      if (context.state === "suspended") void context.resume();

      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const isClear = kind === "clear";
      const startFrequency = isClear ? 520 : 380;
      const endFrequency = isClear ? 250 : 620;
      const duration = isClear ? 0.16 : 0.1;

      oscillator.type = isClear ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(startFrequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(isClear ? 0.045 : 0.035, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.015);
    },
    [enabled],
  );

  const playSendSound = useCallback(() => playTone("send"), [playTone]);
  const playClearSound = useCallback(() => playTone("clear"), [playTone]);

  return { playSendSound, playClearSound };
}
