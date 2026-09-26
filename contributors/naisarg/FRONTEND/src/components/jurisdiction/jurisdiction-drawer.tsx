import {
  Award,
  BookOpen,
  Building2,
  Layers,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Ref } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import type { JurisdictionData } from "@/lib/mock-jurisdictions";
import { ENTRANCE_TRANSITION } from "@/lib/motion";

interface JurisdictionDrawerProps {
  jurisdiction: JurisdictionData | null;
  onClose: () => void;
  /** The drawer's outer element, for scrolling it into view. */
  ref?: Ref<HTMLDivElement>;
}

// Leaving is quicker than arriving: a short ease-in, so closing never holds
// up the list sliding back into its place.
const EXIT_TRANSITION = { duration: 0.18, ease: "easeIn" } as const;

/** Opens with the app's shared entrance spring (fade + a 12px drop into
 * place) and fades back up on close. The entrance waits until the drawer
 * is actually on screen (below the 56px sticky header): selecting a card
 * far down the list mounts the drawer out of sight, and the page then
 * scrolls up to it — played on mount, the entrance would finish before it
 * arrived. Switching straight to another jurisdiction keeps the drawer in
 * place and only cross-fades its contents. scroll-mt-20 clears the sticky
 * header when the page scrolls it into view. */
export function JurisdictionDrawer({
  jurisdiction,
  onClose,
  ref,
}: JurisdictionDrawerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {jurisdiction && (
        <motion.div
          key="jurisdiction-drawer"
          ref={ref}
          className="scroll-mt-20"
          initial={
            prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }
          }
          whileInView={{
            opacity: 1,
            y: 0,
            transition: ENTRANCE_TRANSITION,
          }}
          viewport={{ once: true, amount: 0.15, margin: "-56px 0px 0px 0px" }}
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: EXIT_TRANSITION }
              : { opacity: 0, y: -12, transition: EXIT_TRANSITION }
          }
        >
          <motion.div
            key={jurisdiction.id}
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <DrawerContent jurisdiction={jurisdiction} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DrawerContent({
  jurisdiction,
  onClose,
}: {
  jurisdiction: JurisdictionData;
  onClose: () => void;
}) {
  const { t } = useTranslation("jurisdiction");

  return (
    <div className="elevation-2 flex flex-col gap-6 rounded-2xl border border-primary/30 bg-card p-6 ring-1 ring-primary/20">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-mono text-lg font-black text-primary">
            {jurisdiction.code}
          </span>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">
                {jurisdiction.name}
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              {t(`zones.${jurisdiction.region}`)} •{" "}
              {jurisdiction.lastDataUpdate}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label={t("drawer.close")}
          className="shrink-0 rounded-full"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* BIS office coverage banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold text-primary uppercase">
              {t(`officeTypes.${jurisdiction.regionalOffice.type}`)}
            </span>
            <p className="mt-0.5 text-xs text-foreground/90">
              {jurisdiction.regionalOffice.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col sm:items-end">
          <span className="font-mono text-2xs text-muted-foreground uppercase">
            {t("drawer.coverageScore")}
          </span>
          <span className="font-mono text-2xl font-black text-primary">
            {jurisdiction.regionalOffice.coverageScore}%
          </span>
        </div>
      </div>

      {/* Framework / ecosystem grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Building2 className="size-4 text-primary" />
            <span>{t("drawer.framework")}</span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {jurisdiction.regulatoryFramework}
          </p>
          <div className="mt-auto pt-2 font-mono text-2xs text-primary/90">
            {t("drawer.authority")}: {jurisdiction.primaryAuthority}
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <BookOpen className="size-4 text-primary" />
            <span>{t("drawer.ecosystem")}</span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {jurisdiction.standardsEcosystem}
          </p>
          <div className="mt-auto pt-2 font-mono text-2xs text-muted-foreground">
            {t("drawer.hasDedicatedOffice")}:{" "}
            {jurisdiction.hasDedicatedOffice
              ? t("drawer.yesActive")
              : t("drawer.no")}
          </div>
        </div>
      </div>

      {/* Mandatory schemes */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Award className="size-4 text-primary" />
          <span>{t("drawer.schemes")}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {jurisdiction.schemes.map((scheme) => (
            <span
              key={scheme}
              className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground"
            >
              {scheme}
            </span>
          ))}
        </div>
      </div>

      {/* Recent updates */}
      {jurisdiction.recentUpdates.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Zap className="size-4 text-primary" />
            <span>{t("drawer.recentNotices")}</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {jurisdiction.recentUpdates.map((update) => (
              <div
                key={update.title}
                className="flex flex-col gap-1 rounded-xl border border-border bg-muted/20 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-foreground">
                    {update.title}
                  </span>
                  <span className="rounded-md bg-amber-500/10 px-2 py-0.2 font-mono text-2xs font-semibold text-amber-600 dark:text-amber-400">
                    {t("drawer.impactLabel", { impact: update.impact })}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {update.summary}
                </p>
                <span className="mt-1 font-mono text-2xs text-muted-foreground">
                  {t("drawer.dateLabel", { date: update.date })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sectors */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Layers className="size-4 text-primary" />
          <span>{t("drawer.affectedSectors")}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {jurisdiction.sectors.map((sector) => (
            <span
              key={sector}
              className="rounded-md border border-border bg-muted/20 px-2 py-0.5 font-mono text-xs text-muted-foreground"
            >
              {sector}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
