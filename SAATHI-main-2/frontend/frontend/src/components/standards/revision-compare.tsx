import {
  AlertTriangle,
  ArrowUpRight,
  FileStack,
  FileWarning,
  Info,
  Layers,
  ScanEye,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { BisSeal } from "@/components/bis-marks";
import { BrandMark } from "@/components/brand-mark";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  compareRevisions,
  getKnownRevisions,
  type ChangeType,
  type RevisionChange,
  type RevisionComparisonOutcome,
  type RevisionRecord,
} from "@/lib/mock-revisions";
import { cn } from "@/lib/utils";

// The prototype only ever links to BIS's general portal, never a fabricated
// per-document URL — same honesty rule the rest of the app follows (see
// standard-detail.tsx's Sources tab and qco-applicability-check.tsx).
const BIS_PORTAL_URL = "https://www.bis.gov.in";

type Stage = "idle" | "loading" | "result" | "error";

// Sort priority within the compared result: mandatory/numerical/test-method
// changes surface first, regardless of which sub-tab (High Impact / All
// Changes) is active.
const CHANGE_TYPE_PRIORITY: Record<ChangeType, number> = {
  limit_changed: 0,
  test_method_changed: 1,
  added: 2,
  modified: 3,
  removed: 4,
  clarified: 5,
};

function sortChanges(changes: RevisionChange[]): RevisionChange[] {
  return [...changes].sort((a, b) => {
    const priorityDiff =
      CHANGE_TYPE_PRIORITY[a.changeType] - CHANGE_TYPE_PRIORITY[b.changeType];
    if (priorityDiff !== 0) return priorityDiff;
    return Number(b.highImpact) - Number(a.highImpact);
  });
}

// Badge color per change type — five distinct treatments, not six: the
// summary groups limit_changed and test_method_changed together as
// "technical changes" (the spec's single ⚠️ bucket), so both share the
// same orange badge rather than getting a sixth, redundant color.
const CHANGE_TYPE_STYLES: Record<ChangeType, string> = {
  added: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  removed: "bg-red-500/15 text-red-700 dark:text-red-400",
  modified: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  clarified: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  limit_changed: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  test_method_changed: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
};

interface RevisionCompareProps {
  standardNumber: string;
  onOpenComplianceGaps?: () => void;
}

/**
 * The Revision tab's compare flow: idle -> loading -> result -> (reset to
 * idle), with a real error branch — same idle/loading/result/demo-notice
 * shape as QcoApplicabilityCheck (down to reusing its exact BisSeal loading
 * animation), since that's this app's one other "check a mock dataset,
 * never fabricate an answer" flow.
 *
 * `compareRevisions` never fabricates a diff, so the result branches on
 * four outcomes rather than always producing a comparison: a real
 * `compared` result, and three deliberately distinct "can't compare"
 * states (single_revision / unverified / extraction_insufficient) that all
 * share the same dashed, muted visual language as
 * QcoApplicabilityCheck's UnableToDetermineResult so none of them can be
 * mistaken for an actual finding.
 */
