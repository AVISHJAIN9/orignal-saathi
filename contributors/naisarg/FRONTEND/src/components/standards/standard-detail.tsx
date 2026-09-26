import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  ExternalLink,
  FileCheck,
  FileText,
  History,
  Info,
  Layers,
  Link2,
  ListTree,
  Loader2,
  Scale,
  ScrollText,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { AmbientBackground } from "@/components/ambient-background";
import { ApplicationReadiness } from "@/components/standards/application-readiness";
import { ComplianceGapAnalyzer } from "@/components/standards/compliance-gap-analyzer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchStandardDetail,
  type BISStandardDetail,
} from "@/lib/bis-standards-data";
import { getStandardByKey } from "@/lib/mock-standards";
import { cn } from "@/lib/utils";
import { NotFoundPage } from "@/pages/not-found-page";

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
  initialTab?: string;
}

export function StandardDetail({
  standardKey,
  initialTab,
}: StandardDetailProps) {
  const { t } = useTranslation(["standards", "admin"]);
  const mockFallback = getStandardByKey(standardKey);
  const [detail, setDetail] = useState<BISStandardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    initialTab && (KNOWN_TABS as readonly string[]).includes(initialTab)
      ? initialTab
      : "overview",
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchStandardDetail(standardKey)
      .then((data) => {
        if (!cancelled) {
          setDetail(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch standard detail:", err);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [standardKey]);

  if (!loading && !detail && !mockFallback) {
    return <NotFoundPage />;
  }

  const master = detail?.master;
  const standardNumber =
    master?.IS_number || mockFallback?.standardNumber || standardKey;
  const title =
    master?.IS_title ||
    (mockFallback ? t(`standards:list.${mockFallback.key}`) : standardKey);
  const categoryLabel =
    master?.category_label ||
    (mockFallback?.categoryKey
      ? t(`admin:topics.${mockFallback.categoryKey}`)
      : "General Standards");
  const categoryKey = master?.category_key || mockFallback?.categoryKey || "general";
  const status = master?.status || mockFallback?.status || "Active";

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6">
        {/* Header Card */}
        <div className="elevation-2 flex flex-col gap-4 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2.5">
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
                  {standardNumber}
                </span>
                <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  {categoryLabel}
                </span>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 font-mono text-xs font-semibold uppercase",
                    status === "Active"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-400",
                  )}
                >
                  {status}
                </span>
                {master?.reaffirmation_year && (
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                    Reaffirmed {master.reaffirmation_year}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {title}
              </h1>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList variant="line" className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">
              {t("standards:detail.tabs.overview")}
            </TabsTrigger>
            <TabsTrigger value="requirements">
              {t("standards:detail.tabs.requirements")}
            </TabsTrigger>
            <TabsTrigger value="clauses">
              {t("standards:detail.tabs.clauses")}
              {detail?.clauses && detail.clauses.length > 0 && (
                <span className="ml-1.5 rounded-full bg-primary/20 px-1.5 py-0.2 font-mono text-[0.65rem] text-primary">
                  {detail.clauses.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="qco">
              {t("standards:detail.tabs.qco")}
              {detail?.qco && (
                <span className="ml-1.5 size-1.5 rounded-full bg-emerald-500" />
              )}
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

          {/* ── 1. OVERVIEW ── */}
          <TabsContent value="overview" className="flex flex-col gap-4 pt-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                BIS Catalogue Specification
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {title}. This standard is classified under{" "}
                <strong className="text-foreground">{master?.technical_department || categoryLabel}</strong>{" "}
                and supervised by the{" "}
                <strong className="text-foreground">{master?.technical_committee || "Sectional Committee"}</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  Standard Identifier
                </span>
                <p className="mt-1 font-mono text-sm font-bold text-foreground">
                  {standardNumber}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  Aspect / Scope
                </span>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {master?.aspect || "Product Specification"}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  Status
                </span>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      status === "Active" ? "bg-emerald-500" : "bg-amber-500",
                    )}
                  />
                  {status}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  Technical Department
                </span>
                <p className="mt-1 text-xs font-medium text-foreground">
                  {master?.technical_department || "Not specified in index"}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  Technical Committee
                </span>
                <p className="mt-1 text-xs font-medium text-foreground">
                  {master?.technical_committee || "Sectional Committee"}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  Equivalence / Harmonization
                </span>
                <p className="mt-1 text-xs font-medium text-foreground">
                  {master?.degree_of_equivalence || "None recorded"}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  Revisions & Amendments
                </span>
                <p className="mt-1 text-xs font-medium text-foreground">
                  {master?.number_of_revisions || "Original"} rev • {master?.number_of_amendments || "0 amendments"}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  Gazette Notifications
                </span>
                <p className="mt-1 font-mono text-xs font-medium text-foreground">
                  {master?.gazette_document_count ?? 0} notified documents
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <span className="font-mono text-xs text-muted-foreground uppercase">
                  BIS Dataset ID
                </span>
                <p className="mt-1 font-mono text-xs font-medium text-foreground">
                  {master?.internal_id ? `BIS-${master.internal_id}` : "Unindexed"}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* ── 2. REQUIREMENTS ── */}
          <TabsContent value="requirements" className="flex flex-col gap-4 pt-4">
            {detail &&
            (detail.indianReferences.length > 0 ||
              detail.internationalReferences.length > 0 ||
              detail.clauses.length > 0) ? (
              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2 text-primary">
                    <FileCheck className="size-4" aria-hidden />
                    <h2 className="text-sm font-semibold tracking-wide uppercase">
                      Normative Technical Requirements
                    </h2>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    According to the BIS index for {standardNumber}, conformance requires
                    compliance with the following referenced standards, test procedures, and
                    technical criteria:
                  </p>
                </div>

                {detail.indianReferences.length > 0 && (
                  <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
                    <h3 className="text-xs font-bold tracking-wider text-foreground uppercase">
                      Referenced Indian Standards (Normative Dependencies) — {detail.indianReferences.length} Standards
                    </h3>
                    <div className="mt-2 divide-y divide-border/60">
                      {detail.indianReferences.slice(0, 15).map((ref, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between gap-4 py-2.5 text-xs"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="font-mono font-bold text-primary">
                              {ref.isNumber}
                            </span>
                            <span className="text-muted-foreground">
                              {ref.title}
                            </span>
                          </div>
                          {ref.committee && (
                            <span className="shrink-0 rounded bg-muted px-2 py-0.5 font-mono text-[0.65rem] text-muted-foreground">
                              {ref.committee}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    {detail.indianReferences.length > 15 && (
                      <p className="mt-2 font-mono text-xs text-muted-foreground">
                        + {detail.indianReferences.length - 15} more normative references indexed in BIS database.
                      </p>
                    )}
                  </div>
                )}

                {detail.internationalReferences.length > 0 && (
                  <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
                    <h3 className="text-xs font-bold tracking-wider text-foreground uppercase">
                      International Standard Harmonization (ISO/IEC) — {detail.internationalReferences.length} Standards
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {detail.internationalReferences.map((intl, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs text-foreground"
                        >
                          {intl.standard}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-border bg-muted/20 py-12 text-center">
                <FileText className="size-6 text-muted-foreground/50" aria-hidden />
                <p className="max-w-md text-sm font-medium text-muted-foreground">
                  Detailed requirements are not available in the current indexed dataset.
                </p>
                <p className="max-w-xs text-xs text-muted-foreground/75">
                  Normative clause documents can be consulted on the official BIS portal or queried via chat.
                </p>
                <Link
                  to="/chat"
                  className="mt-1 text-xs font-medium text-primary underline underline-offset-4"
                >
                  {t("standards:detail.askInChat")}
                </Link>
              </div>
            )}
          </TabsContent>

          {/* ── 3. CLAUSES ── */}
          <TabsContent value="clauses" className="flex flex-col gap-4 pt-4">
            {detail?.clauses && detail.clauses.length > 0 ? (
              <div className="flex flex-col gap-3">
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 text-primary">
                    <BadgeCheck className="size-4" aria-hidden />
                    <span className="text-xs font-bold tracking-wide uppercase">
                      Verified Clause-Level Data
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The following verified clauses have been indexed for {standardNumber}:
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {detail.clauses.map((clause, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-primary">
                          {clause.clauseNumber} — {clause.title}
                        </span>
                        {clause.isMandatory && (
                          <span className="rounded bg-rose-500/15 px-2 py-0.5 text-[0.65rem] font-bold text-rose-700 dark:text-rose-400 uppercase">
                            Mandatory
                          </span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {clause.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-border bg-muted/20 py-12 text-center">
                <ScrollText className="size-6 text-muted-foreground/50" aria-hidden />
                <p className="max-w-md text-sm font-medium text-muted-foreground">
                  Clause-level information is not available in the current indexed knowledge base.
                </p>
                <p className="max-w-xs text-xs text-muted-foreground/75">
                  Full text clauses are available through the Bureau of Indian Standards document sales portal.
                </p>
                <Link
                  to="/chat"
                  className="mt-1 text-xs font-medium text-primary underline underline-offset-4"
                >
                  {t("standards:detail.askInChat")}
                </Link>
              </div>
            )}
          </TabsContent>

          {/* ── 4. QCO (QUALITY CONTROL ORDER) ── */}
          <TabsContent value="qco" className="flex flex-col gap-4 pt-4">
            {detail?.qco ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="size-5 shrink-0" aria-hidden />
                    <h2 className="text-base font-bold">
                      {detail.qco.title}
                    </h2>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {detail.qco.scope}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Effective Date: </span>
                      <strong className="font-mono text-foreground">
                        {detail.qco.effectiveDate}
                      </strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Certification: </span>
                      <strong className="text-emerald-700 dark:text-emerald-400">
                        Mandatory BIS Certification
                      </strong>
                    </div>
                  </div>
                </div>

                {detail.qco.requirements.length > 0 && (
                  <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
                    <h3 className="text-xs font-bold tracking-wider text-foreground uppercase">
                      QCO Regulatory Requirements
                    </h3>
                    <ul className="mt-2 flex flex-col gap-2 text-xs text-muted-foreground">
                      {detail.qco.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="size-3.5 shrink-0 text-primary mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detail.qco.exemptions.length > 0 && (
                  <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
                    <h3 className="text-xs font-bold tracking-wider text-foreground uppercase">
                      Exemptions
                    </h3>
                    <ul className="mt-2 flex flex-col gap-2 text-xs text-muted-foreground">
                      {detail.qco.exemptions.map((ex, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Info className="size-3.5 shrink-0 text-amber-500 mt-0.5" />
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-border bg-muted/20 py-12 text-center">
                <ShieldQuestion className="size-6 text-muted-foreground/50" aria-hidden />
                <p className="max-w-md text-sm font-medium text-muted-foreground">
                  Quality Control Order (QCO) information is not available in the current indexed dataset for this standard.
                </p>
                <p className="max-w-sm text-xs text-muted-foreground/75">
                  BIS has not indexed a mandatory QCO record for this standard in the local repository. Note: This does not certify voluntary status without verification against the latest Ministry Gazette notifications.
                </p>
                <Link
                  to="/chat"
                  className="mt-1 text-xs font-medium text-primary underline underline-offset-4"
                >
                  {t("standards:detail.askInChat")}
                </Link>
              </div>
            )}
          </TabsContent>

          {/* ── 5. COMPLIANCE GAPS ── */}
          <TabsContent value="complianceGaps" className="pt-4">
            <ComplianceGapAnalyzer standardNumber={standardNumber} />
          </TabsContent>

          {/* ── 6. READINESS ── */}
          <TabsContent value="readiness" className="pt-4">
            <ApplicationReadiness
              standardNumber={standardNumber}
              onOpenComplianceGaps={() => setActiveTab("complianceGaps")}
            />
          </TabsContent>

          {/* ── 7. REVISION ── */}
          <TabsContent value="revision" className="flex flex-col gap-4 pt-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-primary">
                <History className="size-4" aria-hidden />
                <h2 className="text-sm font-semibold tracking-wide uppercase">
                  Revision & Supersession History
                </h2>
              </div>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-muted-foreground">Current Edition</dt>
                  <dd className="font-mono text-sm font-bold text-foreground">
                    {standardNumber}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-muted-foreground">Number of Revisions</dt>
                  <dd className="text-sm font-medium text-foreground">
                    {master?.number_of_revisions || "None recorded"}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-muted-foreground">Amendments Issued</dt>
                  <dd className="text-sm font-medium text-foreground">
                    {master?.number_of_amendments || "0 amendments"}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-muted-foreground">Supersedes</dt>
                  <dd className="font-mono text-sm font-medium text-foreground">
                    {master?.superseding_IS && master.superseding_IS !== "None"
                      ? master.superseding_IS
                      : "No previous superseding standard recorded"}
                  </dd>
                </div>
              </dl>
            </div>

            {detail?.referredBy && detail.referredBy.length > 0 && (
              <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
                <h3 className="text-xs font-bold tracking-wider text-foreground uppercase">
                  Referred By Standards in BIS Catalogue ({detail.referredBy.length} Standards)
                </h3>
                <p className="text-xs text-muted-foreground">
                  The following standards cite or incorporate {standardNumber}:
                </p>
                <div className="mt-2 divide-y divide-border/60">
                  {detail.referredBy.slice(0, 12).map((ref, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-4 py-2.5 text-xs"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono font-bold text-primary">
                          {ref.isNumber}
                        </span>
                        <span className="text-muted-foreground">
                          {ref.title}
                        </span>
                      </div>
                      {ref.committee && (
                        <span className="shrink-0 rounded bg-muted px-2 py-0.5 font-mono text-[0.65rem] text-muted-foreground">
                          {ref.committee}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {detail.referredBy.length > 12 && (
                  <p className="mt-2 font-mono text-xs text-muted-foreground">
                    + {detail.referredBy.length - 12} additional citing standards in BIS catalogue.
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          {/* ── 8. SOURCES ── */}
          <TabsContent value="sources" className="flex flex-col gap-3 pt-4">
            {master?.detail_url && (
              <a
                href={master.detail_url}
                target="_blank"
                rel="noopener noreferrer"
                className="elevation-1 elevation-lift flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-sm transition-shadow hover:border-primary/50"
              >
                <span className="flex items-center gap-2.5">
                  <ExternalLink className="size-4 text-primary" aria-hidden />
                  <span className="font-medium text-foreground">
                    Official BIS Know Your Standards Portal ({standardNumber})
                  </span>
                </span>
                <ArrowUpRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </a>
            )}

            {master?.download_url && (
              <a
                href={master.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="elevation-1 elevation-lift flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-sm transition-shadow hover:border-primary/50"
              >
                <span className="flex items-center gap-2.5">
                  <Link2 className="size-4 text-primary" aria-hidden />
                  <span className="font-medium text-foreground">
                    BIS Standards Sales & Download Directory (ID: {master.internal_id})
                  </span>
                </span>
                <ArrowUpRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </a>
            )}

            {master?.composition_url && (
              <a
                href={master.composition_url}
                target="_blank"
                rel="noopener noreferrer"
                className="elevation-1 elevation-lift flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-sm transition-shadow hover:border-primary/50"
              >
                <span className="flex items-center gap-2.5">
                  <Scale className="size-4 text-primary" aria-hidden />
                  <span className="font-medium text-foreground">
                    Technical Committee Composition ({master.technical_committee || "Committee"})
                  </span>
                </span>
                <ArrowUpRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </a>
            )}

            <div className="rounded-xl border border-border bg-muted/20 p-4 text-xs leading-relaxed text-muted-foreground">
              <span className="font-bold text-foreground">Dataset Provenance: </span>
              Extracted from official Bureau of Indian Standards (BIS) electronic repository. Record Internal ID: {master?.internal_id ?? "N/A"}.
              All statutory interpretations must refer to the Gazette of India notifications published under the authority of the Bureau of Indian Standards Act, 2016.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
