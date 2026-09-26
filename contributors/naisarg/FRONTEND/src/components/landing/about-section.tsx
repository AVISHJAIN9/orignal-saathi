import {
  Award,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  MessageSquareQuote,
  Quote,
  SearchCheck,
  Trophy,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { ComplianceAssemblyScene } from "@/components/landing/compliance-assembly-scene";
import { Reveal } from "@/components/landing/reveal";
import { MOCK_STANDARDS } from "@/lib/mock-standards";

// Icon + i18n key per step — mirrors the teammate reference's
// HOW_IT_WORKS_STEPS shape, but titles/subtitles are resolved from this
// repo's own i18n namespace (about.howItWorks.steps.<key>) rather than
// inline English, matching how the rest of this file's content works.
const HOW_IT_WORKS_STEPS = [
  { key: "ask", icon: MessageSquareQuote },
  { key: "match", icon: SearchCheck },
  { key: "cite", icon: FileCheck2 },
] as const;

function AboutPillar({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Users;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex items-center gap-3.5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--plate-accent)]/18 shadow-xs sm:size-12">
          <Icon
            className="size-5 text-[var(--plate-accent-deep)] sm:size-6"
            aria-hidden
          />
        </div>
        <h3 className="font-mono text-sm font-extrabold tracking-[0.18em] text-[var(--plate-accent-deep)] uppercase sm:text-base lg:text-lg">
          {label}
        </h3>
      </div>
      <p className="text-lg leading-[1.65] font-medium text-[var(--plate-ink)] sm:text-xl lg:text-2xl">
        {children}
      </p>
    </div>
  );
}


function HowItWorksCard({
  step,
  index,
}: {
  step: (typeof HOW_IT_WORKS_STEPS)[number];
  index: number;
}) {
  const { t } = useTranslation("landing");
  const Icon = step.icon;

  return (
    <Reveal delay={0.1 * index} className="h-full">
      <div className="group flex h-full flex-col justify-between gap-5 rounded-2xl border border-[var(--plate-line)] bg-[var(--plate-ground)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--plate-accent-line)] hover:shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-[var(--plate-accent)]/12 px-2.5 py-0.5 font-mono text-xs font-bold text-[var(--plate-accent-deep)] transition-colors duration-300 group-hover:bg-[var(--plate-accent)]/20">
              {t(`about.howItWorks.steps.${step.key}.badge`)}
            </span>
            <div className="rounded-xl bg-[var(--plate-accent)]/12 p-2.5 text-[var(--plate-accent-deep)] transition-all duration-300 group-hover:scale-105 group-hover:bg-[var(--plate-accent)] group-hover:text-[var(--plate-on-accent)]">
              <Icon className="size-5" aria-hidden />
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-lg font-bold tracking-tight text-[var(--plate-ink)]">
              {t(`about.howItWorks.steps.${step.key}.title`)}
            </h4>
            <p className="text-xs leading-relaxed text-[var(--plate-muted)]">
              {t(`about.howItWorks.steps.${step.key}.subtitle`)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 border-t border-[var(--plate-line)] pt-3 font-mono text-[0.7rem] text-[var(--plate-muted)] transition-colors duration-300 group-hover:text-[var(--plate-ink)]">
          <CheckCircle2
            className="size-3.5 text-emerald-600 transition-transform duration-300 group-hover:scale-110 dark:text-emerald-400"
            aria-hidden
          />
          <span className="font-medium">{t("about.howItWorks.footer")}</span>
        </div>
      </div>
    </Reveal>
  );
}

function HowItWorksSection() {
  const { t } = useTranslation("landing");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-bold tracking-tight text-[var(--plate-ink)] sm:text-2xl">
          {t("about.howItWorks.heading")}
        </h3>
        <span className="font-mono text-xs font-semibold tracking-wider text-[var(--plate-accent-deep)] uppercase">
          {t("about.howItWorks.kicker")}
        </span>
      </div>
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <HowItWorksCard key={step.key} step={step} index={index} />
        ))}
      </div>
    </div>
  );
}

