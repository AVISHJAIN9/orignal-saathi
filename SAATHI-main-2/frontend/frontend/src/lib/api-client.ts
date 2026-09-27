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
  (import.meta.env?.VITE_API_BASE_URL as string) ||
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

  const response = await fetch(fullUrl, init);
  if (response.status === 401) {
    notifyUnauthorized();
    throw new ApiError(401, "Unauthorized");
  }
  if (!response.ok) {
    throw new ApiError(response.status, `Request to ${path} failed`);
  }
  return (await response.json()) as T;
}
