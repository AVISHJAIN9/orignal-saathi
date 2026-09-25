import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Lock,
  Award,
  Globe,
  HelpCircle,
} from "lucide-react";
import { AmbientBackground } from "@/components/ambient-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PublicVerificationCard } from "@/components/certificates/public-verification-card";
import {
  certificatesApi,
  type PublicVerificationResult,
} from "@/lib/certificates-api";

export function PublicVerificationPage() {
  const { t } = useTranslation(["certificates", "landing"]);

  const [inputNumber, setInputNumber] = useState("");
  const [result, setResult] = useState<PublicVerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasQueried, setHasQueried] = useState<boolean>(false);

  // Auto-verify if query parameter is present in URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const num = params.get("number") || params.get("cml") || params.get("id");
    if (num) {
      setInputNumber(num);
      void executeVerification(num);
    }
  }, []);

  const executeVerification = useCallback(
    async (numberToVerify: string) => {
      const clean = numberToVerify.trim();
      if (!clean) return;

      setIsLoading(true);
      setHasQueried(true);
      try {
        const res = await certificatesApi.verifyCertificatePublic(clean);
        setResult(res);
      } catch (err) {
        console.error("Public verification error:", err);
        setResult({
          verified: false,
          certificateNumber: clean,
          officialSource: "Bureau of Indian Standards National Registry",
          verifiedAt: new Date().toISOString(),
          unverifiedReason: "SERVICE_UNAVAILABLE",
          unverifiedMessage: "Could not reach the BIS verification server.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void executeVerification(inputNumber);
  };

  return (
    <div className="relative min-h-dvh bg-background pb-16">
      <AmbientBackground />

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pt-8 sm:px-6">
        {/* Hero Section */}
        <div className="text-center space-y-2">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5" />
            <span>National Verification Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("certificates:publicVerification.title")}
          </h1>
          <p className="mx-auto max-w-lg text-xs text-muted-foreground sm:text-sm">
            {t("certificates:publicVerification.subtitle")}
          </p>
        </div>

        {/* Verification Input Form Card */}
        <div className="glass p-5 sm:p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="certificate-input"
                className="font-mono text-xs font-bold text-foreground uppercase tracking-wider"
              >
                {t("certificates:publicVerification.inputLabel")}
              </label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Award className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="certificate-input"
                    value={inputNumber}
                    onChange={(e) => setInputNumber(e.target.value)}
                    placeholder={t("certificates:publicVerification.inputPlaceholder")}
                    className="pl-9 font-mono text-sm bg-background/70"
                    disabled={isLoading}
                    autoComplete="off"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !inputNumber.trim()}
                  className="gap-2 bg-primary text-primary-foreground font-semibold px-6"
                >
                  <Search className="size-4" />
                  {t("certificates:publicVerification.verifyBtn")}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Public Privacy Assurance Banner */}
        <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/50 p-3.5 text-xs text-muted-foreground">
          <Lock className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t("certificates:publicVerification.privacyNotice")}
          </p>
        </div>

        {/* Verification Result Card */}
        {hasQueried && (
          <PublicVerificationCard
            result={result}
            isLoading={isLoading}
            onRetry={() => void executeVerification(inputNumber)}
          />
        )}
      </main>
    </div>
  );
}
