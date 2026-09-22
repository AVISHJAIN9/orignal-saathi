import { useEffect, useState } from "react";
import { FlaskConical } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { AmbientBackground } from "@/components/ambient-background";
import { PlaceholderPage } from "@/components/placeholder-page";
import { LabSampleTrackerWidget } from "@/components/testing/lab-sample-tracker-widget";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { buildSampleTestingRecord } from "@/lib/mock-sample-testing";
import {
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
 */
export function SampleTrackerPage() {
  const { t } = useTranslation("testing");
  const { role, ready } = useRole();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    Promise.all([
      getApplications(currentUser, role),
      listSubmittedApplications(),
    ]).then(([illustrative, real]) => {
      if (cancelled) return;
      const combined = [
        ...illustrative.map((d) => d.application),
        ...real,
      ].filter((app) => buildSampleTestingRecord(app) !== null);
      setApplications(combined);
      if (combined.length > 0) setSelectedApplicationId(combined[0].id);
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

  return (
    <div className="relative min-h-dvh bg-background">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex flex-col gap-1">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium tracking-wide text-primary uppercase">
              {t("eyebrow")}
            </span>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {t("title")}
            </h1>
            <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Link
            to="/dashboard"
            className="shrink-0 text-xs font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {t("backToDashboard")}
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : applications.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
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
                            "font-mono text-[0.65rem]",
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
      </div>
    </div>
  );
}
