import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  FileText,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  FileCheck2,
  Send,
  Building2,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "@/lib/router-compat";
import {
  licenseActionsApi,
  type LicenseNotice,
} from "@/lib/license-actions-api";
import { CANONICAL_DEMO_USERS } from "@/lib/demo/demo-context";

interface RemediationFlowDialogProps {
  notice: LicenseNotice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemediationSubmitted: () => void;
}

export function RemediationFlowDialog({
  notice,
  open,
  onOpenChange,
  onRemediationSubmitted,
}: RemediationFlowDialogProps) {
  const { t } = useTranslation(["licenseActions"]);
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [signatoryName, setSignatoryName] = useState(CANONICAL_DEMO_USERS.owner.fullName);
  const [designation, setDesignation] = useState(CANONICAL_DEMO_USERS.owner.designation);
  const [rcaSummary, setRcaSummary] = useState(
    "Root cause identified: Secondary winding insulation lacquer thickness measured 0.012mm against 0.025mm specification due to worn spray nozzle on dipping station line #2. Corrective calibration instituted with 100% automated dielectric hi-pot tester."
  );
  const [correctiveActions, setCorrectiveActions] = useState(
    "1. Replaced dipping spray nozzle with laser-metered precision applicator. 2. Segregated 450 units of Batch #2026-B12 into bonded quarantine. 3. Re-trained coil winding operators."
  );
  const [preventiveMeasures, setPreventiveMeasures] = useState(
    "Installed automated inline dielectric breakdown tester at 2.2 kV with interlocking conveyor rejection gate for any leakage > 5mA."
  );
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);

  if (!notice) return null;

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmitRemediation = async () => {
    if (!declarationAccepted) return;
    setIsSubmitting(true);
    try {
      const res = await licenseActionsApi.submitRemediationPackage(notice.id, {
        noticeId: notice.id,
        signatoryName,
        designation,
        rootCauseAnalysisSummary: rcaSummary,
        correctiveActionsImplemented: correctiveActions,
        preventiveMeasuresDescription: preventiveMeasures,
        attachedEvidence: notice.remediationRequirements.map((req) => ({
          requirementId: req.id,
          documentTitle: req.title,
          documentSource: "vault",
          vaultDocumentId: req.uploadedDocumentId || `doc-${req.id}`,
          fileName: req.uploadedDocumentName || `${req.title.replace(/\s+/g, "_")}.pdf`,
        })),
        applicantDeclarationAccepted: true,
      });
      setSubmittedReference(res.submissionReference);
      setCurrentStep(6);
      onRemediationSubmitted();
    } catch (err) {
      console.error("Remediation submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    t("licenseActions:workflow.step1"),
    t("licenseActions:workflow.step2"),
    t("licenseActions:workflow.step3"),
    t("licenseActions:workflow.step4"),
    t("licenseActions:workflow.step5"),
    t("licenseActions:workflow.step6"),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-2xl md:max-w-3xl max-h-[90dvh] overflow-y-auto p-4 sm:p-6 md:p-7">
        <DialogHeader className="gap-2 pb-3 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-primary break-all">
              License {notice.certificateNumber} · {notice.noticeNumber}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Step {currentStep} of 6
            </span>
          </div>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground break-words">
            {t("licenseActions:workflow.title")}
          </DialogTitle>

          {/* Stepper bar */}
          <div className="grid grid-cols-6 gap-1 pt-2">
            {[1, 2, 3, 4, 5, 6].map((st) => (
              <div
                key={st}
                className={`h-1.5 rounded-full transition-all ${
                  st < currentStep
                    ? "bg-emerald-500"
                    : st === currentStep
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        {/* STEP CONTENT */}
        <div className="py-4">
          {/* STEP 1: Understand the Notice */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5">
                <h4 className="font-bold text-foreground mb-1 text-sm">
                  {stepTitles[0]}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {t("licenseActions:workflow.step1Desc")}
                </p>
              </div>

              <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-border/70 bg-card">
                <span className="font-bold text-foreground">Official Finding / Reason:</span>
                <p className="text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-lg border border-border/40 font-mono text-xs">
                  {notice.officialExplanation}
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-1">
                  <span>Order Ref: <strong className="text-foreground">{notice.officialOrderRef}</strong></span>
                  <span>Issuing Branch: <strong className="text-foreground">{notice.issuingBranch}</strong></span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/5 flex flex-col gap-2">
                <span className="font-bold text-destructive flex items-center gap-1.5">
                  <AlertTriangle className="size-4" />
                  <span>Immediate Mandatory Directives</span>
                </span>
                <ul className="list-disc pl-4 space-y-1 text-xs text-foreground">
                  {notice.immediateDirectives.map((dir, idx) => (
                    <li key={idx}>{dir}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* STEP 2: Identify Affected Requirements */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5">
                <h4 className="font-bold text-foreground mb-1 text-sm">
                  {stepTitles[1]}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {t("licenseActions:workflow.step2Desc")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-border/70 bg-card">
                  <span className="font-bold text-foreground block mb-1">Standard Reference</span>
                  <span className="font-mono text-sm font-bold text-primary block">{notice.standardNumber}</span>
                  <span className="text-muted-foreground">{notice.standardTitle}</span>
                </div>

                <div className="p-3 rounded-xl border border-border/70 bg-card">
                  <span className="font-bold text-foreground block mb-1">Non-Conforming Clause</span>
                  <span className="font-mono text-sm font-bold text-destructive block">Clause 8.3 (High Voltage Withstand)</span>
                  <span className="text-muted-foreground">Threshold: Minimum 2.0 kV AC for 60 seconds without breakdown.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs">
                <h5 className="font-bold text-foreground mb-1">Affected Scope & Distribution Bounds</h5>
                <p className="text-muted-foreground leading-relaxed">{notice.affectedScopeSummary}</p>
              </div>
            </div>
          )}

          {/* STEP 3: Review Compliance Gaps */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5">
                <h4 className="font-bold text-foreground mb-1 text-sm">
                  {stepTitles[2]}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {t("licenseActions:workflow.step3Desc")}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-card flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">Conformity Workbench Diagnostics</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600">
                    Deficiency Flagged
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  The automated Compliance Gap Analyzer evaluated Clause 8.3 against your testing bench telemetry. Root cause correlates with stator potting fill time and drying oven temperature profiles.
                </p>
                <div className="pt-2">
                  <Link to="/conformity">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
                      <ShieldCheck className="size-3.5 text-primary" />
                      <span>Open Live Conformity Workbench</span>
                      <ExternalLink className="size-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Prepare Corrective Evidence & CAPA */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5">
                <h4 className="font-bold text-foreground mb-1 text-sm">
                  {stepTitles[3]}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {t("licenseActions:workflow.step4Desc")}
                </p>
              </div>

              {/* Requirements Checklist */}
              <div className="flex flex-col gap-2">
                {notice.remediationRequirements.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl border border-border/70 bg-card text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <FileCheck2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-foreground block">{req.title}</span>
                        <span className="text-muted-foreground block text-2xs">{req.description}</span>
                        {req.uploadedDocumentName && (
                          <span className="text-primary font-mono text-2xs block mt-0.5">
                            Attached: {req.uploadedDocumentName}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-2xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 shrink-0">
                      READY
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link to="/document-corrections">
                  <Button variant="outline" size="sm" className="text-xs font-semibold gap-1">
                    <span>Manage in Document Corrections</span>
                    <ExternalLink className="size-3" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* STEP 5: Submit Package */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5">
                <h4 className="font-bold text-foreground mb-1 text-sm">
                  {stepTitles[4]}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {t("licenseActions:workflow.step5Desc")}
                </p>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold">{t("licenseActions:workflow.signatoryName")}</Label>
                  <Input
                    value={signatoryName}
                    onChange={(e) => setSignatoryName(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold">{t("licenseActions:workflow.signatoryDesignation")}</Label>
                  <Input
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold">{t("licenseActions:workflow.rcaSummary")}</Label>
                <Textarea
                  rows={2}
                  value={rcaSummary}
                  onChange={(e) => setRcaSummary(e.target.value)}
                  className="text-xs resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold">{t("licenseActions:workflow.correctiveSummary")}</Label>
                <Textarea
                  rows={2}
                  value={correctiveActions}
                  onChange={(e) => setCorrectiveActions(e.target.value)}
                  className="text-xs resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold">{t("licenseActions:workflow.preventiveSummary")}</Label>
                <Textarea
                  rows={2}
                  value={preventiveMeasures}
                  onChange={(e) => setPreventiveMeasures(e.target.value)}
                  className="text-xs resize-none"
                />
              </div>

              {/* Statutory Declaration Checkbox */}
              <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 flex items-start gap-3">
                <Checkbox
                  id="declaration"
                  checked={declarationAccepted}
                  onCheckedChange={(checked) => setDeclarationAccepted(checked === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="declaration" className="text-xs text-foreground leading-relaxed cursor-pointer font-normal">
                  {t("licenseActions:workflow.declarationText")}
                </Label>
              </div>
            </div>
          )}

          {/* STEP 6: Track Scrutiny & Status */}
          {currentStep === 6 && (
            <div className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3">
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-foreground text-sm">
                    {submittedReference
                      ? `${t("licenseActions:workflow.submissionSuccess")}${submittedReference}`
                      : t("licenseActions:workflow.statusSubmitted")}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your Corrective Action Plan (CAPA), NABL calibration logs, and warehouse quarantine affidavit have been logged with Delhi Branch Office-II.
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-4 rounded-xl border border-border/70 bg-card flex flex-col gap-3">
                <h5 className="font-bold text-foreground text-xs uppercase tracking-wider">
                  Enforcement & Remediation Milestone Log
                </h5>
                <div className="flex flex-col gap-3">
                  {notice.timeline.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3 text-xs">
                      <div className="size-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{entry.title}</span>
                          <span className="text-2xs text-muted-foreground font-mono">
                            {new Date(entry.date).toLocaleDateString("en-IN")}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-0.5">{entry.description}</p>
                      </div>
                    </div>
                  ))}
                  {submittedReference && (
                    <div className="flex items-start gap-3 text-xs">
                      <div className="size-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-600">CAPA Submission Received</span>
                          <span className="text-2xs text-muted-foreground font-mono">Just Now</span>
                        </div>
                        <p className="text-muted-foreground mt-0.5">
                          Assigned to Scrutiny Officer Er. Rajesh Kumar for review.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>

          <div className="flex items-center gap-2 justify-end">
            {currentStep > 1 && currentStep < 6 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="gap-1 text-xs font-semibold"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back</span>
              </Button>
            )}

            {currentStep < 5 && (
              <Button
                size="sm"
                onClick={handleNext}
                className="gap-1.5 text-xs font-semibold"
              >
                <span>Continue</span>
                <ArrowRight className="size-3.5" />
              </Button>
            )}

            {currentStep === 5 && (
              <Button
                size="sm"
                onClick={handleSubmitRemediation}
                disabled={!declarationAccepted || isSubmitting}
                className="gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-foreground"
              >
                <Send className="size-3.5" />
                <span>{t("licenseActions:workflow.submitButton")}</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
