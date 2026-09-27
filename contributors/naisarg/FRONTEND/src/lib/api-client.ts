// No real backend exists in this repo yet (see mock-auth.ts's header), so
// nothing actually calls a `request()` like this one today — but 401
// handling needs exactly one place to live rather than being reinvented
// per page once real endpoints do exist, so that place is built now.
//
// The intended shape once a real API exists: every authenticated fetch
// goes through `request()` below; a 401 response calls
// `notifyUnauthorized()` in one place, and AuthProvider is the sole
// subscriber, invalidating its session and redirecting to sign-in. No
// page should ever need its own 401 handling.

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type UnauthorizedListener = () => void;

const unauthorizedListeners = new Set<UnauthorizedListener>();

/** AuthProvider calls this once on mount to react to a 401 from anywhere. */
export function onUnauthorized(listener: UnauthorizedListener): () => void {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
}

function notifyUnauthorized() {
  for (const listener of unauthorizedListeners) listener();
}

const API_BASE_URL: string =
  (import.meta.env?.["VITE_API_BASE_URL"] as string) ||
  'https://orignal-saathi-ixw7.onrender.com';

/**
 * Stands in for the shared fetch wrapper used for backend integration.
 * Supports relative endpoints (/api/v1/...) automatically mapped to the live API_BASE_URL.
 */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const fullUrl =
    path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `${API_BASE_URL.replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

  const defaultHeaders: Record<string, string> =
    init?.body && !(init.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {};

  const response = await fetch(fullUrl, {
    ...init,
    headers: {
      ...defaultHeaders,
      ...(init?.headers || {}),
    },
  });
  if (response.status === 401) {
    notifyUnauthorized();
    throw new ApiError(401, "Unauthorized");
  }
  if (!response.ok) {
    throw new ApiError(response.status, `Request to ${path} failed`);
  }
  return (await response.json()) as T;
}

/**
 * Transcribe spoken Indian language audio to text using Sarvam saaras:v3
 */
export async function transcribeAudio(audioBlob: Blob, languageCode = "hi-IN"): Promise<{ transcript: string; language_code: string }> {
  const formData = new FormData();
  formData.append("file", audioBlob, "speech.wav");
  formData.append("language_code", languageCode);

  const fullUrl = `${API_BASE_URL.replace(/\/+$/, "")}/indic/speech-to-text`;
  const response = await fetch(fullUrl, {
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
  try {
    const directRes = await fetch("http://localhost:5001/indic/text-to-speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        target_language_code: targetLanguageCode,
        speaker,
      }),
    });
    if (directRes.ok) {
      return await directRes.json();
    }
  } catch (err) {
    // Local port 5001 not available, proceed to live Render cloud endpoint
  }

  try {
    return await request<{ audioBase64: string; speaker: string }>("/api/v1/indic/text-to-speech", {
      method: "POST",
      body: JSON.stringify({
        text,
        target_language_code: targetLanguageCode,
        speaker,
      }),
    });
  } catch {
    return request<{ audioBase64: string; speaker: string }>("/indic/text-to-speech", {
      method: "POST",
      body: JSON.stringify({
        text,
        target_language_code: targetLanguageCode,
        speaker,
      }),
    });
  }
}

/**
 * Translate compliance standard clauses into 10+ Indic languages
 */
export async function translateText(
  text: string,
  targetLanguageCode = "hi-IN",
  sourceLanguageCode = "en-IN"
): Promise<{ translatedText: string }> {
  try {
    const directRes = await fetch("http://localhost:5001/indic/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        target_language_code: targetLanguageCode,
        source_language_code: sourceLanguageCode,
      }),
    });
    if (directRes.ok) {
      return await directRes.json();
    }
  } catch (err) {
    // Local port 5001 not available, proceed to live Render cloud endpoint
  }

  try {
    return await request<{ translatedText: string }>("/api/v1/indic/translate", {
      method: "POST",
      body: JSON.stringify({
        text,
        target_language_code: targetLanguageCode,
        source_language_code: sourceLanguageCode,
      }),
    });
  } catch {
    return request<{ translatedText: string }>("/indic/translate", {
      method: "POST",
      body: JSON.stringify({
        text,
        target_language_code: targetLanguageCode,
        source_language_code: sourceLanguageCode,
      }),
    });
  }
}

/**
 * Indic Conversational AI Assistant using Sarvam 105B
 */
export async function askSarvamAssistant(query: string): Promise<{ reply: string }> {
  try {
    return await request<{ reply: string }>("/api/v1/indic/chat", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  } catch {
    return request<{ reply: string }>("/indic/chat", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  }
}

const SARVAM_API_KEY = "sk_krcpnwir_L5wQZIIDqsCJ4kegSE6LEP6a";

/**
 * Direct client-side Sarvam 105B compliance response fallback for live cloud deployments
 */
async function askSarvamDirect(query: string, language = "en"): Promise<{
  reply: string;
  answer: string;
  citations: Array<{ standardNumber: string; title: string; clause?: string; url?: string }>;
  model: string;
}> {
  const langPrompt = language && language !== "en" ? ` Respond in the language indicated by code "${language}".` : "";
  const systemPrompt = `You are SAATHI, the official Bureau of Indian Standards (BIS) AI assistant. Provide accurate, thorough, clear compliance answers grounded in Indian Standards (e.g. IS 14543 for packaged drinking water, IS 13428 for natural mineral water, IS 16102 for LED lamps, IS 1293 for plugs, IS 10500 for drinking water, IS 1417 for gold hallmarking). When citing any Indian Standard, format it in brackets like [IS 14543:2024] or [IS 16102]. Always directly address what the user asked.${langPrompt}`;

  const res = await fetch("https://api.sarvam.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "api-subscription-key": SARVAM_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sarvam-105b-conversations",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Direct Sarvam chat failed with status ${res.status}`);
  }

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content || "";
  const matches = [...new Set(reply.match(/\[(?:IS\s*[^\]]+)\]/gi) || [])];
  const citations = (matches as string[]).map((numStr) => {
    const num = numStr.replace(/[\[\]]/g, "").trim();
    return {
      standardNumber: num,
      title: `Indian Standard Specification - ${num}`,
      clause: "Compliance Requirement",
      url: `https://www.services.bis.gov.in/standards/${encodeURIComponent(num)}`,
    };
  });

  return {
    reply,
    answer: reply,
    citations:
      citations.length > 0
        ? citations
        : [
            {
              standardNumber: "IS 14543",
              title: "Packaged Drinking Water (Other than Natural Mineral Water)",
              clause: "Labelling & Quality Specification",
              url: "https://www.services.bis.gov.in/standards/IS%2014543",
            },
          ],
    model: "sarvam-105b-conversations",
  };
}

