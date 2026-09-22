import { StandardsBrowser } from "@/components/standards/standards-browser";

// Public: the standards catalogue is open to everyone, no login/role gate —
// it's the prototype's shop window, and gating it behind a role would hide
// the one page a first-time judge or visitor is most likely to explore.
export function StandardsBrowserPage() {
  return <StandardsBrowser />;
}
