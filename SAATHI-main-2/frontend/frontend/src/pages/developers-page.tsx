import {
  AlertTriangle,
  BookOpen,
  Check,
  Code,
  Copy,
  Gauge,
  History,
  Key,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AmbientBackground } from "@/components/ambient-background";
import { DeveloperEndpointCard } from "@/components/developers/developer-endpoint-card";
import { DeveloperSidebar } from "@/components/developers/developer-sidebar";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/developer-data";

export function DevelopersPage() {
  const { t } = useTranslation("developers");
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedBaseUrl, setCopiedBaseUrl] = useState(false);

  function handleCopyBaseUrl() {
    navigator.clipboard.writeText(API_BASE_URL);
    setCopiedBaseUrl(true);
    setTimeout(() => setCopiedBaseUrl(false), 2000);
  }

  function handleSelectSection(id: string) {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {t("eyebrow")}
          </span>
        </div>

        {/* Header banner */}
        <div className="flex flex-col justify-between gap-5 rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-md md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-fit rounded-full bg-primary/10 px-3 py-0.5 font-mono text-xs font-semibold tracking-wide text-primary uppercase">
                {t("eyebrow")}
              </span>
              {/* No --success token in this app, same as document-status/notification
                  precedent — emerald + dark: variant is the established exception. */}
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                {t("status")}
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {t("heading")}
            </h1>
            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {t("subheading")}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-muted/40 p-3.5 sm:min-w-[280px]">
            <span className="font-mono text-2xs font-medium text-muted-foreground">
              {t("baseUrlLabel")}
            </span>
            <div className="flex items-center justify-between gap-2 font-mono text-xs text-foreground">
              <code>{API_BASE_URL}</code>
              <button
                type="button"
                onClick={handleCopyBaseUrl}
                aria-label={copiedBaseUrl ? t("copied") : t("copy")}
                className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              >
                {copiedBaseUrl ? (
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Prototype disclaimer — matches Jurisdiction's disclaimer treatment */}
        <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
          <ShieldAlert className="size-3.5 shrink-0 text-primary" />
          <p>{t("disclaimer")}</p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <DeveloperSidebar
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
          />

          <main className="flex min-w-0 flex-1 flex-col gap-8">
            <section
              id="overview"
              className="flex scroll-mt-20 flex-col gap-4 rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <BookOpen className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  {t("sections.overview.title")}
                </h2>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {t("sections.overview.p1")}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {t("sections.overview.p2")}
              </p>
            </section>

            <section
              id="authentication"
              className="flex scroll-mt-20 flex-col gap-4 rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <Key className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  {t("sections.authentication.title")}
                </h2>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {t("sections.authentication.description")}
              </p>
              <div className="rounded-xl border border-border bg-muted/40 p-3.5 font-mono text-xs text-foreground">
                <code>Authorization: Bearer YOUR_API_SECRET_KEY</code>
              </div>
            </section>

            <section
              id="quickstart"
              className="flex scroll-mt-20 flex-col gap-4 rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <Zap className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  {t("sections.quickstart.title")}
                </h2>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {t("sections.quickstart.description")}
              </p>
            </section>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2 pt-2">
                <Code className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  {t("endpointsHeading")}
                </h2>
              </div>

              {API_ENDPOINTS.map((endpoint) => (
                <DeveloperEndpointCard key={endpoint.id} endpoint={endpoint} />
              ))}
            </div>

            <section
              id="rate-limits"
              className="flex scroll-mt-20 flex-col gap-4 rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <Gauge className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  {t("sections.rateLimits.title")}
                </h2>
              </div>
              <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
                  <span className="font-semibold text-foreground">
                    • {t("sections.rateLimits.tier1")}
                  </span>
                </li>
                <li className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
                  <span className="font-semibold text-foreground">
                    • {t("sections.rateLimits.tier2")}
                  </span>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground italic">
                {t("sections.rateLimits.headersNote")}
              </p>
            </section>

            <section
              id="errors"
              className="flex scroll-mt-20 flex-col gap-4 rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <AlertTriangle className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  {t("sections.errors.title")}
                </h2>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border bg-background">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-muted/50 font-mono text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">
                        {t("table.statusCode")}
                      </th>
                      <th className="px-4 py-2.5 font-medium">
                        {t("table.meaning")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-mono text-xs">
                    {/* 200: no --success token, raw emerald (established exception).
                        400/429: no --warning token, raw amber (established exception).
                        401/500 ARE genuine error states — this app already has
                        --destructive for exactly that, so no raw color needed. */}
                    <tr className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-bold text-emerald-600 dark:text-emerald-400">
                        200 OK
                      </td>
                      <td className="px-4 py-2.5 font-sans text-foreground">
                        {t("sections.errors.e200")}
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-bold text-amber-600 dark:text-amber-400">
                        400 Bad Request
                      </td>
                      <td className="px-4 py-2.5 font-sans text-foreground">
                        {t("sections.errors.e400")}
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-bold text-destructive">
                        401 Unauthorized
                      </td>
                      <td className="px-4 py-2.5 font-sans text-foreground">
                        {t("sections.errors.e401")}
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-bold text-amber-600 dark:text-amber-400">
                        429 Rate Exceeded
                      </td>
                      <td className="px-4 py-2.5 font-sans text-foreground">
                        {t("sections.errors.e429")}
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-bold text-destructive">
                        500 Internal Error
                      </td>
                      <td className="px-4 py-2.5 font-sans text-foreground">
                        {t("sections.errors.e500")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section
              id="changelog"
              className="flex scroll-mt-20 flex-col gap-4 rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <History className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  {t("sections.changelog.title")}
                </h2>
              </div>
              <div className="flex flex-col gap-3 font-mono text-xs">
                <div className="flex flex-col gap-1 rounded-xl border border-border bg-background p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">
                      {t("sections.changelog.version")}
                    </span>
                    <span className="text-2xs text-muted-foreground">
                      {t("sections.changelog.date")}
                    </span>
                  </div>
                  <p className="pt-1 font-sans text-xs text-muted-foreground">
                    {t("sections.changelog.note")}
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
