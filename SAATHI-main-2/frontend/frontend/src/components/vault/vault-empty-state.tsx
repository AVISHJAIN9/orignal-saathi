import { BookOpen, FileScan } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Link } from "@/lib/router-compat";

export function VaultEmptyState() {
  const { t } = useTranslation("vault");

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center">
      <p className="text-sm font-medium text-foreground">{t("empty.title")}</p>
      <p className="max-w-sm text-xs text-muted-foreground">
        {t("empty.description")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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
    </div>
  );
}
