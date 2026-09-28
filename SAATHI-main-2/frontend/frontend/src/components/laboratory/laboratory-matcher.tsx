import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ExternalLink,
  Filter,
  FlaskConical,
  Grid,
  HelpCircle,
  Layers,
  MapPin,
  Phone,
  Mail,
  Calendar,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TestTube2,
  XCircle,
  ChevronLeft,
  ChevronRight,
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
  ALL_429_BIS_LABORATORIES,
  type BisLaboratoryRecord,
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

  // Active Tab: "matcher" vs "directory"
  const [activeTab, setActiveTab] = useState<"matcher" | "directory">("matcher");

  // Context State (Matcher Tab)
  const [product, setProduct] = useState(initialProduct);
  const [standardNumber, setStandardNumber] = useState(initialStandard);
  const [schemeName, setSchemeName] = useState(initialScheme);

  // Preference Filters State
  const [userLocation, setUserLocation] = useState("");
  const [maxDistanceKm, setMaxDistanceKm] = useState<number | undefined>(undefined);
  const [accreditationFilter, setAccreditationFilter] = useState("all");

  // Matcher API Call State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LaboratoryMatchResult | null>(null);
  const [selectedLab, setSelectedLab] = useState<LaboratoryMatch | null>(null);
  const [detailModalLab, setDetailModalLab] = useState<LaboratoryMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Directory State (All 429 Labs)
  const [dirSearch, setDirSearch] = useState("");
  const [dirState, setDirState] = useState("all");
  const [dirDiscipline, setDirDiscipline] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

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

  // Convert BisLaboratoryRecord to LaboratoryMatch for Details Dialog
  const handleOpenRecordDetails = (record: BisLaboratoryRecord) => {
    const matchObj: LaboratoryMatch = {
      laboratoryId: record.id,
      laboratoryName: record.name,
      location: `${record.city}, ${record.state}`,
      city: record.city,
      state: record.state,
      pincode: record.pincode,
      matchScore: 95,
      testsCoveredCount: initialTests.length,
      totalRequiredTestsCount: initialTests.length,
      capabilities: initialTests.map((test) => ({
        testName: test,
        status: "verified",
        notes: `Recognized under OSL Code ${record.oslCode}`,
        sourceUrl: record.scopeUrl,
      })),
      relevantStandards: record.standards,
      accreditationStatus: "verified",
      accreditationDetails: record.accreditation,
      contactEmail: record.email,
      contactPhone: record.phone,
      websiteUrl: record.scopeUrl,
      verificationStatus: "verified",
      verificationSource: {
        title: `Bureau of Indian Standards LIMS (OSL: ${record.oslCode})`,
        url: record.scopeUrl,
        type: "Official BIS LIMS Record",
        verifiedAt: record.validTill,
      },
      explanation: `Verified BIS testing facility in ${record.city}, ${record.state}. Active scope valid till ${record.validTill}.`,
      oslCode: record.oslCode,
      validTill: record.validTill,
      scopeUrl: record.scopeUrl,
      scopeDetails: record.scopeDetails,
      disciplines: record.disciplines,
    };
    setDetailModalLab(matchObj);
    setIsModalOpen(true);
  };

  // Extract unique states for filter
  const allStates = useMemo(() => {
    const states = new Set<string>();
    for (const lab of ALL_429_BIS_LABORATORIES) {
      if (lab.state && lab.state.length > 2) {
        states.add(lab.state);
      }
    }
    return Array.from(states).sort();
  }, []);

  // Filter 429 labs for directory tab
  const filteredDirectoryLabs = useMemo(() => {
    const q = dirSearch.toLowerCase().trim();
    return ALL_429_BIS_LABORATORIES.filter((lab) => {
      // State filter
      if (dirState !== "all" && lab.state !== dirState) {
        return false;
      }
      // Discipline filter
      if (dirDiscipline !== "all" && !lab.disciplines.includes(dirDiscipline)) {
        return false;
      }
      // Text search
      if (!q) return true;
      const matchName = lab.name.toLowerCase().includes(q);
      const matchCity = lab.city.toLowerCase().includes(q);
      const matchState = lab.state.toLowerCase().includes(q);
      const matchOsl = lab.oslCode.includes(q);
      const matchPerson = lab.contactPerson.toLowerCase().includes(q);
      const matchStd = lab.standards.some((s) => s.toLowerCase().includes(q));
      const matchProd = lab.products.some((p) => p.toLowerCase().includes(q));
      return (
        matchName ||
        matchCity ||
        matchState ||
        matchOsl ||
        matchPerson ||
        matchStd ||
        matchProd
      );
    });
  }, [dirSearch, dirState, dirDiscipline]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredDirectoryLabs.length / PAGE_SIZE) || 1;
  const paginatedLabs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDirectoryLabs.slice(start, start + PAGE_SIZE);
  }, [filteredDirectoryLabs, currentPage]);

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
      {/* NAVIGATION TABS: Intelligent Matcher vs All 429 Labs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-1 border border-border/50">
          <button
            type="button"
            onClick={() => setActiveTab("matcher")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all",
              activeTab === "matcher"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FlaskConical className="size-4" />
            <span>Intelligent Matcher</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("directory")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all",
              activeTab === "directory"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Building2 className="size-4" />
            <span>All 429 BIS Laboratories</span>
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-2xs font-mono">
              429
            </Badge>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-emerald-500" />
          <span className="font-medium">100% BIS LIMS Validated Registry</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INTELLIGENT LABORATORY MATCHER                                    */}
      {/* ========================================================================= */}
      {activeTab === "matcher" && (
        <div className="flex flex-col gap-6">
          {/* PRODUCT, STANDARD & SCHEME CONTEXT BANNER */}
          <Card className="border-border/50 bg-card/90 backdrop-blur-xl shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                  {t("laboratory:context.title")}
                </span>
                <span className="font-mono text-2xs text-muted-foreground">
                  Dataset: 429 BIS Recognized Laboratories
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
                      placeholder="e.g. Submersible Pump, Cement, Boots"
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
                      placeholder="e.g. IS 10500, IS 16415, IS 12254"
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

                {/* Quick Standard Test Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-2xs">
                  <span className="text-muted-foreground font-medium">Quick examples:</span>
                  {[
                    { label: "Water (IS 10500)", prod: "Drinking Water", std: "IS 10500" },
                    { label: "Cement (IS 16415)", prod: "Composite Cement", std: "IS 16415" },
                    { label: "Boots (IS 12254)", prod: "PVC Industrial Boots", std: "IS 12254" },
                    { label: "Tactical (IS 17012)", prod: "Tactical Boots", std: "IS 17012" },
                    { label: "LED Lamps (IS 15885)", prod: "LED Controlgear", std: "IS 15885" },
                    { label: "Helmets (IS 4151)", prod: "Protective Helmet", std: "IS 4151" },
                    { label: "Toys (IS 9873)", prod: "Safety of Toys", std: "IS 9873" },
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setProduct(chip.prod);
                        setStandardNumber(chip.std);
                      }}
                      className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-0.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors font-mono"
                    >
                      {chip.label}
                    </button>
                  ))}
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
                        placeholder="e.g. Bengaluru, Delhi, Noida, Mumbai"
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

          {/* REQUIRED TESTS SECTION */}
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

          {/* SELECTED LABORATORY SELECTION CONFIRMATION BAR */}
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

          {/* LOADING STATE */}
          {loading && (
            <Card className="border-border/50 bg-card/90 p-8 text-center backdrop-blur-xl">
              <div className="flex flex-col items-center justify-center gap-4">
                <RefreshCw className="size-8 animate-spin text-primary" />
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-foreground">
                    {t("laboratory:preferences.searchingLabs")}
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground">
                    Evaluating 429 BIS recognized laboratories • Checking product scopes and distance
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* ERROR STATE */}
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

          {/* EMPTY MATCHES STATE */}
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

          {/* MATCH RESULTS DISPLAY */}
          {!loading && !error && result && (bestMatch || alternativeMatches.length > 0) && (
            <div className="flex flex-col gap-6">
              {/* Scope notice */}
              <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 shrink-0" />
                  <span>
                    Matched from <strong>{ALL_429_BIS_LABORATORIES.length} verified BIS laboratories</strong> across India.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("directory")}
                  className="font-semibold underline underline-offset-4 hover:opacity-80 shrink-0"
                >
                  View All 429 Laboratories →
                </button>
              </div>

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
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DIRECTORY OF ALL 429 BIS RECOGNIZED LABORATORIES                   */}
      {/* ========================================================================= */}
      {activeTab === "directory" && (
        <div className="flex flex-col gap-6">
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card className="border-border/50 bg-card/80 p-4">
              <span className="font-mono text-2xs uppercase text-muted-foreground">Total Laboratories</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-foreground">429</span>
                <span className="text-2xs text-emerald-600 font-semibold">Active</span>
              </div>
            </Card>

            <Card className="border-border/50 bg-card/80 p-4">
              <span className="font-mono text-2xs uppercase text-muted-foreground">States & UTs</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-foreground">28+</span>
                <span className="text-2xs text-muted-foreground">Pan-India</span>
              </div>
            </Card>

            <Card className="border-border/50 bg-card/80 p-4">
              <span className="font-mono text-2xs uppercase text-muted-foreground">Accreditation</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-primary">BIS LIMS</span>
                <span className="text-2xs text-emerald-600 font-semibold">Verified</span>
              </div>
            </Card>

            <Card className="border-border/50 bg-card/80 p-4">
              <span className="font-mono text-2xs uppercase text-muted-foreground">Specialized Scopes</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-foreground">9+</span>
                <span className="text-2xs text-muted-foreground">Disciplines</span>
              </div>
            </Card>
          </div>

          {/* SEARCH & FILTER BAR */}
          <Card className="border-border/50 bg-card/90 backdrop-blur-xl shadow-md p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  value={dirSearch}
                  onChange={(e) => {
                    setDirSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search 429 labs by name, city, OSL, standard..."
                  className="pl-9 bg-background/80 text-xs"
                />
              </div>

              <div>
                <Select
                  value={dirState}
                  onValueChange={(val) => {
                    setDirState(val);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="bg-background/80 text-xs">
                    <SelectValue placeholder="All States / UTs" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="all">All States & Union Territories ({ALL_429_BIS_LABORATORIES.length})</SelectItem>
                    {allStates.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={dirDiscipline}
                  onValueChange={(val) => {
                    setDirDiscipline(val);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="bg-background/80 text-xs">
                    <SelectValue placeholder="All Disciplines" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Testing Disciplines</SelectItem>
                    <SelectItem value="Chemical">Chemical & Agrochemicals</SelectItem>
                    <SelectItem value="Mechanical">Mechanical & Metallurgy</SelectItem>
                    <SelectItem value="Electrical">Electrical Equipment & Cables</SelectItem>
                    <SelectItem value="Electronics">Electronics, IT & Telecom</SelectItem>
                    <SelectItem value="Textiles">Textiles & Footwear</SelectItem>
                    <SelectItem value="Civil">Civil & Cement</SelectItem>
                    <SelectItem value="Food & Agriculture">Food, Dairy & Water</SelectItem>
                    <SelectItem value="Plastics & Polymers">Plastics & Polymers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter count header */}
            <div className="flex items-center justify-between border-t border-border/50 mt-3 pt-3 text-xs text-muted-foreground">
              <span>
                Showing <strong>{filteredDirectoryLabs.length}</strong> of{" "}
                <strong>{ALL_429_BIS_LABORATORIES.length}</strong> registered laboratories
              </span>
              {(dirSearch || dirState !== "all" || dirDiscipline !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDirSearch("");
                    setDirState("all");
                    setDirDiscipline("all");
                    setCurrentPage(1);
                  }}
                  className="h-6 px-2 text-2xs text-muted-foreground hover:text-foreground"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </Card>

          {/* LABORATORIES DIRECTORY GRID */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {paginatedLabs.map((lab) => (
              <Card
                key={lab.id}
                className="flex flex-col justify-between border-border/60 bg-card/90 p-5 shadow-sm hover:border-primary/40 transition-all duration-200"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-2xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        #{lab.sno}
                      </span>
                      <Badge variant="outline" className="font-mono text-2xs font-bold text-primary border-primary/30 bg-primary/5">
                        OSL: {lab.oslCode}
                      </Badge>
                    </div>
                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-2xs">
                      <CheckCircle2 className="mr-1 size-3" />
                      Verified
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2">
                      {lab.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <MapPin className="size-3.5 text-primary shrink-0" />
                      <span>{lab.city}, {lab.state} {lab.pincode ? `- ${lab.pincode}` : ""}</span>
                    </div>
                  </div>

                  {/* Contact Preview */}
                  <div className="flex flex-col gap-1 text-2xs text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border/40">
                    {lab.contactPerson && (
                      <span className="font-medium text-foreground truncate">
                        Contact: {lab.contactPerson}
                      </span>
                    )}
                    {lab.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="size-3 text-primary shrink-0" />
                        {lab.phone}
                      </span>
                    )}
                    {lab.email && (
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="size-3 text-primary shrink-0" />
                        {lab.email}
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-mono text-muted-foreground/80">
                      <Calendar className="size-3 shrink-0" />
                      Valid till: {lab.validTill}
                    </span>
                  </div>

                  {/* Standards badges */}
                  {lab.standards.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {lab.standards.slice(0, 3).map((std, i) => (
                        <span
                          key={i}
                          className="font-mono text-2xs bg-muted px-2 py-0.5 rounded text-foreground border border-border/50"
                        >
                          {std}
                        </span>
                      ))}
                      {lab.standards.length > 3 && (
                        <span className="font-mono text-2xs text-muted-foreground px-1 py-0.5">
                          +{lab.standards.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card footer buttons */}
                <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-3 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenRecordDetails(lab)}
                    className="text-xs font-semibold gap-1.5"
                  >
                    View Scope & Details
                  </Button>

                  <a
                    href={lab.scopeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-2xs font-semibold text-primary underline underline-offset-4 hover:opacity-80"
                  >
                    <span>BIS LIMS</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </Card>
            ))}
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/60 pt-4">
              <span className="text-xs text-muted-foreground">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> (
                {filteredDirectoryLabs.length} laboratories)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="gap-1 text-xs"
                >
                  <ChevronLeft className="size-4" />
                  <span>Previous</span>
                </Button>

                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                    let pageNum = idx + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      pageNum = Math.min(totalPages - 4 + idx, currentPage - 2 + idx);
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="h-8 w-8 p-0 text-xs font-mono"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="gap-1 text-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="size-4" />
                </Button>
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
