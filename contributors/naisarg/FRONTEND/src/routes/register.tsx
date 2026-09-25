import { createFileRoute, redirect } from "@tanstack/react-router";

// /registration/new is the canonical URL for the registration wizard (it's
// the one the nav and most in-app links use, and "/register" reads like
// account sign-up). Kept only as a redirect so old links and bookmarks still
// land on the wizard, rather than as a second live copy that could drift.
export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    throw redirect({ to: "/registration/new", replace: true });
  },
});
