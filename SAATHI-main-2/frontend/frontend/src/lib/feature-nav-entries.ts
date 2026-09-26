import {
  Award,
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  CalendarCheck,
  ClipboardCheck,
  FileEdit,
  FileScan,
  FileText,
  FileWarning,
  FlaskConical,
  GitMerge,
  MessageCircle,
  OctagonAlert,
  Radar,
  Rss,
  Scale,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

// Single source of truth for the app's feature/module links — both
// src/components/app-header.tsx (the hamburger drawer on every non-landing
// page) and src/components/landing/landing-nav.tsx (the marketing "Tools &
// Services" menu) render from these same entries, so the two surfaces can't drift
// into listing different features, hrefs, or labels over time.
export interface FeatureNavEntry {
  to: string;
  labelKey: string;
  icon: LucideIcon;
  /** True if the destination hard-redirects a signed-out visitor back to
   * "/" (wrapped in <ProtectedRoute>) rather than gracefully degrading to
   * a role-required placeholder. Surfaced as a "Sign in required" badge on
   * the landing page's menu, where most visitors aren't signed in yet. */
  signInRequired?: boolean;
}

export interface FeatureNavSection {
  headingKey: string;
  entries: FeatureNavEntry[];
}

// Grouped by where each feature sits in the certification lifecycle, not by
// when it was added — keeps the list scannable as more modules land instead
// of growing as one flat, unordered stack.
export const CORE_ENTRIES: FeatureNavEntry[] = [
  { to: "/standards", labelKey: "nav.standardsBrowser", icon: BookOpen },
  { to: "/whatsapp", labelKey: "WhatsApp Bot [T1-27]", icon: MessageCircle },
  { to: "/conformity", labelKey: "nav.conformityCheck", icon: ScanSearch },
  { to: "/document-cortex", labelKey: "nav.documentCortex", icon: FileScan },
  { to: "/regulatory-radar", labelKey: "nav.regulatoryRadar", icon: Radar },
  { to: "/intel-feed", labelKey: "nav.intelFeed", icon: Rss },
];

export const LIFECYCLE_ENTRIES: FeatureNavEntry[] = [
  { to: "/registration/new", labelKey: "nav.newRegistration", icon: FileText },
  { to: "/officer-visits", labelKey: "nav.officerVisits", icon: CalendarCheck },
  { to: "/document-corrections", labelKey: "nav.documentCorrections", icon: FileEdit },
  { to: "/appeals", labelKey: "nav.appealsDisputes", icon: Scale },
  { to: "/business-account", labelKey: "nav.businessAccount", icon: Building2 },
  { to: "/certificates", labelKey: "nav.certificates", icon: Award },
  // renewals.index.tsx (what `to: "/renewals"` resolves to) is wrapped in
  // <ProtectedRoute> — a signed-out visitor is redirected straight back to
  // "/", not shown a graceful placeholder like the other lifecycle pages.
  { to: "/renewals", labelKey: "nav.renewalReminders", icon: Calendar, signInRequired: true },
  { to: "/calendar", labelKey: "nav.complianceCalendar", icon: Calendar },
  { to: "/factory-audits", labelKey: "nav.factoryAudits", icon: ClipboardCheck },
  { to: "/recalls", labelKey: "nav.recallsAlerts", icon: OctagonAlert },
  { to: "/license-actions", labelKey: "nav.licenseActions", icon: FileWarning },
  { to: "/invoices", labelKey: "nav.feeInvoices", icon: FileText },
  { to: "/locations", labelKey: "nav.manufacturingLocations", icon: Building2 },
];

export const TOOLS_ENTRIES: FeatureNavEntry[] = [
  { to: "/scheme-selector", labelKey: "nav.schemeSelector", icon: ShieldCheck },
  { to: "/compliance-chain", labelKey: "nav.complianceChain", icon: GitMerge },
  { to: "/laboratory-matcher", labelKey: "nav.laboratoryMatcher", icon: FlaskConical },
  { to: "/regulatory-alerts", labelKey: "nav.regulatoryAlerts", icon: ShieldAlert },
];

export const ADMIN_ENTRIES: FeatureNavEntry[] = [
  { to: "/admin", labelKey: "nav.adminPanel", icon: BarChart3 },
  { to: "/admin/documents", labelKey: "nav.documentManagement", icon: FileText },
  { to: "/admin/retrieval-quality", labelKey: "nav.retrievalQuality", icon: BarChart3 },
];

// Admin-only entries are deliberately excluded — neither the logged-out
// landing page menu nor (via this same list) any non-admin surface should
// list them. AppHeader still renders ADMIN_ENTRIES separately, gated on
// `role === "admin"`.
export const FEATURE_NAV_SECTIONS: FeatureNavSection[] = [
  { headingKey: "nav.sectionCore", entries: CORE_ENTRIES },
  { headingKey: "nav.sectionLifecycle", entries: LIFECYCLE_ENTRIES },
  { headingKey: "nav.sectionTools", entries: TOOLS_ENTRIES },
];
