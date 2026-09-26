import { BookOpen, FileText, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { VaultItem } from "@/lib/mock-vault";

interface VaultItemCardProps {
  item: VaultItem;
  onSelect: (id: string) => void;
  onRemove: (item: VaultItem) => void;
}

export function VaultItemCard({
  item,
  onSelect,
  onRemove,
}: VaultItemCardProps) {
  const { t } = useTranslation(["vault", "standards", "admin", "cortex"]);

  const title =
    item.kind === "standard"
      ? t(`standards:list.${item.standard.key}`)
      : t(`cortex:results.${item.document.resultKey}.product`);

  const subtitle =
    item.kind === "standard"
      ? `${item.standard.standardNumber} · ${t(`admin:topics.${item.standard.categoryKey}`)}`
      : item.document.fileName;

  const savedDate =
    item.kind === "document"
      ? new Date(item.document.savedAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : null;

  return (
    <article
      onClick={() => onSelect(item.id)}
      className="group flex cursor-pointer flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {item.kind === "standard" ? (
              <BookOpen className="size-4" aria-hidden />
            ) : (
              <FileText className="size-4" aria-hidden />
            )}
          </span>
          <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground uppercase">
            {item.kind === "standard"
              ? t("item.standardBadge")
              : t("item.documentBadge")}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item);
          }}
          aria-label={t("item.removeAriaLabel", { title })}
          title={t("item.remove")}
          className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted hover:text-foreground focus-visible:opacity-100"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {title}
        </h2>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>

      {savedDate && (
        <p className="text-[11px] text-muted-foreground">
          {t("item.savedOn", { date: savedDate })}
        </p>
      )}
    </article>
  );
}
