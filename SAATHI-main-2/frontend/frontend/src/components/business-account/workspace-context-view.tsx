import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";
import {
  FileEdit,
  GitMerge,
  ShieldAlert,
  CalendarCheck,
  CreditCard,
  FlaskConical,
  Scale,
  ArrowUpRight,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BusinessAccount, BusinessMember } from "@/lib/business-account-api";

interface WorkspaceContextViewProps {
  business: BusinessAccount;
  members: BusinessMember[];
}

export function WorkspaceContextView({ business, members }: WorkspaceContextViewProps) {
  const { t } = useTranslation("businessAccount");

  const modules = [
    {
      id: "corrections",
      title: "Document Re-submission & Scrutiny",
      description: "Official scrutiny remark tracking and deficient document replacement.",
      assignedRole: "Documentation Lead & Compliance Manager",
      statusBadge: "Active Monitoring",
      statusVariant: "default" as const,
      link: "/document-corrections",
      icon: FileEdit,
      iconColor: "text-amber-600 dark:text-amber-400",
      activeItems: "2 documents requiring undertakings / test reports",
    },
    {
      id: "chain",
      title: "End-to-End Compliance Chain",
      description: "Step-by-step BIS certification journey and next best actions.",
      assignedRole: "Compliance Manager & Testing Engineer",
      statusBadge: "Action Required",
      statusVariant: "secondary" as const,
      link: "/compliance-chain",
      icon: GitMerge,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      activeItems: "Step 8: Scrutiny & Document Verification",
    },
    {
      id: "alerts",
      title: "Regulatory Change Alerts",
      description: "Real-time BIS gazette notifications and standard revisions.",
      assignedRole: "Compliance Manager & Business Owner",
      statusBadge: "Live Feed",
      statusVariant: "outline" as const,
      link: "/regulatory-alerts",
      icon: ShieldAlert,
      iconColor: "text-amber-600 dark:text-amber-400",
      activeItems: "IS 14543 revision notice & STI testing guidelines",
    },
    {
      id: "visits",
      title: "Officer Inspection Visits",
      description: "Factory audit scheduling, officer verification, and sample drawing.",
      assignedRole: "Compliance Manager & Business Owner",
      statusBadge: "Scheduled",
      statusVariant: "secondary" as const,
      link: "/officer-visits",
      icon: CalendarCheck,
      iconColor: "text-blue-600 dark:text-blue-400",
      activeItems: "Factory visit scheduled for 22 Sep 2026",
    },
    {
      id: "appeals",
      title: "Official Appeals & Disputes",
      description: "Formal appellate grievances and assessment clarifications.",
      assignedRole: "Business Owner / Authorized Signatory",
      statusBadge: "Available",
      statusVariant: "outline" as const,
      link: "/appeals",
      icon: Scale,
      iconColor: "text-purple-600 dark:text-purple-400",
      activeItems: "Appellate portal available under BIS Act 2016",
    },
    {
      id: "testing",
      title: "Laboratory Matcher & STI",
      description: "NABL-accredited test laboratory search and parameter validation.",
      assignedRole: "Testing & Quality Engineer",
      statusBadge: "Configured",
      statusVariant: "default" as const,
      link: "/laboratory-matcher",
      icon: FlaskConical,
      iconColor: "text-cyan-600 dark:text-cyan-400",
      activeItems: "Regional Testing Lab matched for IS 14543 parameters",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <Card className="border-border/80 bg-gradient-to-r from-card to-muted/40 shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="size-5 text-primary" />
                <h3 className="font-bold text-foreground text-base">
                  Shared Compliance Workspace for {business.name}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground max-w-xl">
                All team members collaborate inside this shared workspace. Applications, compliance milestones, and document corrections are synchronized across authorized team members in real-time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-mono py-1 px-3 border-primary/30">
                <Users className="mr-1.5 size-3.5 text-primary" />
                {members.length} Active Collaborators
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Synchronized Workspace Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod) => {
          const IconComp = mod.icon;
          return (
            <Card key={mod.id} className="border-border/80 bg-card/70 hover:border-primary/40 hover:shadow-md transition-all">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background border border-border shadow-xs">
                      <IconComp className={`size-4.5 ${mod.iconColor}`} />
                    </div>
                    <CardTitle className="text-sm font-bold text-foreground">
                      {mod.title}
                    </CardTitle>
                  </div>
                  <Badge variant={mod.statusVariant} className="text-2xs shrink-0">
                    {mod.statusBadge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {mod.description}
                </p>

                <div className="rounded-lg bg-muted/40 p-2.5 text-xs space-y-1 border border-border/50">
                  <div className="flex items-center justify-between text-2xs text-muted-foreground">
                    <span>Assigned Responsibilities:</span>
                    <strong className="text-foreground font-semibold">{mod.assignedRole}</strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-foreground font-medium pt-0.5">
                    <CheckCircle2 className="size-3 text-primary shrink-0" />
                    <span className="truncate">{mod.activeItems}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Link
                    to={mod.link as any}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>Open Module Workspace</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
