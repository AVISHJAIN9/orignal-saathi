import { Activity, Clock, FileText, UserPlus, ShieldCheck, Scale, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/router-compat";
import type { BusinessActivityItem } from "@/lib/business-account-api";

interface BusinessActivityFeedProps {
  activities: BusinessActivityItem[];
}

const actionIcons: Record<string, typeof Activity> = {
  INVITE_SENT: UserPlus,
  INVITE_ACCEPTED: CheckCircle2,
  ROLE_UPDATED: ShieldCheck,
  MEMBER_REMOVED: UserPlus,
  DOCUMENT_CORRECTED: FileText,
  APPEAL_LODGED: Scale,
  VISIT_SCHEDULED: Calendar,
  TEST_SUBMITTED: CheckCircle2,
  WORKSPACE_SWITCHED: Activity,
};

const categoryBadgeColors: Record<string, string> = {
  team: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  compliance: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  documents: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  appeals: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  visits: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20",
};

export function BusinessActivityFeed({ activities }: BusinessActivityFeedProps) {
  const { t } = useTranslation("businessAccount");

  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-10 text-center">
        <Activity className="size-8 text-muted-foreground mb-2 opacity-60" />
        <h3 className="font-semibold text-foreground text-sm">{t("activity.noActivity")}</h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground text-base">{t("activity.title")}</h3>
        <p className="text-xs text-muted-foreground">{t("activity.subtitle")}</p>
      </div>

      <div className="relative space-y-3 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
        {activities.map((item) => {
          const IconComponent = actionIcons[item.actionType] || Activity;
          const formattedDate = new Date(item.timestamp).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={item.id} className="relative flex items-start gap-3.5 pl-1 text-sm">
              <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                <IconComponent className="size-4 text-primary" />
              </div>

              <div className="flex-1 rounded-xl border border-border/70 bg-card/60 p-3 shadow-sm hover:border-border transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-xs sm:text-sm">
                      {item.actorName}
                    </span>
                    <Badge variant="outline" className={`text-2xs px-1.5 py-0 ${categoryBadgeColors[item.category] || ""}`}>
                      {item.category.toUpperCase()}
                    </Badge>
                  </div>

                  <span className="flex items-center gap-1 text-2xs text-muted-foreground font-mono">
                    <Clock className="size-3" />
                    {formattedDate}
                  </span>
                </div>

                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                {item.deepLink && (
                  <div className="mt-2 flex justify-end">
                    <Link
                      to={item.deepLink as any}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <span>{t("activity.viewAction")}</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
