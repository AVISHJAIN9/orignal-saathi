import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useBlocker } from "@tanstack/react-router";

import { BisSeal } from "@/components/bis-marks";
import {
  RegistrationStepper,
  type StepDescriptor,
} from "@/components/registration/registration-stepper";
import { ApplicantDetailsStep } from "@/components/registration/steps/applicant-details-step";
import { BusinessDetailsStep } from "@/components/registration/steps/business-details-step";
import { ProductDetailsStep } from "@/components/registration/steps/product-details-step";
import { DocumentsStep } from "@/components/registration/steps/documents-step";
import { TestingLabStep } from "@/components/registration/steps/testing-lab-step";
import { ReviewStep } from "@/components/registration/steps/review-step";
import { SubmittedStep } from "@/components/registration/submitted-step";
import { RejectedStep } from "@/components/registration/rejected-step";
import { DraftPicker } from "@/components/registration/draft-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth, type AuthUser } from "@/lib/auth";
import {
  createApplication,
  createReapplication,
  getApplication,
  getRequirements,
  listDrafts,
  minutesAgo,
  saveDraft,
  startNewApplication,
  submitApplication,
  uploadDocument,
  type Application,
} from "@/lib/mock-registration";
import { useNavigate } from "@/lib/router-compat";
import {
  validateApplicant,
  validateBusiness,
  validateProduct,
  type FieldErrors,
} from "@/lib/registration-validation";

type Stage = "loading" | "picking" | "ready" | "error";
type SaveStatus = "idle" | "saved" | "failed";

const STEP_COUNT = 6;

// Only ever fills in fields the resumed/new draft doesn't already have —
// never overwrites a draft's own saved values, whichever of the three
// entry paths below (auto-resume, picker "Resume", picker "Start fresh")
// produced it.
function withUserPrefill(app: Application, user: AuthUser | null): Application {
  if (!user) return app;
  if (app.applicant.fullName !== "" || app.applicant.email !== "") return app;
  return {
    ...app,
    applicant: { ...app.applicant, fullName: user.name, email: user.email },
  };
}

/**
 * Owns the single authoritative `application` object end to end — every
 * step component is a controlled view over a slice of it, never a
 * parallel copy (no separate "selectedStandard" state living outside
 * `application.product.suggestedStandardKey`, etc.), mirroring how a real
 * backend's response would be the one source of truth.
 *
 * This is explicitly a prototype flow backed by mock-registration.ts —
 * see that file's header. Session-expiry is NOT handled here a second
 * time: this component is meant to be rendered inside the S1
 * `<ProtectedRoute>`, whose `isAuthenticated` check already re-runs on
 * every render, so a session invalidated by AuthProvider (e.g. via a
 * future real 401) redirects to sign-in on its own.
 */
