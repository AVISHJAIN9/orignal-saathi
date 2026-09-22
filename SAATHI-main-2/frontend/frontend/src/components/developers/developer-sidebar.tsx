import {
  AlertTriangle,
  BookOpen,
  Bot,
  FileSearch,
  FileText,
  Gauge,
  History,
  Key,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { API_SECTIONS } from "@/lib/developer-data";

interface DeveloperSidebarProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Key,
  Zap,
  Bot,
  FileText,
  ShieldCheck,
  FileSearch,
  AlertTriangle,
  Gauge,
  History,
};

export function DeveloperSidebar({
  activeSection,
  onSelectSection,
}: DeveloperSidebarProps) {
  const { t } = useTranslation("developers");

  return (
    <aside className="flex w-full shrink-0 flex-col gap-1 rounded-2xl border border-border bg-card/70 p-3 backdrop-blur-md md:w-64">
      <div className="mb-1 border-b border-border/80 px-3 py-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
        {t("docIndex")}
      </div>

      <nav className="flex flex-col gap-1">
        {API_SECTIONS.map((sec) => {
          const Icon = ICON_MAP[sec.icon] ?? BookOpen;
          const isActive = activeSection === sec.id;

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onSelectSection(sec.id)}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium transition-all ${
                isActive
                  ? "bg-primary font-semibold text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span>{t(sec.titleKey)}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
