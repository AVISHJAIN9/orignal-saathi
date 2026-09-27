import i18n from "@/i18n";
import { MOCK_STANDARDS } from "@/lib/mock-standards";
import type { ChatMessage } from "@/lib/types";

// Placeholder answers only. Replace `getMockBotReply` with a real API/SSE
// call to the backend (see handleSend in App.tsx) once it's available —
// nothing else in the chat UI needs to change, since ChatBubble already
// streams whatever text/citations a bot message carries. The canned replies
// themselves live in the `conversation` translation namespace
// (src/i18n/locales/{en,hi}/conversation.json) so they follow the selected
// language like the rest of the demo content.
export function getMockBotReply(index: number, language: string): ChatMessage {
  const rawReplies = i18n.t("conversation:mockReplies", {
    lng: language,
    returnObjects: true,
  });
  const replies = (Array.isArray(rawReplies) ? rawReplies : []) as Array<Pick<ChatMessage, "text" | "citations">>;

  const reply = replies.length > 0 ? replies[index % replies.length] : { text: "" };
  return { sender: "bot", ...reply };
}

type ReplyContent = Pick<ChatMessage, "text" | "citations" | "status">;

function collectReplies(language: string): ReplyContent[] {
  const rawSeed = i18n.t("conversation:seedMessages", {
    lng: language,
    returnObjects: true,
  });
  const seedMessages = (Array.isArray(rawSeed) ? rawSeed : []) as ChatMessage[];
  const rawMock = i18n.t("conversation:mockReplies", {
    lng: language,
    returnObjects: true,
  });
  const mockReplies = (Array.isArray(rawMock) ? rawMock : []) as ReplyContent[];
  return [...seedMessages, ...mockReplies];
}

// D9 — the classification wizard always resolves to whichever seed standard
// matches the category the visitor picked (or an honest decline when none
// does), rather than the round-robin replies used for free-typed questions.
export function getMockReplyForCategory(categoryKey: string, language: string): ReplyContent {
  const replies = collectReplies(language);
  const standard = MOCK_STANDARDS.find((s) => s.categoryKey === categoryKey);
  const match =
    standard &&
    replies.find((reply) => reply.citations?.[0]?.standardNumber === standard.standardNumber);
  if (match) return { text: match.text, citations: match.citations };

  const declined = replies.find((reply) => reply.status === "declined");
  return declined ? { text: declined.text, status: "declined" } : { text: "" };
}
