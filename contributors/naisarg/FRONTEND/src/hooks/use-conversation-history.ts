import { useEffect, useState } from "react";

import type { ChatMessage } from "@/lib/types";

export interface StoredConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

const CONVERSATIONS_KEY = "saathi:conversations";
const ACTIVE_ID_KEY = "saathi:active-conversation-id";
const TITLE_MAX_LENGTH = 48;

/**
 * Simple first-message heuristic — trims, drops trailing punctuation, and
 * truncates. There's no backend/LLM call available client-side to summarize
 * a thread properly; swap this for a real summarization call once one
 * exists instead of trying to improve the heuristic itself.
 */
export function deriveConversationTitle(messages: ChatMessage[]): string {
  const firstUserMessage = messages.find(
    (message) => message.sender === "user",
  );
  const raw = (firstUserMessage?.text ?? "").trim().replace(/[.?!]+$/, "");
  if (!raw) return "New conversation";
  return raw.length > TITLE_MAX_LENGTH
    ? `${raw.slice(0, TITLE_MAX_LENGTH).trimEnd()}…`
    : raw;
}

function readStoredConversations(): StoredConversation[] {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(CONVERSATIONS_KEY) ?? "null",
    );
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

/**
 * Owns the list of saved conversations and which one is currently active,
 * persisted client-side (no backend yet — see USER_PROFILE_STORAGE_KEY in
 * lib/profile.ts for the existing localStorage convention this follows). App.tsx still owns the live reply-queue mechanics for
 * whichever conversation is active; this hook only tracks the saved list
 * and the active id, and persists both.
 */
export function useConversationHistory() {
  const [conversations, setConversations] = useState<StoredConversation[]>([]);
  const [activeId, setActiveIdState] = useState<string>(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}`,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConversations(readStoredConversations());
    const storedActiveId = window.localStorage.getItem(ACTIVE_ID_KEY);
    if (storedActiveId) setActiveIdState(storedActiveId);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(
      CONVERSATIONS_KEY,
      JSON.stringify(conversations),
    );
  }, [ready, conversations]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(ACTIVE_ID_KEY, activeId);
  }, [ready, activeId]);

  function setActiveId(id: string) {
    setActiveIdState(id);
  }

  /** Upserts a conversation's messages/title/timestamp. No-ops on an empty
   * thread so a conversation that was started but never actually sent
   * anything doesn't clutter the history list. */
  function saveConversation(id: string, messages: ChatMessage[]) {
    if (messages.length === 0) return;
    setConversations((prev) => {
      const title = deriveConversationTitle(messages);
      const updated: StoredConversation = {
        id,
        title,
        messages,
        updatedAt: Date.now(),
      };
      const existingIndex = prev.findIndex(
        (conversation) => conversation.id === id,
      );
      if (existingIndex === -1) return [updated, ...prev];
      const next = [...prev];
      next[existingIndex] = updated;
      return next;
    });
  }

  function deleteConversation(id: string) {
    setConversations((prev) =>
      prev.filter((conversation) => conversation.id !== id),
    );
  }

  return {
    ready,
    conversations,
    activeId,
    setActiveId,
    saveConversation,
    deleteConversation,
  };
}
