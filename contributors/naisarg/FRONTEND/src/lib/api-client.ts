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

/**
 * Stands in for the one shared fetch wrapper a real backend integration
 * would use — not called anywhere yet, since there is nothing real to
 * call (see the file header). Kept here, fully wired to
 * `notifyUnauthorized`, so adding the first real endpoint later means
 * writing a `request("/api/v1/...")` call, not building this plumbing
 * under time pressure.
 */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  if (response.status === 401) {
    notifyUnauthorized();
    throw new ApiError(401, "Unauthorized");
  }
  if (!response.ok) {
    throw new ApiError(response.status, `Request to ${path} failed`);
  }
  return (await response.json()) as T;
}