export function RevisionCompare({
  standardNumber,
  onOpenComplianceGaps,
}: RevisionCompareProps) {
  const { t } = useTranslation("standards");
  const { verified, unverified } = useMemo(
    () => getKnownRevisions(standardNumber),
    [standardNumber],
  );
  const allRevisions = useMemo(
    () => [...verified, ...unverified],
    [verified, unverified],
  );

  const [stage, setStage] = useState<Stage>("idle");
  const [fromRevision, setFromRevision] = useState(allRevisions[0]);
  const [toRevision, setToRevision] = useState(
    allRevisions[allRevisions.length - 1],
  );
  const [outcome, setOutcome] = useState<RevisionComparisonOutcome | null>(
    null,
  );
  const prefersReducedMotion = useReducedMotion();

  async function runCompare() {
    setStage("loading");
    try {
      const result = await compareRevisions(
        standardNumber,
        fromRevision,
        toRevision,
      );
      setOutcome(result);
      setStage("result");
    } catch {
      setStage("error");
    }
  }

  function reset() {
    setStage("idle");
    setOutcome(null);
  }

  if (allRevisions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Layers className="size-5" aria-hidden />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          {t("detail.revision.noHistory.heading")}
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {t("detail.revision.noHistory.body", { standard: standardNumber })}
        </p>
        <Link
          to="/chat"
          className="text-sm font-medium text-primary underline underline-offset-4"
        >
          {t("detail.qco.unableToDetermine.cta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {stage === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="elevation-1 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <RevisionPicker
                label={t("detail.revision.pickerFromLabel")}
                value={fromRevision}
                onChange={setFromRevision}
                verified={verified}
                unverified={unverified}
              />
              <RevisionPicker
                label={t("detail.revision.pickerToLabel")}
                value={toRevision}
                onChange={setToRevision}
                verified={verified}
                unverified={unverified}
              />
            </div>
            <button
              type="button"
              onClick={runCompare}
              className="elevation-1 elevation-lift inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.97]"
            >
              {t("detail.revision.compareButton")}
            </button>
          </motion.div>
        )}

        {stage === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="elevation-1 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center"
          >
            <div
              className="relative flex size-14 items-center justify-center"
              style={{ perspective: 200 }}
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full border-2 border-primary/50"
                animate={{ opacity: [0, 0.5, 0], scale: [0.6, 1.3, 1.3] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.span
                aria-hidden
                className="relative flex items-center justify-center text-primary"
                animate={{ rotateX: [0, 32, 0], scale: [1, 0.88, 1] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.4, 1],
                }}
              >
                <BisSeal className="size-7" aria-hidden />
              </motion.span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("detail.revision.checking")}
            </p>
          </motion.div>
        )}

        {stage === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="elevation-1 flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center"
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <AlertTriangle className="size-6" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {t("detail.revision.error.heading")}
            </h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              {t("detail.revision.error.body")}
            </p>
            <button
              type="button"
              onClick={runCompare}
              className="elevation-1 elevation-lift mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.97]"
            >
              {t("detail.revision.error.retry")}
            </button>
          </motion.div>
        )}

        {stage === "result" && outcome && (
          <motion.div
            key="result"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="flex flex-col gap-4"
          >
            {outcome.status === "compared" ? (
              <ComparedResult
                record={outcome.record}
                onOpenComplianceGaps={onOpenComplianceGaps}
              />
            ) : outcome.status === "single_revision" ? (
              <EmptyOutcome
                icon={FileStack}
                badge={t("detail.revision.singleRevision.badge")}
                heading={t("detail.revision.singleRevision.heading")}
                body={t("detail.revision.singleRevision.body", {
                  revision: outcome.onlyRevision,
                })}
              />
            ) : outcome.status === "unverified" ? (
              <EmptyOutcome
                icon={FileWarning}
                badge={t("detail.revision.unverifiedResult.badge")}
                heading={t("detail.revision.unverifiedResult.heading")}
                body={t("detail.revision.unverifiedResult.body")}
              />
            ) : (
              <EmptyOutcome
                icon={ScanEye}
                badge={t("detail.revision.extractionInsufficient.badge")}
                heading={t("detail.revision.extractionInsufficient.heading")}
                body={t("detail.revision.extractionInsufficient.body")}
              />
            )}

            <div className="elevation-1 flex items-start gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
              <BrandMark size="sm" />
              <span className="pt-0.5">{t("detail.revision.demoNotice")}</span>
            </div>

            <button
              type="button"
              onClick={reset}
              className="self-start text-sm font-medium text-primary underline underline-offset-4"
            >
              {t("detail.revision.tryAgain")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RevisionPicker({
  label,
  value,
  onChange,
  verified,
  unverified,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  verified: string[];
  unverified: string[];
}) {
  const { t } = useTranslation("standards");
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {verified.map((revision) => (
            <SelectItem key={revision} value={revision}>
              {revision}
            </SelectItem>
          ))}
          {unverified.map((revision) => (
            <SelectItem key={revision} value={revision}>
              <span className="flex items-center gap-2">
                {revision}
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase">
                  {t("detail.revision.unverifiedTag")}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function EmptyOutcome({
  icon: Icon,
  badge,
  heading,
  body,
}: {
  icon: typeof FileStack;
  badge: string;
  heading: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden />
      </div>
      <span className="w-fit rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground uppercase">
        {badge}
      </span>
      <h2 className="text-lg font-semibold text-foreground">{heading}</h2>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}

function ChangeTypeBadge({ changeType }: { changeType: ChangeType }) {
  const { t } = useTranslation("standards");
  return (
    <span
      className={cn(
        "w-fit shrink-0 rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase",
        CHANGE_TYPE_STYLES[changeType],
      )}
    >
      {t(`detail.revision.changeType.${changeType}`)}
    </span>
  );
}

function ComparedResult({
  record,
  onOpenComplianceGaps,
}: {
  record: RevisionRecord;
  onOpenComplianceGaps?: () => void;
}) {
  const { t } = useTranslation("standards");

  const counts = useMemo(() => {
    let added = 0;
    let modified = 0;
    let removed = 0;
    let technical = 0;
    for (const change of record.changes) {
      if (change.changeType === "added") added += 1;
      else if (change.changeType === "removed") removed += 1;
      else if (
        change.changeType === "limit_changed" ||
        change.changeType === "test_method_changed"
      )
        technical += 1;
      // "clarified" folds into the "modified" summary bucket — still its
      // own precise badge on the change card itself, just grouped here to
      // match the spec's four summary buckets rather than a fifth chip.
      else modified += 1;
    }
    return { added, modified, removed, technical };
  }, [record.changes]);

  const highImpactChanges = useMemo(
    () => sortChanges(record.changes.filter((c) => c.highImpact)),
    [record.changes],
  );
  const allChanges = useMemo(
    () => sortChanges(record.changes),
    [record.changes],
  );

  return (
    <div className="elevation-1 flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">
          {t("detail.revision.compared.changesDetected", {
            count: record.changes.length,
          })}
        </h2>
        <p className="font-mono text-xs text-muted-foreground">
          {record.fromRevision} → {record.toRevision}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <SummaryChip
          className={CHANGE_TYPE_STYLES.added}
          count={counts.added}
          label={t("detail.revision.compared.summary.added")}
        />
        <SummaryChip
          className={CHANGE_TYPE_STYLES.modified}
          count={counts.modified}
          label={t("detail.revision.compared.summary.modified")}
        />
        <SummaryChip
          className={CHANGE_TYPE_STYLES.removed}
          count={counts.removed}
          label={t("detail.revision.compared.summary.removed")}
        />
        <SummaryChip
          className={CHANGE_TYPE_STYLES.limit_changed}
          count={counts.technical}
          label={t("detail.revision.compared.summary.technical")}
        />
      </div>

      {record.partial && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{t("detail.revision.compared.partialNotice")}</span>
        </div>
      )}

      {onOpenComplianceGaps ? (
        <button
          type="button"
          onClick={onOpenComplianceGaps}
          className="elevation-1 elevation-lift inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          {t("detail.revision.compared.gapAnalysisCta")}
          <ArrowUpRight className="size-4" aria-hidden />
        </button>
      ) : (
        <Link
          to="/conformity"
          className="elevation-1 elevation-lift inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          {t("detail.revision.compared.gapAnalysisCta")}
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      )}

      <Tabs defaultValue="highImpact">
        <TabsList variant="line">
          <TabsTrigger value="highImpact">
            {t("detail.revision.compared.tabs.highImpact")}
          </TabsTrigger>
          <TabsTrigger value="all">
            {t("detail.revision.compared.tabs.all")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="highImpact" className="pt-4">
          {highImpactChanges.length > 0 ? (
            <ChangeAccordion changes={highImpactChanges} />
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {t("detail.revision.compared.noHighImpact")}
            </p>
          )}
        </TabsContent>

        <TabsContent value="all" className="pt-4">
          <ChangeAccordion changes={allChanges} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SummaryChip({
  className,
  count,
  label,
}: {
  className: string;
  count: number;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        className,
      )}
    >
      {count} {label}
    </span>
  );
}

function ChangeAccordion({ changes }: { changes: RevisionChange[] }) {
  return (
    <Accordion type="multiple" className="flex flex-col gap-2">
      {changes.map((change) => (
        <AccordionItem
          key={change.key}
          value={change.key}
          className="rounded-xl border border-border bg-background px-4"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-1 flex-wrap items-center gap-2.5 pr-2 text-left">
              <ChangeTypeBadge changeType={change.changeType} />
              <span className="font-mono text-xs text-muted-foreground">
                {change.clause}
              </span>
              <span className="text-sm font-medium text-foreground">
                {change.clauseTitle}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ChangeCardBody change={change} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function ChangeCardBody({ change }: { change: RevisionChange }) {
  const { t } = useTranslation("standards");
  const isNumeric = /\d/.test(change.previousValue + change.currentValue);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-0.5 rounded-lg border border-border bg-muted/30 p-3">
          <span className="text-xs text-muted-foreground">
            {t("detail.revision.compared.previousLabel")}
          </span>
          <span
            className={cn("text-sm text-foreground", isNumeric && "font-mono")}
          >
            {change.previousValue}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 rounded-lg border border-border bg-muted/30 p-3">
          <span className="text-xs text-muted-foreground">
            {t("detail.revision.compared.currentLabel")}
          </span>
          <span
            className={cn("text-sm text-foreground", isNumeric && "font-mono")}
          >
            {change.currentValue}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase">
          {t("detail.revision.compared.whatChangedLabel")}
        </h4>
        <p className="text-sm leading-relaxed text-foreground">
          {change.whatChanged}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase">
          {t("detail.revision.compared.whyItMattersLabel")}
        </h4>
        <p className="text-sm leading-relaxed text-foreground">
          {change.whyItMatters}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span>
          {t("detail.revision.compared.evidencePreviousLabel", {
            page: change.previousEvidence.page,
          })}
        </span>
        <span>
          {t("detail.revision.compared.evidenceCurrentLabel", {
            page: change.currentEvidence.page,
          })}
        </span>
      </div>

      <a
        href={BIS_PORTAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-4"
      >
        {t("detail.revision.compared.openSource")}
        <ArrowUpRight className="size-3.5" aria-hidden />
      </a>
    </div>
  );
}
