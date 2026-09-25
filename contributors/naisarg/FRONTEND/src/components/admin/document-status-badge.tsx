import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import type { DocumentStatus } from "@/lib/mock-documents";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<DocumentStatus, string> = {
  queued: "bg-muted text-muted-foreground",
  processing: "bg-secondary text-secondary-foreground",
  indexed: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  failed: "bg-destructive/10 text-destructive",
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const { t } = useTranslation("admin");

  return (
    <Badge variant="outline" className={cn("gap-1 border-transparent", STATUS_STYLES[status])}>
      {status === "processing" && <Loader2 className="size-3 animate-spin" />}
      {t(`documents.status.${status}`)}
    </Badge>
  );
}
