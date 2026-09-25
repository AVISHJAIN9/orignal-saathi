import {
  AlertTriangle,
  CircleAlert,
  FileSearch,
  Lightbulb,
  PackageSearch,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import type { DocumentAnalysisResult as AnalysisResultData } from "@/lib/mock-document-analysis";
import { cn } from "@/lib/utils";

// Each section mounts SECTION_DELAY after the previous one — same
// mount-triggered stagger spring used by StandardCard/NotificationItem/
// IntelFeedItem, applied here to whole sections instead of list rows.
const SECTION_DELAY = 0.12;

interface DocumentAnalysisResultProps {
  result: AnalysisResultData;
  fileName: string;
}

/** The five-section compliance read-out for one analyzed document: detected
 * product, relevant standards, potential issues, missing information, and
 * recommendations — each section fading/sliding in after the last. */
export function DocumentAnalysisResult({
  result,
  fileName,
}: DocumentAnalysisResultProps) {
  const { t } = useTranslation(["cortex", "standards"]);

  return (
    <div className="flex flex-col gap-4">
      <Section
        index={0}
        icon={PackageSearch}
        title={t("sections.detectedProduct")}
      >
        <p className="text-base font-semibold text-foreground">
          {t(`results.${result.key}.product`)}
        </p>
        <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
          {fileName}
        </p>
      </Section>

      <Section
        index={1}
        icon={FileSearch}
        title={t("sections.relevantStandards")}
      >
        <div className="flex flex-wrap gap-2">
          {result.standardKeys.map((key) => (
            <Badge
              key={key}
              variant="outline"
              className="border-transparent bg-primary/10 text-primary"
            >
              {t(`standards:list.${key}`)}
            </Badge>
          ))}
        </div>
      </Section>

      <Section
        index={2}
        icon={AlertTriangle}
        title={t("sections.potentialIssues")}
      >
        {result.issues.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("sections.issuesEmpty")}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {result.issues.map((issue) => (
              <div
                key={issue.key}
                className="rounded-lg border border-border bg-background p-3"
              >
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-2xs font-semibold tracking-wide uppercase",
                    issue.severity === "critical"
                      ? "bg-red-500/15 text-red-700 dark:text-red-400"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-400",
                  )}
                >
                  {issue.severity === "critical"
                    ? t("severityCritical")
                    : t("severityMinor")}
                </span>
                <p className="mt-1.5 text-sm font-medium text-foreground">
                  {t(`results.${result.key}.issues.${issue.key}.title`)}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {t(`results.${result.key}.issues.${issue.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section
        index={3}
        icon={CircleAlert}
        title={t("sections.missingInformation")}
      >
        <ul className="flex flex-col gap-1.5">
          {result.missingKeys.map((key) => (
            <li
              key={key}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span
                className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground/60"
                aria-hidden
              />
              {t(`results.${result.key}.missing.${key}`)}
            </li>
          ))}
        </ul>
      </Section>

      <Section index={4} icon={Lightbulb} title={t("sections.recommendations")}>
        <ul className="flex flex-col gap-1.5">
          {result.recommendationKeys.map((key) => (
            <li
              key={key}
              className="flex items-start gap-2 text-sm text-foreground"
            >
              <Lightbulb
                className="mt-0.5 size-3.5 shrink-0 text-primary"
                aria-hidden
              />
              {t(`results.${result.key}.recommendations.${key}`)}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({
  index,
  icon: Icon,
  title,
  children,
}: {
  index: number;
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * SECTION_DELAY,
      }}
      className="elevation-1 elevation-transition rounded-xl border border-border bg-card p-4"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="size-4 text-primary" aria-hidden />
        {title}
      </div>
      <div className="mt-2.5">{children}</div>
    </motion.div>
  );
}
