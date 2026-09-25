import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileCheck,
  FileText,
  Filter,
  FlaskConical,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TestTube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "@/lib/router-compat";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { schemeApi, type QCOStatus, type SchemeSelectorResult } from "@/lib/scheme-api";
import { cn } from "@/lib/utils";

interface SchemeSelectorProps {
  initialProduct?: string;
  initialStandard?: string;
  initialQco?: QCOStatus;
}

export function SchemeSelector({
  initialProduct = "Submersible Water Pump",
  initialStandard = "IS 10500",
  initialQco = "applicable",
}: SchemeSelectorProps) {
  const { t } = useTranslation(["scheme", "admin"]);
  const navigate = useNavigate();

  const [product, setProduct] = useState(initialProduct);
  const [standardNumber, setStandardNumber] = useState(initialStandard);
  const [qcoStatus, setQcoStatus] = useState<QCOStatus>(initialQco);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SchemeSelectorResult | null>(null);

  const fetchScheme = async (prod: string, std: string, qco: QCOStatus) => {
    setLoading(true);
    setError(null);
    try {
      const res = await schemeApi.getSchemeForProductAndStandard(prod, std, qco);
      setResult(res);
    } catch {
      setError(t("scheme:states.error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchScheme(initialProduct, initialStandard, initialQco);
  }, [initialProduct, initialStandard, initialQco]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void fetchScheme(product, standardNumber, qcoStatus);
  };

  const recommended = result?.recommendedScheme;

  return (
    <div className="flex flex-col gap-6">
      {/* Product & Standard Context Search Form */}
      <Card className="border-border/50 bg-card/90 backdrop-blur-xl shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              {t("scheme:productContext")}
            </span>
          </div>
          <CardTitle className="text-xl font-bold">{t("scheme:title")}</CardTitle>
          <CardDescription>{t("scheme:subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="product">{t("scheme:productLabel")}</Label>
              <Input
                id="product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g. Mobile Charger, Water Pump"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="standard">{t("scheme:standardLabel")}</Label>
              <Input
                id="standard"
                value={standardNumber}
                onChange={(e) => setStandardNumber(e.target.value)}
                placeholder="e.g. IS 10500, IS 302, IS 4151"
              />
            </div>

            <div className="flex items-end">
              <Button type="submit" disabled={loading} className="w-full gap-2">
                {loading ? <RefreshCw className="size-4 animate-spin" /> : <Search className="size-4" />}
                {t("scheme:findSchemeBtn")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loading Skeleton */}
      {loading && (
        <Card className="border-border/50 bg-card/80 p-8 text-center backdrop-blur-xl">
          <div className="flex flex-col items-center justify-center gap-3">
            <RefreshCw className="size-8 animate-spin text-primary" />
            <p className="font-mono text-xs text-muted-foreground">{t("scheme:states.loading")}</p>
          </div>
        </Card>
      )}

      {/* Error / Failure State */}
      {error && !loading && (
        <Card className="border-destructive/30 bg-destructive/5 p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="size-8 text-destructive" />
            <p className="text-sm font-semibold text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchScheme(product, standardNumber, qcoStatus)}
              className="mt-2 gap-1.5"
            >
              <RefreshCw className="size-3.5" />
              Retry Query
            </Button>
          </div>
        </Card>
      )}

      {/* Main Results Presentation */}
      {!loading && !error && result && (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Recommended Scheme Card (Visual Focal Point) */}
            {recommended ? (
              <Card className="relative overflow-hidden border-primary/40 bg-gradient-to-br from-primary/10 via-card to-background shadow-lg">
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/10 blur-2xl" />

                <CardHeader className="pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge className="gap-1 bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 font-mono text-xs uppercase">
                      <Sparkles className="size-3" />
                      {t("scheme:recommendedScheme")}
                    </Badge>
                    <Badge className="gap-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-mono text-xs">
                      <CheckCircle2 className="size-3" />
                      {t("scheme:verifiedBadge")}
                    </Badge>
                  </div>

                  <CardTitle className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {recommended.schemeName}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
                    <span>Code: <strong className="text-foreground">{recommended.schemeCode}</strong></span>
                    <span>•</span>
                    <span>Standard: <strong className="text-primary">{recommended.standardNumbers.join(", ")}</strong></span>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-6">
                  {/* Why This Scheme? Section */}
                  <div className="rounded-xl border border-primary/20 bg-background/60 p-4">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      {t("scheme:whyThisScheme")}
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground">
                      {recommended.explanation}
                    </p>
                  </div>

                  {/* Requirements Breakdown */}
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("scheme:schemeRequirements")}
                    </h3>
                    <Tabs defaultValue="testing" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="testing" className="gap-1.5 text-xs">
                          <TestTube className="size-3.5" />
                          {t("scheme:testingTab")}
                        </TabsTrigger>
                        <TabsTrigger value="documents" className="gap-1.5 text-xs">
                          <FileText className="size-3.5" />
                          {t("scheme:documentsTab")}
                        </TabsTrigger>
                        <TabsTrigger value="certification" className="gap-1.5 text-xs">
                          <ShieldCheck className="size-3.5" />
                          {t("scheme:certificationTab")}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="testing" className="mt-3">
                        <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-background/40 p-4">
                          {recommended.requirements.testing.map((req, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                              <CheckCircle2 className="mt-0.5 size-4 text-primary shrink-0" />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="documents" className="mt-3">
                        <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-background/40 p-4">
                          {recommended.requirements.documents.map((doc, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                              <FileCheck className="mt-0.5 size-4 text-emerald-600 shrink-0" />
                              <span>{doc}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="certification" className="mt-3">
                        <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-background/40 p-4">
                          {recommended.requirements.certification.map((cert, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                              <ShieldCheck className="mt-0.5 size-4 text-amber-600 shrink-0" />
                              <span>{cert}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Official Regulatory Source Display */}
                  {recommended.source && (
                    <div className="flex flex-col justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 sm:flex-row sm:items-center">
                      <div className="flex flex-col">
                        <span className="font-mono text-2xs font-semibold text-muted-foreground uppercase">
                          {t("scheme:officialSource")}
                        </span>
                        <span className="text-xs font-semibold text-foreground">
                          {recommended.source.title}
                        </span>
                        <span className="font-mono text-2xs text-primary">
                          {recommended.source.type}
                        </span>
                      </div>

                      <a
                        href={recommended.source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary underline underline-offset-4"
                      >
                        {t("scheme:viewSource")}
                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                  )}

                  {/* Next Steps Navigation */}
                  <div className="border-t border-border/60 pt-4">
                    <h3 className="mb-3 font-mono text-xs font-semibold uppercase text-muted-foreground">
                      {t("scheme:nextSteps")}
                    </h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <Link
                        to="/conformity"
                        className="elevation-lift flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 text-xs font-medium text-foreground transition-all hover:bg-accent"
                      >
                        <div className="flex items-center gap-2">
                          <FileCheck className="size-4 text-primary" />
                          <span>{t("scheme:checkGaps")}</span>
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground" />
                      </Link>

                      <Link
                        to={`/laboratory-matcher?product=${encodeURIComponent(product)}&standard=${encodeURIComponent(standardNumber)}&scheme=${encodeURIComponent(recommended.schemeName)}`}
                        className="elevation-lift flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-xs font-semibold text-cyan-700 dark:text-cyan-400 transition-all hover:bg-cyan-500/20"
                      >
                        <div className="flex items-center gap-2">
                          <FlaskConical className="size-4" />
                          <span>Find Verified Lab</span>
                        </div>
                        <ArrowRight className="size-4" />
                      </Link>

                      <Link
                        to="/registration/new"
                        className="elevation-lift flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs font-semibold text-primary transition-all hover:bg-primary/20"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="size-4" />
                          <span>{t("scheme:startRegistration")}</span>
                        </div>
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* No Scheme / Insufficient Evidence State */
              <Card className="border-amber-500/30 bg-amber-500/5 p-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <AlertTriangle className="size-8 text-amber-600" />
                  <h3 className="text-base font-semibold text-foreground">
                    No Scheme Verified
                  </h3>
                  <p className="max-w-md text-xs text-muted-foreground">
                    {t("scheme:states.noScheme")}
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
