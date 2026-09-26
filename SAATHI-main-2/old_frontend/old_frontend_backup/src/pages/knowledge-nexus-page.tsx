import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Search } from "lucide-react";

import { Link } from "@/lib/router-compat";
import { AmbientBackground } from "@/components/ambient-background";
import { BrandMark } from "@/components/brand-mark";
import { NexusFeaturedFeed } from "@/components/nexus/nexus-featured-feed";
import { NexusWorkbench } from "@/components/nexus/nexus-workbench";

export function KnowledgeNexusPage() {
  const { t } = useTranslation("nexus");
  const workbenchRef = useRef<HTMLDivElement>(null);

  function scrollToWorkbench() {
    workbenchRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 w-full">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 border-b border-border px-4 pt-8 pb-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-3.5" />
              <span>{t("backToHome")}</span>
            </Link>
            <span className="text-border">/</span>
            <span className="font-mono text-xs font-bold tracking-wider text-primary uppercase">
              {t("title")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToWorkbench}
              className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Search className="size-3.5" />
              <span>{t("searchAndFilter")}</span>
            </button>
            <Link
              to="/chat"
              className="font-mono text-xs font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
            >
              {t("backToChat")}
            </Link>
          </div>
        </div>

        <NexusFeaturedFeed onSelectPost={() => scrollToWorkbench()} />

        <div
          ref={workbenchRef}
          className="mx-auto max-w-5xl border-t border-border px-4 py-12 sm:px-6"
        >
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-primary uppercase">
                <Search className="size-3.5" />
                <span>{t("workbench.eyebrow")}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {t("workbench.heading")}
              </h3>
            </div>
          </div>

          <NexusWorkbench />

          <div className="elevation-1 mt-8 flex items-start gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
            <BrandMark size="sm" />
            <span className="pt-0.5">{t("disclaimer")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