export function RegistrationWizard() {
  const { t } = useTranslation("registration");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [stage, setStage] = useState<Stage>("loading");
  const [drafts, setDrafts] = useState<Application[]>([]);
  const [application, setApplication] = useState<Application | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepErrors, setStepErrors] = useState<FieldErrors>({});

  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveErrorBanner, setSaveErrorBanner] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCreatingReapplication, setIsCreatingReapplication] = useState(false);

  // Re-render every 30s so "Saved N minutes ago" stays current without a
  // page refresh — the number itself always comes from `lastSavedAt`
  // (the mock backend's own response timestamp), never a client guess.
  const [, forceTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => forceTick((n) => n + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    // S29: check how many drafts exist before deciding how to enter the
    // wizard. Zero or one draft keeps the original seamless behavior
    // (createApplication() auto-resumes the one draft, or creates a new
    // one) — the picker only ever appears when there's a real choice to
    // make.
    listDrafts()
      .then((existingDrafts) => {
        if (cancelled) return null;
        if (existingDrafts.length > 1) {
          setDrafts(existingDrafts);
          setStage("picking");
          return null;
        }
        return createApplication();
      })
      .then((app) => {
        if (cancelled || !app) return;
        setApplication(withUserPrefill(app, currentUser));
        setStage("ready");
      })
      .catch(() => {
        if (!cancelled) setStage("error");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleResumeDraft(id: string) {
    setStage("loading");
    try {
      const app = await getApplication(id);
      if (!app) {
        setStage("error");
        return;
      }
      setApplication(withUserPrefill(app, currentUser));
      setStage("ready");
    } catch {
      setStage("error");
    }
  }

  async function handleStartFresh() {
    setStage("loading");
    try {
      const app = await startNewApplication();
      setApplication(withUserPrefill(app, currentUser));
      setStage("ready");
    } catch {
      setStage("error");
    }
  }

  // A plain reactive value, not a ref — `enableBeforeUnload` below must
  // reflect the CURRENT state on every render. Hardcoding it to `true`
  // was a real bug caught in manual testing: it registered a native
  // "leave site?" prompt on every navigation away from this page, even
  // moments after a successful save/submit with nothing unsaved.
  const shouldBlock =
    hasUnsavedChanges &&
    saveStatus !== "saved" &&
    application?.status === "draft";

  const blocker = useBlocker({
    shouldBlockFn: () => shouldBlock,
    enableBeforeUnload: shouldBlock,
    withResolver: true,
  });

  function updateApplicationState(patch: Partial<Application>) {
    setApplication((prev) => (prev ? { ...prev, ...patch } : prev));
    setHasUnsavedChanges(true);
  }

  async function autosave(current: Application): Promise<boolean> {
    setIsSaving(true);
    setSaveErrorBanner(null);
    try {
      const { savedAt } = await saveDraft(current.id, {
        applicant: current.applicant,
        business: current.business,
        product: current.product,
        documents: current.documents,
        testing: current.testing,
        review: current.review,
      });
      setSaveStatus("saved");
      setLastSavedAt(savedAt);
      setHasUnsavedChanges(false);
      return true;
    } catch {
      setSaveStatus("failed");
      setSaveErrorBanner(t("errors.saveFailed"));
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  function validateStep(index: number, app: Application): FieldErrors {
    if (index === 0) return validateApplicant(app.applicant);
    if (index === 1) return validateBusiness(app.business);
    if (index === 2) return validateProduct(app.product);
    return {};
  }

  async function handleContinue() {
    if (!application) return;
    const errors = validateStep(currentStepIndex, application);
    setStepErrors(errors);
    if (Object.keys(errors).length > 0) return;

    let next = application;
    // Leaving Product for Documents for the first time: load this
    // standard's requirements from the mock backend rather than the
    // wizard guessing them.
    if (currentStepIndex === 2 && application.documents.length === 0) {
      const requirements = await getRequirements(
        application.product.suggestedStandardKey,
      );
      next = {
        ...application,
        documents: requirements.documents,
        testing: requirements.testing,
      };
      setApplication(next);
    }

    await autosave(next);
    setCurrentStepIndex((i) => Math.min(i + 1, STEP_COUNT - 1));
  }

  function handleBack() {
    setStepErrors({});
    setCurrentStepIndex((i) => Math.max(i - 1, 0));
  }

  function handleEditStep(index: number) {
    setStepErrors({});
    setCurrentStepIndex(index);
  }

  async function handleSaveAndExit() {
    if (!application) return;
    const saved = await autosave(application);
    // Only actually leave if that save succeeded — otherwise stay so the
    // user can see the error and retry, rather than silently stranding
    // unsaved work.
    if (saved) {
      navigate("/chat");
    }
  }

  async function handleUploadDocument(documentKey: string, fileName: string) {
    if (!application) return;
    setUploadingKey(documentKey);
    setUploadError(null);
    try {
      const result = await uploadDocument(
        application.id,
        documentKey,
        fileName,
      );
      setApplication((prev) =>
        prev
          ? {
              ...prev,
              documents: prev.documents.map((doc) =>
                doc.key === documentKey
                  ? {
                      ...doc,
                      status: result.status,
                      fileName: result.fileName,
                      rejectionReason: result.rejectionReason,
                    }
                  : doc,
              ),
            }
          : prev,
      );
      setHasUnsavedChanges(true);
    } catch {
      setUploadError(t("errors.uploadFailed"));
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleSubmit() {
    if (!application) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitApplication(application.id);
      if (
        (result.status === "submitted" || result.status === "rejected") &&
        result.applicationId &&
        result.submittedAt
      ) {
        // Destructured here (not read as result.status inside the closure
        // below) so the narrowing above actually survives — TS doesn't
        // carry control-flow narrowing across a closure boundary, but a
        // const captured at this already-narrowed point keeps its type.
        const { status, submittedAt, rejectionReason } = result;
        setApplication((prev) =>
          prev ? { ...prev, status, submittedAt, rejectionReason } : prev,
        );
        setHasUnsavedChanges(false);
      } else {
        setSubmitError(result.errorMessage ?? t("errors.submissionFailed"));
      }
    } catch {
      setSubmitError(t("errors.submissionFailed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStartReapplication() {
    if (!application) return;
    setIsCreatingReapplication(true);
    try {
      const reapplication = await createReapplication(application.id);
      if (!reapplication) {
        setStage("error");
        return;
      }
      setApplication(withUserPrefill(reapplication, currentUser));
      setCurrentStepIndex(STEP_COUNT - 1);
      setStepErrors({});
      setSaveStatus("saved");
      setLastSavedAt(reapplication.updatedAt);
      setHasUnsavedChanges(false);
    } finally {
      setIsCreatingReapplication(false);
    }
  }

  if (stage === "loading") {
    return (
      <div className="elevation-1 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center">
        <BisSeal className="size-8 animate-pulse text-primary" aria-hidden />
        <p className="text-sm text-muted-foreground">
          {t("creatingApplication")}
        </p>
      </div>
    );
  }

  if (stage === "picking") {
    return (
      <DraftPicker
        drafts={drafts}
        onResume={(id) => void handleResumeDraft(id)}
        onStartFresh={() => void handleStartFresh()}
      />
    );
  }

  if (stage === "error" || !application) {
    return (
      <div className="elevation-1 flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
        <AlertTriangle className="size-6 text-destructive" aria-hidden />
        <h2 className="text-lg font-semibold text-foreground">
          {t("errors.backendUnavailableHeading")}
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {t("errors.backendUnavailableBody")}
        </p>
        <Button type="button" onClick={() => window.location.reload()}>
          {t("errors.retry")}
        </Button>
      </div>
    );
  }

  if (application.status === "submitted" && application.submittedAt) {
    return (
      <SubmittedStep
        applicationId={application.id}
        submittedAt={application.submittedAt}
      />
    );
  }

  if (application.status === "rejected") {
    return (
      <RejectedStep
        applicationId={application.id}
        rejectionReason={
          application.rejectionReason ?? t("rejected.reasonFallback")
        }
        onStartReapplication={() => void handleStartReapplication()}
        isCreatingReapplication={isCreatingReapplication}
      />
    );
  }

  const steps: StepDescriptor[] = [
    { key: "applicant", label: t("steps.applicant") },
    { key: "business", label: t("steps.business") },
    { key: "product", label: t("steps.product") },
    { key: "documents", label: t("steps.documents") },
    { key: "testing", label: t("steps.testing") },
    { key: "review", label: t("steps.review") },
  ];

  const allDocumentsAccepted =
    application.documents.length === 0 ||
    application.documents.every((doc) => doc.status === "accepted");
  const canSubmit =
    application.review.confirmed && allDocumentsAccepted && !isSubmitting;

  return (
    <div className="flex flex-col gap-5">
      <RegistrationStepper
        steps={steps}
        currentIndex={currentStepIndex}
        stepOfLabel={t("stepOf", {
          current: currentStepIndex + 1,
          total: STEP_COUNT,
        })}
      />

      {saveErrorBanner && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{saveErrorBanner}</span>
        </div>
      )}
      {uploadError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{uploadError}</span>
        </div>
      )}

      <div className="elevation-1 rounded-2xl border border-border bg-card p-5 sm:p-6">
        {currentStepIndex === 0 && (
          <ApplicantDetailsStep
            value={application.applicant}
            errors={stepErrors}
            onChange={(applicant) => updateApplicationState({ applicant })}
          />
        )}
        {currentStepIndex === 1 && (
          <BusinessDetailsStep
            value={application.business}
            errors={stepErrors}
            onChange={(business) => updateApplicationState({ business })}
          />
        )}
        {currentStepIndex === 2 && (
          <ProductDetailsStep
            value={application.product}
            errors={stepErrors}
            onChange={(product) => updateApplicationState({ product })}
          />
        )}
        {currentStepIndex === 3 && (
          <DocumentsStep
            documents={application.documents}
            standardKey={application.product.suggestedStandardKey}
            applicantType={application.applicant.applicantType}
            uploadingKey={uploadingKey}
            onUpload={handleUploadDocument}
          />
        )}
        {currentStepIndex === 4 && (
          <TestingLabStep testing={application.testing} />
        )}
        {currentStepIndex === 5 && (
          <ReviewStep
            application={application}
            onEditStep={handleEditStep}
            confirmed={application.review.confirmed}
            onConfirmedChange={(confirmed) =>
              updateApplicationState({ review: { confirmed } })
            }
          />
        )}
      </div>

      {submitError && currentStepIndex === 5 && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{submitError}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
          >
            {t("back")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleSaveAndExit}
            disabled={isSaving}
          >
            {isSaving ? t("savingDraft") : t("saveAndExit")}
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <SaveStatusLabel
            isSaving={isSaving}
            saveStatus={saveStatus}
            lastSavedAt={lastSavedAt}
          />
          {currentStepIndex < STEP_COUNT - 1 ? (
            <Button type="button" onClick={handleContinue}>
              {t("continue")}
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={!canSubmit}>
              {isSubmitting ? t("submitting") : t("submit")}
            </Button>
          )}
        </div>
      </div>

      <Dialog
        open={blocker.status === "blocked"}
        onOpenChange={() => blocker.reset?.()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("leaveDialog.title")}</DialogTitle>
            <DialogDescription>{t("leaveDialog.body")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => blocker.reset?.()}
            >
              {t("leaveDialog.stay")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => blocker.proceed?.()}
            >
              {t("leaveDialog.leave")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SaveStatusLabel({
  isSaving,
  saveStatus,
  lastSavedAt,
}: {
  isSaving: boolean;
  saveStatus: SaveStatus;
  lastSavedAt: string | null;
}) {
  const { t } = useTranslation("registration");
  if (isSaving)
    return (
      <span className="text-xs text-muted-foreground">{t("savingDraft")}</span>
    );
  if (saveStatus === "failed") {
    return (
      <span className="text-xs text-destructive">{t("draftNotSaved")}</span>
    );
  }
  if (!lastSavedAt) return null;
  const minutes = minutesAgo(lastSavedAt);
  return (
    <span className="text-xs text-muted-foreground">
      {minutes < 1
        ? t("savedJustNow")
        : t("draftSavedMinutesAgo", { count: minutes })}
    </span>
  );
}
