import { ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { AmbientBackground } from "@/components/ambient-background";
import { JurisdictionDrawer } from "@/components/jurisdiction/jurisdiction-drawer";
import { JurisdictionFilterBar } from "@/components/jurisdiction/jurisdiction-filter-bar";
import { JurisdictionList } from "@/components/jurisdiction/jurisdiction-list";
import { JurisdictionMap } from "@/components/jurisdiction/jurisdiction-map";
import { JurisdictionStatsBar } from "@/components/jurisdiction/jurisdiction-stats-bar";
import {
  MOCK_JURISDICTIONS,
  type JurisdictionFilter,
} from "@/lib/mock-jurisdictions";

export function JurisdictionPage() {
  const { t } = useTranslation(["jurisdiction", "admin"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<JurisdictionFilter>("all");
  const [selectedJurisdictionId, setSelectedJurisdictionId] = useState<
    string | null
  >(null);

  const filterCounts = useMemo(() => {
    const counts: Record<JurisdictionFilter, number> = {
      all: MOCK_JURISDICTIONS.length,
      high_relevance: 0,
      active_changes: 0,
      bis_related: 0,
      international: 0,
    };

    for (const j of MOCK_JURISDICTIONS) {
      if (j.status === "high_relevance") counts.high_relevance += 1;
      if (j.status === "active_changes") counts.active_changes += 1;
      if (j.status === "bis_related") counts.bis_related += 1;
      if (j.wtoTbtNotified) counts.international += 1;
    }

    return counts;
  }, []);

  const filteredJurisdictions = useMemo(() => {
    let list = MOCK_JURISDICTIONS;

    if (activeFilter === "high_relevance") {
      list = list.filter((j) => j.status === "high_relevance");
    } else if (activeFilter === "active_changes") {
      list = list.filter((j) => j.status === "active_changes");
    } else if (activeFilter === "bis_related") {
      list = list.filter((j) => j.status === "bis_related" || j.id === "in");
    } else if (activeFilter === "international") {
      list = list.filter((j) => j.wtoTbtNotified);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (j) =>
          j.name.toLowerCase().includes(q) ||
          j.code.toLowerCase().includes(q) ||
          j.primaryAuthority.toLowerCase().includes(q) ||
          j.schemes.some((s) => s.toLowerCase().includes(q)) ||
          j.sectors.some((sec) => sec.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [searchQuery, activeFilter]);

  const selectedJurisdiction = useMemo(
    () =>
      MOCK_JURISDICTIONS.find((j) => j.id === selectedJurisdictionId) ?? null,
    [selectedJurisdictionId],
  );

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
        <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card/60 p-5 shadow-xs backdrop-blur-md sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="w-fit rounded-full bg-primary/10 px-3 py-0.5 font-mono text-xs font-semibold tracking-wide text-primary uppercase">
                {t("jurisdiction:eyebrow")}
              </span>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {t("jurisdiction:heading")}
              </h1>
              <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {t("jurisdiction:subheading")}
              </p>
            </div>
            <Link
              to="/chat"
              className="shrink-0 text-sm font-medium text-primary underline underline-offset-4"
            >
              {t("jurisdiction:backToChat")}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
          <ShieldAlert className="size-3.5 shrink-0 text-primary" />
          <p>{t("jurisdiction:disclaimer")}</p>
        </div>

        <JurisdictionStatsBar />

        <JurisdictionMap
          jurisdictions={filteredJurisdictions}
          selectedId={selectedJurisdictionId}
          onSelect={setSelectedJurisdictionId}
        />

        <JurisdictionFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          filterCounts={filterCounts}
        />

        {selectedJurisdiction && (
          <JurisdictionDrawer
            jurisdiction={selectedJurisdiction}
            onClose={() => setSelectedJurisdictionId(null)}
          />
        )}

        <JurisdictionList
          jurisdictions={filteredJurisdictions}
          selectedId={selectedJurisdictionId}
          onSelect={setSelectedJurisdictionId}
        />
      </div>
    </div>
  );
}
