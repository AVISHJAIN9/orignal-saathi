import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  FileText,
  Trash2,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { ENTRANCE_TRANSITION } from "@/lib/motion";
import type { VaultItem } from "@/lib/mock-vault";

interface VaultItemDetailProps {
  item: VaultItem;
  onBack: () => void;
  onRemove: (item: VaultItem) => void;
}

export function VaultItemDetail({
  item,
  onBack,
  onRemove,
}: VaultItemDetailProps) {
  const { t } = useTranslation(["vault", "standards", "admin", "cortex"]);
  const prefersReducedMotion = useReducedMotion();

  const title =
    item.kind === "standard"
      ? t(`standards:list.${item.standard.key}`)
      : t(`cortex:results.${item.document.resultKey}.product`);

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={ENTRANCE_TRANSITION}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="gap-2 rounded-xl"
        >
          <ArrowLeft className="size-4" />
          {t("detail.back")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(item)}
          className="gap-2 rounded-xl text-destructive hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
          {t("item.remove")}
        </Button>
      </div>

      <article className="elevation-2 flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {item.kind === "standard" ? (
              <BookOpen className="size-4" aria-hidden />
            ) : (
              <FileText className="size-4" aria-hidden />
            )}
          </span>
          <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 font-mono text-2xs font-medium text-muted-foreground uppercase">
            {item.kind === "standard"
              ? t("item.standardBadge")
              : t("item.documentBadge")}
          </span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h1>

        {item.kind === "standard" ? (
          <>
            <dl className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-muted/20 p-4">
              <div>
                <dt className="text-xs text-muted-foreground">
                  {t("detail.standardNumberLabel")}
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {item.standard.standardNumber}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  {t("detail.categoryLabel")}
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {t(`admin:topics.${item.standard.categoryKey}`)}
                </dd>
              </div>
            </dl>
            <p className="text-sm leading-relaxed text-foreground/90">
              {t(`standards:descriptions.${item.standard.key}`)}
            </p>
            <Link
              to={`/standards/${item.standard.key}`}
              className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t("item.viewStandard")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </>
        ) : (
          <>
            <dl className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-muted/20 p-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">
                  {t("detail.fileNameLabel")}
                </dt>
                <dd className="text-sm font-medium break-words text-foreground">
                  {item.document.fileName}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  {t("detail.savedLabel")}
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {new Date(item.document.savedAt).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )}
                </dd>
              </div>
            </dl>
            <Link
              to="/document-cortex"
              className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t("item.viewInCortex")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </>
        )}
      </article>
    </motion.div>
  );
}
