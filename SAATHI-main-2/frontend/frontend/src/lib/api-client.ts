/**
 * SAATHI Central Typed API Client
 * Connects frontend directly to Root Gateway (Port 3000), Backend Extra (Port 3005),
 * and Sarvam Indic Voice / Translation / Chat AI.
 */

const API_BASE = (import.meta.env?.VITE_API_URL as string) || "http://localhost:3000/api/v1";

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type UnauthorizedListener = () => void;
const unauthorizedListeners = new Set<UnauthorizedListener>();

export function onUnauthorized(listener: UnauthorizedListener): () => void {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
}

function notifyUnauthorized() {
  for (const listener of unauthorizedListeners) listener();
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (response.status === 401) {
    notifyUnauthorized();
    throw new ApiError(401, "Unauthorized");
  }

  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }
    const message = (typeof errorData === "object" && (errorData.message || errorData.error)) || `Request to ${path} failed (${response.status})`;
    throw new ApiError(response.status, message, errorData);
  }

  return (await response.json()) as T;
}

// ── SARVAM INDIC AI SERVICES ──────────────────────────────────────────────────

/**
 * Transcribe spoken Indian language audio to text using Sarvam saaras:v3
 */
export async function transcribeAudio(audioBlob: Blob, languageCode = "hi-IN"): Promise<{ transcript: string; language_code: string }> {
  const formData = new FormData();
  formData.append("file", audioBlob, "speech.wav");
  formData.append("language_code", languageCode);

  const response = await fetch(`${API_BASE}/indic/speech-to-text`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new ApiError(response.status, "Failed to transcribe audio via Sarvam AI");
  }

  return await response.json();
}

/**
 * Synthesize speech audio from text using Sarvam bulbul:v3
 */
export async function synthesizeSpeech(text: string, targetLanguageCode = "hi-IN", speaker = "ritu"): Promise<{ audioBase64: string; speaker: string }> {
  return request<{ audioBase64: string; speaker: string }>("/indic/text-to-speech", {
    method: "POST",
    body: JSON.stringify({
      text,
      target_language_code: targetLanguageCode,
      speaker,
    }),
  });
}

/**
 * Translate compliance standard clauses into 10+ Indic languages using Sarvam mayura:v1
 */
export async function translateText(text: string, targetLanguageCode = "hi-IN", sourceLanguageCode = "en-IN"): Promise<{ translatedText: string }> {
  return request<{ translatedText: string }>("/indic/translate", {
    method: "POST",
    body: JSON.stringify({
      text,
      target_language_code: targetLanguageCode,
      source_language_code: sourceLanguageCode,
    }),
  });
}

/**
 * Indic Conversational AI Assistant using Sarvam 105B
 */
export async function askSarvamAssistant(query: string): Promise<{ reply: string }> {
  return request<{ reply: string }>("/indic/chat", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}

/**
 * Ask SAATHI Grounded RAG AI Assistant (Aditi Latest 116k Index)
 */
export async function askSaathiRag(
  query: string,
  language = "en"
): Promise<{
  reply: string;
  answer: string;
  citations: Array<{ standardNumber: string; title: string; clause?: string; url?: string }>;
  model?: string;
  evidence_count?: number;
}> {
  try {
    const directRes = await fetch("http://localhost:5001/api/v1/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, language }),
    });
    if (directRes.ok) {
      return await directRes.json();
    }
  } catch (err) {
    console.warn("Direct RAG port 5001 fallback:", err);
  }

  return request<{
    reply: string;
    answer: string;
    citations: Array<{ standardNumber: string; title: string; clause?: string; url?: string }>;
    model?: string;
  }>("/chat", {
    method: "POST",
    body: JSON.stringify({ query, language }),
  });
}

