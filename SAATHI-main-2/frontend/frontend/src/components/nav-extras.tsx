import {
  Bookmark,
  BarChart3,
  BookOpen,
  ClipboardPlus,
  FileScan,
  FileText,
  FlaskConical,
  LayoutDashboard,
  MessagesSquare,
  PackageSearch,
  Radar,
  RefreshCw,
  Rss,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router-compat";

import { useRole } from "@/lib/role";

const linkClassName =
  "elevation-lift flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-[color,background-color,box-shadow,transform,translate] duration-[240ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] hover:translate-x-0.5 hover:bg-muted hover:text-foreground";

/** Extra navigation links, role-gated to prove role-gated nav without real
 * auth. Notifications lives in the header bell (see NotificationBell)
 * instead of here now — it's available to every logged-in role from there,
 * so it doesn't need its own entry in this role-gated list. */
export function NavExtras() {
  const { t } = useTranslation("chat");
  const { role } = useRole();

  return (
    <>
      {/* Knowledge Nexus and Compliance Vault are general-purpose, not
       * applicant-specific workflow tools — unlike everything below, both
       * are available to every signed-in role, including "public". */}
      {role !== null && (
        <>
          <Link to="/knowledge-nexus" className={linkClassName}>
            <MessagesSquare className="size-4" />
            {t("nav.knowledgeNexus")}
          </Link>
          <Link to="/vault" className={linkClassName}>
            <Bookmark className="size-4" />
            {t("nav.vault")}
          </Link>
          <Link to="/grievance" className={linkClassName}>
            <ShieldCheck className="size-4" />
            {t("nav.grievance")}
          </Link>
        </>
      )}
      {(role === "industry" || role === "admin") && (
        <>
          <Link to="/dashboard" className={linkClassName}>
            <LayoutDashboard className="size-4" />
            {t("nav.dashboard")}
          </Link>
          <Link to="/standards" className={linkClassName}>
            <BookOpen className="size-4" />
            {t("nav.standardsBrowser")}
          </Link>
          <Link to="/classification" className={linkClassName}>
            <PackageSearch className="size-4" />
            {t("nav.classification")}
          </Link>
          <Link to="/conformity" className={linkClassName}>
            <ScanSearch className="size-4" />
            {t("nav.conformityCheck")}
          </Link>
          <Link to="/register" className={linkClassName}>
            <ClipboardPlus className="size-4" />
            {t("nav.newApplication")}
          </Link>
          <Link to="/document-cortex" className={linkClassName}>
            <FileScan className="size-4" />
            {t("nav.documentCortex")}
          </Link>
          <Link to="/regulatory-radar" className={linkClassName}>
            <Radar className="size-4" />
            {t("nav.regulatoryRadar")}
          </Link>
          <Link to="/intel-feed" className={linkClassName}>
            <Rss className="size-4" />
            {t("nav.intelFeed")}
          </Link>
          <Link to="/renewals" className={linkClassName}>
            <RefreshCw className="size-4" />
            {t("nav.annualRenewal")}
          </Link>
          <Link to="/sample-tracker" className={linkClassName}>
            <FlaskConical className="size-4" />
            {t("nav.sampleTracker")}
          </Link>
          {role === "admin" && (
            <>
              <Link to="/admin" className={linkClassName}>
                <BarChart3 className="size-4" />
                {t("nav.adminPanel")}
              </Link>
              <Link to="/admin/documents" className={linkClassName}>
                <FileText className="size-4" />
                {t("nav.documentManagement")}
              </Link>
            </>
          )}
        </>
      )}
    </>
  );
}
