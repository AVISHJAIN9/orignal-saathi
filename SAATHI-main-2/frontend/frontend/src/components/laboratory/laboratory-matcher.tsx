import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Filter,
  FlaskConical,
  HelpCircle,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TestTube2,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@/lib/router-compat";
import {
  laboratoryApi,
  LaboratoryApiError,
  type LaboratoryMatch,
  type LaboratoryMatchResult,
} from "@/lib/laboratory-api";
import { LaboratoryCard } from "@/components/laboratory/laboratory-card";
import { LaboratoryDetailsDialog } from "@/components/laboratory/laboratory-details-dialog";
import { cn } from "@/lib/utils";

interface LaboratoryMatcherProps {
  initialProduct?: string;
  initialStandard?: string;
  initialScheme?: string;
  initialTests?: string[];
}

export function LaboratoryMatcher({
  initialProduct = "Submersible Water Pump",
  initialStandard = "IS 10500",
  initialScheme = "Scheme I (ISI Mark)",
  initialTests = [
    "Physico-Chemical Analysis (pH, TDS, Turbidity)",
    "Toxic Metals & Pesticide Residue Analysis",
    "Microbiological Quality & Pathogen Screen",
    "Pressure & Mechanical Stress Evaluation",
  ],
}: LaboratoryMatcherProps) {
  const { t } = useTranslation(["laboratory", "admin"]);

  // Context State
  const [product, setProduct] = useState(initialProduct);
  const [standardNumber, setStandardNumber] = useState(initialStandard);
  const [schemeName, setSchemeName] = useState(initialScheme);

  // Preference Filters State
  const [userLocation, setUserLocation] = useState("");
  const [maxDistanceKm, setMaxDistanceKm] = useState<number | undefined>(undefined);
  const [accreditationFilter, setAccreditationFilter] = useState("all");

  // API Call State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LaboratoryMatchResult | null>(null);
  const [selectedLab, setSelectedLab] = useState<LaboratoryMatch | null>(null);
  const [detailModalLab, setDetailModalLab] = useState<LaboratoryMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const performMatching = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiResult = await laboratoryApi.matchLaboratories({
        productName: product,
        standardNumber,
        schemeName,
        requiredTests: initialTests,
        userLocation: userLocation.trim() || undefined,
        maxDistanceKm,
        accreditationFilter: accreditationFilter === "verified" ? "verified" : undefined,
      });
      setResult(apiResult);
    } catch (err) {
      if (err instanceof LaboratoryApiError) {
        setError(err.message);
      } else {
        setError(t("laboratory:states.errorMsg"));
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void performMatching();
  }, [initialProduct, initialStandard, initialScheme]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void performMatching();
  };

  const handleOpenDetails = (lab: LaboratoryMatch) => {
    setDetailModalLab(lab);
    setIsModalOpen(true);
  };

  const handleSelectLab = (lab: LaboratoryMatch) => {
    setSelectedLab(lab);
  };

  const requiredTests = result?.requiredTests || initialTests;
  const bestMatch = result?.bestMatch;
  const alternativeMatches = result?.alternativeMatches || [];
  const hasNoMatches = result && !bestMatch && alternativeMatches.length === 0;
  const hasPartialCoverageOnly =
    bestMatch &&
    bestMatch.testsCoveredCount < bestMatch.totalRequiredTestsCount &&
    bestMatch.totalRequiredTestsCount > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* 1. PRODUCT, STANDARD & SCHEME CONTEXT BANNER */}
      <Card className="border-border/50 bg-card/90 backdrop-blur-xl shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              {t("laboratory:context.title")}
            </span>
          </div>
          <CardTitle className="text-xl font-bold">{t("laboratory:title")}</CardTitle>
          <CardDescription>{t("laboratory:subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="product" className="text-xs font-semibold text-muted-foreground">
                  {t("laboratory:context.product")}
                </Label>
                <Input
                  id="product"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g. Submersible Pump, Mobile Charger"
                  className="bg-background/80"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="standard" className="text-xs font-semibold text-muted-foreground">
                  {t("laboratory:context.standard")}
                </Label>
                <Input
                  id="standard"
                  value={standardNumber}
                  onChange={(e) => setStandardNumber(e.target.value)}
                  placeholder="e.g. IS 10500, IS 13252"
                  className="bg-background/80 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="scheme" className="text-xs font-semibold text-muted-foreground">
                  {t("laboratory:context.scheme")}
                </Label>
                <Input
                  id="scheme"
                  value={schemeName}
                  onChange={(e) => setSchemeName(e.target.value)}
                  placeholder="e.g. Scheme I (ISI Mark)"
                  className="bg-background/80"
                />
              </div>
            </div>

            {/* PREFERENCES & FILTERS ROW */}
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-border/60 bg-muted/30 p-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="location" className="text-xs font-semibold text-muted-foreground">
                  {t("laboratory:preferences.locationLabel")}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    placeholder={t("laboratory:preferences.locationPlaceholder")}
                    className="pl-9 bg-background/80 text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="distance" className="text-xs font-semibold text-muted-foreground">
                  {t("laboratory:preferences.distanceLabel")}
                </Label>
                <Select
                  value={maxDistanceKm ? String(maxDistanceKm) : "any"}
                  onValueChange={(val) =>
                    setMaxDistanceKm(val === "any" ? undefined : Number(val))
                  }
                >
                  <SelectTrigger id="distance" className="bg-background/80 text-xs">
                    <SelectValue placeholder={t("laboratory:preferences.distanceAny")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">{t("laboratory:preferences.distanceAny")}</SelectItem>
                    <SelectItem value="50">{t("laboratory:preferences.distance50")}</SelectItem>
                    <SelectItem value="100">{t("laboratory:preferences.distance100")}</SelectItem>
                    <SelectItem value="250">{t("laboratory:preferences.distance250")}</SelectItem>
                    <SelectItem value="500">{t("laboratory:preferences.distance500")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="accreditation" className="text-xs font-semibold text-muted-foreground">
                  {t("laboratory:preferences.accreditationLabel")}
                </Label>
                <Select value={accreditationFilter} onValueChange={setAccreditationFilter}>
                  <SelectTrigger id="accreditation" className="bg-background/80 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("laboratory:preferences.accreditationAll")}</SelectItem>
                    <SelectItem value="verified">
                      {t("laboratory:preferences.accreditationVerified")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    {t("laboratory:preferences.searchingLabs")}
                  </>
                ) : (
                  <>
                    <FlaskConical className="size-4" />
                    {t("laboratory:preferences.findLabsButton")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2. REQUIRED TESTS SECTION */}
      <Card className="border-border/50 bg-card/90 backdrop-blur-xl shadow-md">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TestTube2 className="size-4 text-primary" />
              <CardTitle className="text-sm font-bold tracking-tight">
                {t("laboratory:requiredTests.title")}
              </CardTitle>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {t("laboratory:requiredTests.mandatoryCount", { count: requiredTests.length })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {requiredTests.map((test, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-xs font-medium text-foreground"
              >
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>{test}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. SELECTED LABORATORY SELECTION CONFIRMATION BAR */}
      {selectedLab && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-6 text-emerald-500 shrink-0" />
            <div className="flex flex-col">
              <span className="font-mono text-2xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {t("laboratory:results.labSelected")}
              </span>
              <span className="text-sm font-bold text-foreground">
                {selectedLab.laboratoryName} ({selectedLab.location})
              </span>
            </div>
          </div>

          <Link
            to="/compliance-chain"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 underline underline-offset-4 hover:text-emerald-700"
          >
            <span>Return to Compliance Chain</span>
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      )}

      {/* 4. LOADING STATE */}
      {loading && (
        <Card className="border-border/50 bg-card/90 p-8 text-center backdrop-blur-xl">
          <div className="flex flex-col items-center justify-center gap-4">
            <RefreshCw className="size-8 animate-spin text-primary" />
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-foreground">
                {t("laboratory:preferences.searchingLabs")}
              </h3>
              <p className="font-mono text-xs text-muted-foreground">
                Checking required test capabilities • Comparing verified BIS laboratory records
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 5. ERROR STATE */}
      {error && !loading && (
        <Card className="border-red-500/30 bg-red-500/5 p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="size-8 text-red-500" />
            <h3 className="text-base font-bold text-foreground">
              {t("laboratory:states.errorTitle")}
            </h3>
            <p className="max-w-md text-xs text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void performMatching()} className="gap-2 mt-2">
              <RefreshCw className="size-3.5" />
              {t("laboratory:states.retry")}
            </Button>
          </div>
        </Card>
      )}

      {/* 6. EMPTY MATCHES STATE */}
      {hasNoMatches && !loading && !error && (
        <Card className="border-amber-500/30 bg-amber-500/5 p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <AlertTriangle className="size-8 text-amber-600" />
            <h3 className="text-base font-bold text-foreground">
              {t("laboratory:states.noMatchesTitle")}
            </h3>
            <p className="max-w-md text-xs text-muted-foreground">
              {t("laboratory:states.noMatchesMsg")}
            </p>
          </div>
        </Card>
      )}

      {/* 7. MATCH RESULTS DISPLAY */}
      {!loading && !error && result && (bestMatch || alternativeMatches.length > 0) && (
        <div className="flex flex-col gap-6">
          {/* Partial coverage notice if applicable */}
          {hasPartialCoverageOnly && (
            <div className="flex items-center gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="size-5 text-amber-600 shrink-0" />
              <span>{t("laboratory:states.partialMatchesNotice")}</span>
            </div>
          )}

          {/* BEST MATCH SECTION */}
          {bestMatch && (
            <div className="flex flex-col gap-3">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                {t("laboratory:results.bestMatchHeading")}
              </h2>
              <LaboratoryCard
                laboratory={bestMatch}
                isBestMatch={true}
                onViewDetails={handleOpenDetails}
                onSelect={handleSelectLab}
                isSelected={selectedLab?.laboratoryId === bestMatch.laboratoryId}
              />
            </div>
          )}

          {/* ALTERNATIVE MATCHES SECTION */}
          {alternativeMatches.length > 0 && (
            <div className="flex flex-col gap-4 pt-2">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("laboratory:results.otherMatchesHeading")} ({alternativeMatches.length})
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {alternativeMatches.map((lab) => (
                  <LaboratoryCard
                    key={lab.laboratoryId}
                    laboratory={lab}
                    isBestMatch={false}
                    onViewDetails={handleOpenDetails}
                    onSelect={handleSelectLab}
                    isSelected={selectedLab?.laboratoryId === lab.laboratoryId}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LABORATORY DETAILS DIALOG */}
      <LaboratoryDetailsDialog
        laboratory={detailModalLab}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSelect={handleSelectLab}
        isSelected={detailModalLab?.laboratoryId === selectedLab?.laboratoryId}
      />
    </div>
  );
}
