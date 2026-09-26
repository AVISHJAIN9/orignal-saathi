import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Building2,
  MapPin,
  Award,
  ClipboardCheck,
  ShieldCheck,
  RefreshCw,
  Search,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationCard } from "./location-card";
import { LocationDetailsDialog } from "./location-details-dialog";
import { locationsApi, plantEvents, type LocationsResult } from "@/lib/locations-api";
import type { ManufacturingPlant } from "@/lib/demo/s26-demo-data";

export function LocationsView() {
  const { t } = useTranslation(["locations"]);
  const [data, setData] = useState<LocationsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePlantId, setActivePlantId] = useState(locationsApi.getActivePlantId());
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedPlant, setSelectedPlant] = useState<ManufacturingPlant | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchPlants = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await locationsApi.getPlants();
      setData(res);
      setActivePlantId(locationsApi.getActivePlantId());
    } catch (err) {
      console.error("Failed to load locations:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlants();
    const unsubscribe = plantEvents.subscribe((id) => {
      setActivePlantId(id);
    });
    return unsubscribe;
  }, [fetchPlants]);

  const handleSetActive = (plantId: string) => {
    locationsApi.setActivePlantId(plantId);
    setActivePlantId(plantId);
  };

  const handleViewDetails = (plant: ManufacturingPlant) => {
    setSelectedPlant(plant);
    setDetailsOpen(true);
  };

  const filteredPlants = (data?.plants || []).filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.address.city.toLowerCase().includes(q) ||
      p.address.state.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Building2 className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("locations:metrics.totalPlants")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {data.summary.totalPlants} Units
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Award className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("locations:metrics.activeLicenses")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {data.summary.totalActiveLicenses} Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <ClipboardCheck className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("locations:metrics.scheduledAudits")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {data.summary.totalScheduledAudits}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-xs">
            <div className="size-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider block">
                {t("locations:metrics.avgCompliance")}
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {data.summary.avgComplianceScore}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Location Switcher Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1">
          <span className="text-xs font-semibold text-muted-foreground shrink-0">
            {t("locations:switcher.label")}:
          </span>
          <Select
            value={activePlantId}
            onValueChange={(val) => handleSetActive(val)}
          >
            <SelectTrigger className="text-xs h-9 rounded-lg max-w-sm">
              <SelectValue placeholder="Select active plant scope" />
            </SelectTrigger>
            <SelectContent>
              {(data?.plants || []).map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} ({p.address.city}, {p.address.state})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter manufacturing units..."
            className="pl-8 text-xs h-9 rounded-lg"
          />
        </div>
      </div>

      {/* Location Scope Disclaimer */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <span>{t("locations:switcher.switchNotice")}</span>
      </div>

      {/* Grid of Location Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-44 w-full rounded-xl" />
        </div>
      ) : filteredPlants.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
          <Building2 className="size-8 text-muted-foreground mx-auto mb-2" />
          <h4 className="font-bold text-foreground">No manufacturing units found</h4>
          <p className="text-xs text-muted-foreground mt-1">Try clearing your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlants.map((plant) => (
            <LocationCard
              key={plant.id}
              plant={plant}
              isActive={plant.id === activePlantId}
              onSetActive={handleSetActive}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Location Details Dialog */}
      <LocationDetailsDialog
        plant={selectedPlant}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        isActive={selectedPlant?.id === activePlantId}
        onSetActive={handleSetActive}
      />
    </div>
  );
}
