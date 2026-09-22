import {
  ArrowLeft,
  ArrowUpRight,
  Link2,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { AmbientBackground } from "@/components/ambient-background";
import { ApplicationReadiness } from "@/components/standards/application-readiness";
import { ComplianceGapAnalyzer } from "@/components/standards/compliance-gap-analyzer";
import { DocumentChecklist } from "@/components/standards/document-checklist";
import { QcoApplicabilityCheck } from "@/components/standards/qco-applicability-check";
import { RevisionCompare } from "@/components/standards/revision-compare";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStandardByKey } from "@/lib/mock-standards";
import { NotFoundPage } from "@/pages/not-found-page";

// The prototype only ever links to BIS's general portal, never a fabricated
// per-document URL — same honesty rule the chat citations already follow
// (see citation-badge.tsx's sourceUrl, always this same address).
const BIS_PORTAL_URL = "https://www.bis.gov.in";

const KNOWN_TABS = [
  "overview",
  "requirements",
  "clauses",
  "qco",
  "complianceGaps",
  "readiness",
  "revision",
  "sources",
] as const;

interface StandardDetailProps {
  standardKey: string;
  // From the route's `?tab=` search param (see
  // routes/standards_.$standardKey.tsx) — lets another page (the S2
  // dashboard) deep-link straight into a tab. Falls back to "overview" for
  // an absent or unrecognized value rather than rendering a blank tab.
  initialTab?: string;
}

/**
 * Foundation page for C1-C4/S15: a tabbed detail view any standard
 * resolves into. Tab order is Overview / Requirements / Clauses / QCO /
 * Compliance Gaps / Readiness / Revision / Sources. Overview, Requirements
 * (S15's DocumentChecklist), Sources, QCO, Compliance Gaps, Readiness, and
 * Revision have real content — Clauses remains an open namespace-backed
 * placeholder tab future work fills in. Reachable today by clicking a card in
 * StandardsBrowser; a secondary entry point from the Classification
 * Wizard / CitationBadge straight into the QCO tab is planned but not
 * wired up yet.
 *
 * The Tabs are controlled (rather than uncontrolled `defaultValue`) so the
 * Revision tab's "Run Compliance Gap Analysis" CTA, and the Readiness
 * tab's "View Compliance Gaps" CTA, can both switch straight to the
 * Compliance Gaps tab in place, instead of navigating away.
 */
export function StandardDetail({
  standardKey,
  initialTab,
}: StandardDetailProps) {
  const { t } = useTranslation(["standards", "admin"]);
  const standard = getStandardByKey(standardKey);
  const [activeTab, setActiveTab] = useState(
    initialTab && (KNOWN_TABS as readonly string[]).includes(initialTab)
      ? initialTab
      : "overview",
  );

  if (!standard) return <NotFoundPage />;

  const title = t(`standards:list.${standard.key}`);
  const description = t(`standards:descriptions.${standard.key}`);
  const categoryLabel = t(`admin:topics.${standard.categoryKey}`);

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-5 shadow-xs backdrop-blur-md sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Link
                to="/standards"
                className="group inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft
                  className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
                  aria-hidden
                />
                {t("standards:detail.backToBrowser")}
              </Link>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-sm font-bold tracking-tight text-primary">
                  {standard.standardNumber}
                </span>
                <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  {categoryLabel}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {title}
              </h1>
            </div>
            <Link
              to="/chat"
              className="shrink-0 text-sm font-medium text-primary underline underline-offset-4"
            >
              {t("standards:backToChat")}
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList variant="line">
            <TabsTrigger value="overview">
              {t("standards:detail.tabs.overview")}
            </TabsTrigger>
            <TabsTrigger value="requirements">
              {t("standards:detail.tabs.requirements")}
            </TabsTrigger>
            <TabsTrigger value="clauses">
              {t("standards:detail.tabs.clauses")}
            </TabsTrigger>
            <TabsTrigger value="qco">
              {t("standards:detail.tabs.qco")}
            </TabsTrigger>
            <TabsTrigger value="complianceGaps">
              {t("standards:detail.tabs.complianceGaps")}
            </TabsTrigger>
            <TabsTrigger value="readiness">
              {t("standards:detail.tabs.readiness")}
            </TabsTrigger>
            <TabsTrigger value="revision">
              {t("standards:detail.tabs.revision")}
            </TabsTrigger>
            <TabsTrigger value="sources">
              {t("standards:detail.tabs.sources")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex flex-col gap-4 pt-4">
            <p className="text-sm leading-relaxed text-foreground">
              {description}
            </p>
            <dl className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm sm:flex-row sm:gap-10">
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">
                  {t("standards:columns.standardNumber")}
                </dt>
                <dd className="font-mono font-medium text-foreground">
                  {standard.standardNumber}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">
                  {t("standards:columns.category")}
                </dt>
                <dd className="font-medium text-foreground">{categoryLabel}</dd>
              </div>
            </dl>
          </TabsContent>

          <TabsContent value="requirements" className="pt-4">
            <DocumentChecklist
              standardKey={standard.key}
              standardNumber={standard.standardNumber}
            />
          </TabsContent>

          <TabsContent value="clauses" className="pt-4">
            <TabPlaceholder
              icon={ScrollText}
              standardNumber={standard.standardNumber}
            />
          </TabsContent>

          <TabsContent value="qco" className="pt-4">
            <QcoApplicabilityCheck standardNumber={standard.standardNumber} />
          </TabsContent>

          <TabsContent value="complianceGaps" className="pt-4">
            <ComplianceGapAnalyzer standardNumber={standard.standardNumber} />
          </TabsContent>

          <TabsContent value="readiness" className="pt-4">
            <ApplicationReadiness
              standardNumber={standard.standardNumber}
              onOpenComplianceGaps={() => setActiveTab("complianceGaps")}
            />
          </TabsContent>

          <TabsContent value="revision" className="pt-4">
            <RevisionCompare
              standardNumber={standard.standardNumber}
              onOpenComplianceGaps={() => setActiveTab("complianceGaps")}
            />
          </TabsContent>

          <TabsContent value="sources" className="flex flex-col gap-3 pt-4">
            <a
              href={BIS_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="elevation-1 elevation-lift flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-sm transition-shadow"
            >
              <span className="flex items-center gap-2.5">
                <Link2 className="size-4 text-primary" aria-hidden />
                <span className="font-medium text-foreground">
                  {t("standards:detail.sources.officialPortal")}
                </span>
              </span>
              <ArrowUpRight
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
            </a>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t("standards:detail.sources.note", {
                standard: standard.standardNumber,
              })}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TabPlaceholder({
  icon: Icon,
  standardNumber,
}: {
  icon: LucideIcon;
  standardNumber: string;
}) {
  const { t } = useTranslation("standards");
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 py-12 text-center">
      <Icon className="size-6 text-muted-foreground/50" aria-hidden />
      <p className="max-w-xs text-sm text-muted-foreground">
        {t("standards:detail.notYetAvailable", { standard: standardNumber })}
      </p>
      <Link
        to="/chat"
        className="text-xs font-medium text-primary underline underline-offset-4"
      >
        {t("standards:detail.askInChat")}
      </Link>
    </div>
  );
}
