export interface Citation {
  standardNumber: string;
  title: string;
  section?: string;
  sourceUrl?: string;
}

export interface ChatMessage {
  sender: "bot" | "user";
  text: string;
  citations?: Citation[];
  status?: "declined";
}

// D7 — feedback attached to a bot message, keyed by the same message id
// (`message-${index}`) already used for scroll/highlight, so it can later
// be joined with analytics data. `comment` is `undefined` until the
// optional down-vote comment step is submitted (possibly with an empty
// string, meaning the visitor skipped adding detail).
export interface MessageFeedback {
  vote: "up" | "down";
  comment?: string;
}