function CoreRuleCallout() {
  const { t } = useTranslation("landing");

  return (
    <Reveal delay={0.1}>
      <div className="relative overflow-hidden rounded-2xl border-2 border-[var(--plate-accent)]/30 bg-gradient-to-r from-[var(--plate-accent)]/10 via-[var(--plate-accent)]/5 to-[var(--plate-ground)] p-8 sm:p-10">
        <Quote
          className="pointer-events-none absolute -top-3 -right-3 size-24 text-[var(--plate-accent)]/10"
          aria-hidden
        />
        <div className="relative z-10 flex flex-col gap-4">
          <span className="font-mono text-xs font-bold tracking-widest text-[var(--plate-accent-deep)] uppercase">
            {t("about.coreRule.kicker")}
          </span>
          <blockquote className="font-serif text-lg leading-relaxed text-[var(--plate-ink)] italic sm:text-xl">
            "{t("about.coreRule.quote")}"
          </blockquote>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--plate-accent)]/20 pt-2">
            <span className="font-mono text-xs font-semibold text-[var(--plate-accent-deep)]">
              {t("about.coreRule.attribution")}
            </span>
            <span className="text-xs text-[var(--plate-muted)]">
              {t("about.coreRule.context")}
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// Sourced from the real MOCK_STANDARDS catalogue (the same 6 standards
// StatsSection counts a few sections above this one) — NOT the teammate
// reference's STANDARDS_COVERED list, which names 10 standards this repo
// has no seeded data for at all. Displaying those would both fabricate
// coverage this app doesn't have and directly contradict StatsSection's
// own "0 standards invented" claim right above it.
function StandardsCoveredSection() {
  const { t } = useTranslation(["landing", "admin", "standards"]);

  return (
    <Reveal delay={0.15}>
      <div className="flex flex-col gap-5 rounded-2xl border border-[var(--plate-line)] bg-[var(--plate-ground)] p-6 sm:p-8">
        <div className="flex flex-col gap-3 border-b border-[var(--plate-line)] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Award
              className="size-5 text-[var(--plate-accent-deep)]"
              aria-hidden
            />
            <div>
              <h3 className="text-base font-bold text-[var(--plate-ink)] sm:text-lg">
                {t("landing:about.standardsCovered.heading")}
              </h3>
              <p className="text-xs text-[var(--plate-muted)]">
                {t("landing:about.standardsCovered.body")}
              </p>
            </div>
          </div>
          <span className="w-fit rounded-full bg-[var(--plate-accent)]/12 px-3 py-1 font-mono text-xs font-bold text-[var(--plate-accent-deep)]">
            {t("landing:about.standardsCovered.count", {
              count: MOCK_STANDARDS.length,
            })}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_STANDARDS.map((standard) => (
            <div
              key={standard.key}
              className="flex flex-col rounded-xl border border-[var(--plate-line)] bg-[var(--plate-surface)] p-3"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-[var(--plate-accent-deep)]">
                  {standard.standardNumber}
                </span>
                <span className="rounded border border-[var(--plate-line)] bg-[var(--plate-ground)] px-1.5 py-0.5 font-mono text-[0.65rem] text-[var(--plate-muted)]">
                  {t(`admin:topics.${standard.categoryKey}`)}
                </span>
              </div>
              <span className="text-xs font-medium text-[var(--plate-ink)]">
                {t(`standards:list.${standard.key}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export function AboutSection() {
  const { t } = useTranslation("landing");

  return (
    <section
      id="about"
      className="bg-[var(--plate-surface)] px-6 py-20 sm:px-10 sm:py-28"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:gap-10">
        <Reveal className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center rounded-full border border-[var(--plate-line)] px-3.5 py-1.5 font-mono text-xs font-medium tracking-wide text-[var(--plate-muted)] uppercase">
            {t("about.eyebrow")}
          </span>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-[var(--plate-ink)] sm:text-4xl">
            {t("about.heading")}
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="max-w-3xl text-base leading-relaxed text-[var(--plate-muted)] sm:text-lg">
            {t("about.body")}
          </p>
        </Reveal>

        <ComplianceAssemblyScene />

        <HowItWorksSection />

        <CoreRuleCallout />

        <StandardsCoveredSection />

        <Reveal delay={0.16}>
          <div className="grid grid-cols-1 gap-10 border-t border-[var(--plate-line)] pt-14 sm:grid-cols-3 sm:gap-12 lg:gap-16">
            <AboutPillar
              icon={Trophy}
              label={t("about.pillars.hackathon.label")}
            >
              {t("about.pillars.hackathon.body")}
            </AboutPillar>
            <AboutPillar
              icon={GraduationCap}
              label={t("about.pillars.mission.label")}
            >
              {t("about.pillars.mission.body")}
            </AboutPillar>
            <AboutPillar icon={Users} label={t("about.pillars.team.label")}>
              {t("about.pillars.team.body")}
            </AboutPillar>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
