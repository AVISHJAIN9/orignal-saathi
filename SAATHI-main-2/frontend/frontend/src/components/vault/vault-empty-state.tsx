import { BookOpen, FileScan } from "lucide-react";
import { useTranslation } from "react-i18next";

import { BisSeal } from "@/components/bis-marks";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Link } from "@/lib/router-compat";

export function VaultEmptyState() {
  const { t } = useTranslation("vault");

  return (
    <EmptyState
      icon={BisSeal}
      heading={t("empty.title")}
      body={t("empty.description")}
      action={
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Link
            to="/standards"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <BookOpen className="size-3.5" />
            {t("empty.browseStandards")}
          </Link>
          <Link
            to="/document-cortex"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <FileScan className="size-3.5" />
            {t("empty.openCortex")}
          </Link>
        </div>
      }
    />
  );
}
