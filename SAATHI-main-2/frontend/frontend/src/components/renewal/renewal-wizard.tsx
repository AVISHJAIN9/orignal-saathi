import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/auth";
import { useRole } from "@/lib/role";
import {
  calculateRenewalFees,
  listRenewalLicences,
  submitRenewalRecord,
  type ProductionDeclaration,
  type RenewalLicence,
  type RenewalRecord,
  type SurveillanceAuditSubmission,
} from "@/lib/mock-renewals";
import { RenewalStepper, type StepDescriptor } from "./renewal-stepper";
import { LicenceDetailsStep } from "./steps/licence-details-step";
import { ProductionDeclarationStep } from "./steps/production-declaration-step";
import { SurveillanceAuditStep } from "./steps/surveillance-audit-step";
import { FeesPaymentStep } from "./steps/fees-payment-step";
import { ConfirmationStep } from "./steps/confirmation-step";

interface RenewalWizardProps {
  applicationId?: string;
  onApplicationChange?: (appId: string) => void;
}

const EMPTY_PRODUCTION: ProductionDeclaration = {
  reportingPeriod: "Previous 12 months",
  quantityProduced: 0,
  unit: "units",
  productionTurnover: 0,
  declarationConfirmed: false,
};

const EMPTY_AUDIT_DATA: SurveillanceAuditSubmission = {
  preferredDate: "",
  alternativeDate: "",
  timeSlot: "morning",
  qcContactName: "",
  qcContactPhone: "",
  qcContactEmail: "",
  checklist: {
    qcLabCalibrated: false,
    markingEquipmentOperational: false,
    testRecordsAvailable: false,
    sampleBatchReady: false,
  },
  preAuditNotes: "",
};

