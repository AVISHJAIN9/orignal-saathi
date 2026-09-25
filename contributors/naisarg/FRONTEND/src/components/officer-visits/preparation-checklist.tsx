import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ClipboardCheck,
  CheckCircle2,
  FileCheck2,
  FolderLock,
  GitMerge,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router-compat";
import type { PreparationChecklistItem, PreparationSummary } from "@/lib/officer-visits-api";

interface PreparationChecklistProps {
  items: PreparationChecklistItem[];
  summary?: PreparationSummary;
  onItemToggle?: (itemId: string, isReady: boolean) => void;
}

export function PreparationChecklist({
  items,
  summary,
  onItemToggle,
}: PreparationChecklistProps) {
  const { t } = useTranslation(["visits"]);
  const [localItems, setLocalItems] = useState<PreparationChecklistItem[]>(items);

  const handleToggle = (id: string) => {
    const updated = localItems.map((item) => {
      if (item.id === id) {
        const nextReady = !item.isReady;
        onItemToggle?.(id, nextReady);
        return { ...item, isReady: nextReady };
      }
      return item;
    });
    setLocalItems(updated);
  };

  const readyCount = localItems.filter((i) => i.isReady).length;
  const totalCount = localItems.length;
  const percentage = totalCount > 0 ? Math.round((readyCount / totalCount) * 100) : 0;

  const getCategoryLabel = (cat?: string) => {
    if (!cat) return t("visits:checklist.categories.general");
    switch (cat.toLowerCase()) {
      case "documents":
      case "document":
        return t("visits:checklist.categories.documents");
      case "testing":
      case "equipment":
        return t("visits:checklist.categories.testing");
      case "samples":
      case "sample":
        return t("visits:checklist.categories.samples");
      case "facility":
      case "manufacturing":
      case "premises":
        return t("visits:checklist.categories.facility");
      default:
        return cat;
    }
  };

  return (
    <Card className="rounded-2xl border border-border/50 bg-card/90 shadow-sm backdrop-blur-xl dark:border-border/50 dark:bg-card/80">
      <CardHeader className="flex flex-col gap-3 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ClipboardCheck className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground sm:text-xl">
                {t("visits:checklist.title")}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground sm:text-sm">
                {t("visits:checklist.subtitle")}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`font-mono text-xs font-semibold px-2.5 py-1 ${
                percentage === 100
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-primary/30 bg-primary/10 text-primary"
              }`}
            >
              {t("visits:checklist.readyFraction", { ready: readyCount, total: totalCount })}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t("visits:checklist.progressLabel")}</span>
            <span className="font-mono font-medium">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-0">
        {/* Checklist Item List */}
        <div className="flex flex-col divide-y divide-border/40 rounded-xl border border-border/60 bg-muted/20">
          {localItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className="group flex cursor-pointer items-start gap-3.5 p-3.5 transition-colors hover:bg-muted/40"
            >
              <Checkbox
                checked={item.isReady}
                onCheckedChange={() => handleToggle(item.id)}
                className="mt-0.5 size-4.5 rounded-md data-[state=checked]:bg-primary"
              />
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`text-xs font-semibold transition-colors sm:text-sm ${
                      item.isReady
                        ? "text-foreground line-through opacity-75"
                        : "text-foreground"
                    }`}
                  >
                    {item.title}
                  </span>
                  {item.category && (
                    <Badge variant="outline" className="text-2xs font-medium border-border/70 text-muted-foreground">
                      {getCategoryLabel(item.category)}
                    </Badge>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Links to Vault & Chain */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3 text-xs">
          <div className="flex flex-wrap gap-2">
            <Link to="/document-cortex">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-lg text-xs font-medium">
                <FolderLock className="size-3.5 text-primary" />
                {t("visits:checklist.openVault")}
                <ExternalLink className="size-3 text-muted-foreground" />
              </Button>
            </Link>
            <Link to="/compliance-chain">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-lg text-xs font-medium">
                <GitMerge className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                {t("visits:checklist.openChain")}
                <ExternalLink className="size-3 text-muted-foreground" />
              </Button>
            </Link>
          </div>

          {percentage === 100 && (
            <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
              <span>{t("visits:checklist.allReady")}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