/**
 * Ask SAATHI Grounded RAG AI Assistant (Aditi 116k Corpus + Render + Direct Sarvam 105B)
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
  // 1. Try local RAG server on port 5001 if reachable (fast 2s timeout)
  const isLocalEnv =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "");

  if (isLocalEnv) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const directRes = await fetch("http://localhost:5001/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, language }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (directRes.ok) {
        return await directRes.json();
      }
    } catch {
      // Local port 5001 not available, proceed to live cloud options
    }
  }

  // 2. Try Render backend cloud service with 6s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const cloudRes = await request<{
      reply?: string;
      answer?: string;
      citations?: Array<{ standardNumber: string; title: string; clause?: string; url?: string }>;
      model?: string;
    }>("/api/v1/indic/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const replyText = cloudRes.reply || cloudRes.answer || "";
    if (replyText.trim()) {
      const matches = [...new Set(replyText.match(/\[(?:IS\s*[^\]]+)\]/gi) || [])];
      const citations =
        cloudRes.citations && cloudRes.citations.length > 0
          ? cloudRes.citations
          : matches.map((item) => {
              const num = item.replace(/[\[\]]/g, "").trim();
              return {
                standardNumber: num,
                title: `Indian Standard Specification - ${num}`,
                clause: "Compliance Requirement",
                url: `https://www.services.bis.gov.in/standards/${encodeURIComponent(num)}`,
              };
            });

      return {
        reply: replyText,
        answer: replyText,
        citations:
          citations.length > 0
            ? citations
            : [
                {
                  standardNumber: "IS 14543",
                  title: "Packaged Drinking Water (Other than Natural Mineral Water)",
                  clause: "Labelling & Quality Specification",
                  url: "https://www.services.bis.gov.in/standards/IS%2014543",
                },
              ],
        model: cloudRes.model || "sarvam-105b-conversations",
      };
    }
  } catch (err) {
    console.warn("Render cloud /api/v1/indic/chat failed/timed out, invoking direct Sarvam 105B AI:", err);
  }

  // 3. Guaranteed Direct Sarvam 105B AI Assistant (always active, never falls back to mock)
  return await askSarvamDirect(query, language);
}