export function RenewalWizard({
  applicationId,
  onApplicationChange,
}: RenewalWizardProps) {
  const { t } = useTranslation("renewal");
  const { currentUser } = useAuth();
  const { role } = useRole();

  const [loading, setLoading] = useState(true);
  const [allLicences, setAllLicences] = useState<RenewalLicence[]>([]);
  const [licence, setLicence] = useState<RenewalLicence | null>(null);
  // True when a specific applicationId was requested (e.g. a deep link
  // from a dashboard deadline) but isn't eligible for renewal — distinct
  // from "no eligible applications exist at all", so this never silently
  // substitutes a different application's licence for the one the user
  // actually asked to see. See the module header note on eligibility.
  const [requestedIdNotEligible, setRequestedIdNotEligible] = useState(false);

  const [isSurveillanceTriggered, setIsSurveillanceTriggered] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [production, setProduction] =
    useState<ProductionDeclaration>(EMPTY_PRODUCTION);
  const [auditData, setAuditData] =
    useState<SurveillanceAuditSubmission>(EMPTY_AUDIT_DATA);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<RenewalRecord | null>(
    null,
  );

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    setLoading(true);

    listRenewalLicences(currentUser, role).then((licenceList) => {
      if (cancelled) return;
      setAllLicences(licenceList);

      // A specific applicationId (e.g. from a dashboard deadline link)
      // must resolve to THAT application's own licence or nothing at all
      // — never a silently substituted different one. Only the
      // no-applicationId case (the plain /renewals index, "show me
      // anything eligible") falls back to the first eligible licence.
      // Resolved from this same licenceList (not a separate lookup) so
      // illustrative applications — which live in mock-dashboard.ts, not
      // the real registration store getRenewalLicence() alone can see —
      // resolve correctly too.
      const resolved = applicationId
        ? (licenceList.find((l) => l.applicationId === applicationId) ?? null)
        : (licenceList[0] ?? null);
      setRequestedIdNotEligible(Boolean(applicationId) && !resolved);
      if (!resolved) {
        setLicence(null);
        setLoading(false);
        return;
      }
      setLicence(resolved);
      setIsSurveillanceTriggered(resolved.surveillanceTriggered);
      setProduction((prev) => ({ ...prev }));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [applicationId, currentUser, role]);

  const handleSelectLicence = (targetId: string) => {
    if (onApplicationChange) {
      onApplicationChange(targetId);
      return;
    }
    const selected = allLicences.find((l) => l.applicationId === targetId);
    if (selected) {
      setLicence(selected);
      setIsSurveillanceTriggered(selected.surveillanceTriggered);
      setCurrentStepIndex(0);
      setSubmittedRecord(null);
      setRequestedIdNotEligible(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!licence) {
    return (
      <div className="elevation-1 flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        <p>{requestedIdNotEligible ? t("notEligible") : t("empty")}</p>
        {/* Never a dead end: if the specifically-requested application
         * isn't eligible but a different real one is, offer an explicit,
         * visible way to reach it — never a silent substitution (see the
         * requestedIdNotEligible comment above). */}
        {requestedIdNotEligible && allLicences.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-border/60 pt-3">
            <span className="text-xs font-semibold text-foreground">
              {t("switchLicence")}:
            </span>
            <div className="flex flex-wrap gap-2">
              {allLicences.map((lic) => (
                <button
                  key={lic.applicationId}
                  type="button"
                  onClick={() => handleSelectLicence(lic.applicationId)}
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {lic.productName} ({lic.standardNumber})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const steps: StepDescriptor[] = isSurveillanceTriggered
    ? [
        { key: "licence", label: t("stepper.licence") },
        { key: "production", label: t("stepper.production") },
        {
          key: "surveillance",
          label: t("stepper.surveillance"),
          isSurveillanceStep: true,
        },
        { key: "fees", label: t("stepper.fees") },
        { key: "confirmation", label: t("stepper.confirmation") },
      ]
    : [
        { key: "licence", label: t("stepper.licence") },
        { key: "production", label: t("stepper.production") },
        { key: "fees", label: t("stepper.fees") },
        { key: "confirmation", label: t("stepper.confirmation") },
      ];

  const calculatedFees = calculateRenewalFees(
    licence,
    production.quantityProduced,
    isSurveillanceTriggered,
  );

  const handleToggleSurveillanceTrigger = (checked: boolean) => {
    setIsSurveillanceTriggered(checked);
  };

  const handleSubmitPayment = async () => {
    setIsSubmitting(true);
    try {
      const record = await submitRenewalRecord({
        applicationId: licence.applicationId,
        production,
        surveillanceAudit: isSurveillanceTriggered ? auditData : undefined,
        fees: calculatedFees,
        status: isSurveillanceTriggered ? "audit_scheduled" : "renewed",
      });
      setSubmittedRecord(record);
      setCurrentStepIndex(steps.length - 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetFlow = () => {
    setCurrentStepIndex(0);
    setSubmittedRecord(null);
  };

  const activeStepKey = steps[currentStepIndex]?.key;

  return (
    <div className="flex flex-col gap-6">
      {/* Illustrative-data disclaimer — renders unconditionally, above the
       * demo toolbar and stepper, so it's visible before any fee, audit, or
       * receipt content on every step (same placement rule as S18). */}
      <div className="elevation-1 flex items-start gap-3 rounded-2xl border-2 border-amber-400 bg-amber-50/90 p-4 dark:border-amber-700/60 dark:bg-amber-950/25">
        <AlertTriangle
          className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-400"
          aria-hidden
        />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-amber-950 dark:text-amber-100">
            {t("disclaimer.heading")}
          </span>
          <p className="text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90">
            {t("disclaimer.body")}
          </p>
        </div>
      </div>

      {/* Demo toolbar */}
      <div className="elevation-1 flex flex-col gap-3 rounded-2xl border-2 border-primary/20 bg-card/80 p-4 backdrop-blur-md dark:border-primary/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
              <Sparkles className="size-4" />
            </div>
            <div>
              <span className="font-semibold text-xs text-foreground">
                {t("demoToolbar.title")}
              </span>
              <p className="text-2xs text-muted-foreground">
                {t("demoToolbar.description")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {allLicences.length > 1 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">
                  {t("switchLicence")}:
                </span>
                <div className="flex rounded-lg border border-border bg-background p-0.5">
                  {allLicences.map((lic) => (
                    <button
                      key={lic.applicationId}
                      type="button"
                      onClick={() => handleSelectLicence(lic.applicationId)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        licence.applicationId === lic.applicationId
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {lic.standardNumber.split(":")[0]} (
                      {lic.productName.split(" ")[0]})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 border-l border-border/80 pl-4">
              <div className="flex flex-col items-end">
                <span className="text-xs font-medium text-foreground">
                  {t("demoToolbar.triggerLabel")}
                </span>
                <span className="font-mono text-2xs text-muted-foreground">
                  {isSurveillanceTriggered
                    ? t("demoToolbar.triggerOn")
                    : t("demoToolbar.triggerOff")}
                </span>
              </div>
              <Switch
                checked={isSurveillanceTriggered}
                onCheckedChange={handleToggleSurveillanceTrigger}
                aria-label="Toggle Surveillance Audit Condition"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-4 sm:p-5 backdrop-blur-xs">
        <RenewalStepper
          steps={steps}
          currentIndex={currentStepIndex}
          stepOfLabel={t("stepper.stepOf", {
            current: currentStepIndex + 1,
            total: steps.length,
          })}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${licence.applicationId}-${activeStepKey}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="w-full"
        >
          {activeStepKey === "licence" && (
            <LicenceDetailsStep
              licence={licence}
              isSurveillanceTriggered={isSurveillanceTriggered}
              onProceed={() => setCurrentStepIndex(1)}
            />
          )}

          {activeStepKey === "production" && (
            <ProductionDeclarationStep
              licence={licence}
              production={production}
              isSurveillanceTriggered={isSurveillanceTriggered}
              onChange={setProduction}
              onProceed={() => setCurrentStepIndex(2)}
              onBack={() => setCurrentStepIndex(0)}
            />
          )}

          {activeStepKey === "surveillance" && (
            <SurveillanceAuditStep
              licence={licence}
              auditData={auditData}
              onChange={setAuditData}
              onProceed={() => setCurrentStepIndex(3)}
              onBack={() => setCurrentStepIndex(1)}
            />
          )}

          {activeStepKey === "fees" && (
            <FeesPaymentStep
              fees={calculatedFees}
              onSubmitPayment={handleSubmitPayment}
              onBack={() =>
                setCurrentStepIndex(isSurveillanceTriggered ? 2 : 1)
              }
              isSubmitting={isSubmitting}
            />
          )}

          {activeStepKey === "confirmation" && submittedRecord && (
            <ConfirmationStep
              licence={licence}
              record={submittedRecord}
              onReset={handleResetFlow}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
