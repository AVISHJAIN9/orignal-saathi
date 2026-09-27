import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";
import { AppHeader } from "../components/app-header";
import { LandingFooter } from "../components/landing/landing-footer";
import { AuthProvider } from "../components/auth-provider";
import { RoleProvider } from "../components/role-provider";
import { ThemeProvider } from "../components/theme-provider";
import { UserProfileProvider } from "../components/user-profile-provider";
import { TooltipProvider } from "../components/ui/tooltip";
import { WhatsAppWidget } from "../components/whatsapp-widget";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { NotFoundPage } from "../pages/not-found-page";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back
          home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "SAATHI — BIS Standards Assistant" },
        {
          name: "description",
          content:
            "Bilingual, citation-backed guidance on Indian Standards and BIS certification.",
        },
        { name: "author", content: "SAATHI" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@Lovable" },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundPage,
    errorComponent: ErrorComponent,
  },
);

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// Routes that render LandingNav instead of AppHeader. Every other route
// gets AppHeader, so no page ships a bespoke header of its own.
//   "/"           — LandingNav
//   "/legal"      — renders <LandingNav /> directly
//   "/standards"  — renders its tailored LandingNav with hamburger menu
const NO_APP_HEADER_PATHS = new Set(["/", "/legal", "/standards"]);

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const showAppHeader = !NO_APP_HEADER_PATHS.has(pathname);
  // Show the footer on every page except the chat interface,
  // which has its own full-screen layout with no scrollable body.
  const hideFooter = pathname === "/chat" || pathname.startsWith("/chat/");

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {/* Global, not just for citation-badge.tsx's tooltip: any <Tooltip>
              anywhere in the app (admin charts, conversation history, profile
              settings, …) needs this ancestor or it throws on render. */}
          <TooltipProvider>
            <AuthProvider>
              <RoleProvider>
                <UserProfileProvider>
                  {showAppHeader && <AppHeader />}
                  {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
                  <Outlet />
                  <WhatsAppWidget />
                  {!hideFooter && <LandingFooter />}
                </UserProfileProvider>
              </RoleProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
