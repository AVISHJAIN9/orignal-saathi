import { useEffect, useState } from "react";
import { FileEdit, FilePlus, FlaskConical, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { AmbientBackground } from "@/components/ambient-background";
import { LoadingMessage } from "@/components/loading-message";
import { PlaceholderPage } from "@/components/placeholder-page";
import { LabSampleTrackerWidget } from "@/components/testing/lab-sample-tracker-widget";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { buildSampleTestingRecord } from "@/lib/mock-sample-testing";
import {
  listDrafts,
  listSubmittedApplications,
  type Application,
} from "@/lib/mock-registration";
import { getApplications } from "@/lib/mock-dashboard";
import { useRole } from "@/lib/role";
import { cn } from "@/lib/utils";

/**
 * S18 — lists every real "submitted" application that actually has a
 * trackable sample record: the two illustrative dashboard applications
 * (via getApplications(), the same real S3 Application shape S2 already
 * uses — not a parallel dataset) plus this browser's own real submitted
 * drafts (listSubmittedApplications(), mock-registration.ts). An
 * application only appears here if buildSampleTestingRecord() can
 * honestly resolve it — no placeholder/empty entries.
 *
 * Also lists saved draft applications so the user can see and resume
 * applications they created but haven't yet submitted.
 */
export function SampleTrackerPage() {
  const { t } = useTranslation("testing");
  const { role, ready } = useRole();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [draftApplications, setDraftApplications] = useState<Application[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    Promise.all([
      getApplications(currentUser, role),
      listSubmittedApplications(),
      listDrafts(),
    ]).then(([illustrative, real, drafts]) => {
      if (cancelled) return;
      const combined = [
        ...illustrative.map((d) => d.application),
        ...real,
      ].filter((app) => buildSampleTestingRecord(app) !== null);
      // Deduplicate: illustrative apps and real submitted apps may overlap
      const seenIds = new Set(combined.map((a) => a.id));
      const uniqueSubmitted = combined;

      // Drafts that aren't already in the submitted list
      const uniqueDrafts = drafts.filter((d) => !seenIds.has(d.id));

      setApplications(uniqueSubmitted);
      setDraftApplications(uniqueDrafts);
      if (uniqueSubmitted.length > 0) {
        setSelectedApplicationId(uniqueSubmitted[0].id);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [currentUser, role]);

  if (!ready) return null;

  if (role !== "industry" && role !== "admin") {
    return <PlaceholderPage title={t("title")} allowed={false} />;
  }

  const activeApplication = applications.find(
    (a) => a.id === selectedApplicationId,
  );

  const hasSubmitted = applications.length > 0;
  const hasDrafts = draftApplications.length > 0;
  const isEmpty = !hasSubmitted && !hasDrafts;

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex flex-col gap-1">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium tracking-wide text-primary uppercase">
              {t("eyebrow")}
            </span>
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
              {t("title")}
            </h1>
            <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/registration/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 hover:shadow-sm"
            >
              <FilePlus className="size-4 shrink-0" aria-hidden />
              <span>New Registration</span>
            </Link>
            <Link
              to="/dashboard"
              className="shrink-0 text-xs font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              {t("backToDashboard")}
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            <LoadingMessage
              messages={
                Array.isArray(t("loadingMessages", { returnObjects: true }))
                  ? (t("loadingMessages", { returnObjects: true }) as string[])
                  : []
              }
              className="text-xs font-medium text-muted-foreground"
            />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : isEmpty ? (
          <div className="elevation-1 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center sm:p-12">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FlaskConical className="size-6" aria-hidden />
            </div>
            <div className="flex max-w-md flex-col gap-1">
              <h3 className="text-base font-semibold text-foreground">
                No Trackable Samples Yet
              </h3>
              <p className="text-xs text-muted-foreground">{t("empty")}</p>
            </div>
            <Link
              to="/registration/new"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 hover:shadow-sm"
            >
              <Plus className="size-4" aria-hidden />
              <span>Start New Registration</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Submitted applications with testing tracker */}
            {hasSubmitted && (
              <>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {t("selectSample")}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {applications.map((application) => {
                      const record = buildSampleTestingRecord(application);
                      if (!record) return null;
                      const isSelected = application.id === selectedApplicationId;
                      return (
                        <button
                          key={application.id}
                          type="button"
                          onClick={() => setSelectedApplicationId(application.id)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl border px-3.5 py-2 text-left text-xs font-medium transition-all",
                            isSelected
                              ? "border-primary bg-primary font-semibold text-primary-foreground shadow-xs"
                              : "border-border bg-card text-foreground hover:bg-muted/70",
                          )}
                        >
                          <FlaskConical className="size-4 shrink-0" aria-hidden />
                          <div className="flex flex-col">
                            <span>{record.productName}</span>
                            <span
                              className={cn(
                                "font-mono text-2xs",
                                isSelected
                                  ? "text-primary-foreground/80"
                                  : "text-muted-foreground",
                              )}
                            >
                              {record.sampleId}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {activeApplication && (
                  <LabSampleTrackerWidget
                    key={activeApplication.id}
                    application={activeApplication}
                    compact={false}
                    showSimulator
                  />
                )}
              </>
            )}

            {/* Draft applications — saved but not yet submitted */}
            {hasDrafts && (
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Saved Applications (Draft)
                </span>
                <div className="flex flex-col gap-2">
                  {draftApplications.map((draft) => (
                    <Link
                      key={draft.id}
                      to="/registration/new"
                      className="elevation-1 flex items-center gap-3 rounded-xl border border-dashed border-border bg-card p-3.5 text-left transition-all hover:border-primary/40 hover:bg-muted/50"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                        <FileEdit className="size-4" aria-hidden />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-xs font-semibold text-foreground">
                          {draft.product.productName || "Untitled Application"}
                        </span>
                        <span className="font-mono text-2xs text-muted-foreground">
                          {draft.id} · Last saved{" "}
                          {new Date(draft.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="shrink-0 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 font-mono text-2xs font-semibold text-amber-700 uppercase dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
                        Draft
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
