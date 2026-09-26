import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ForumPost } from "@/lib/mock-forum";

export interface NexusAskDialogSubmission {
  title: string;
  category: ForumPost["category"];
  content: string;
  tags: string[];
}

interface NexusAskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (submission: NexusAskDialogSubmission) => void;
}

const CATEGORY_OPTIONS: { id: ForumPost["category"]; labelKey: string }[] = [
  { id: "standards", labelKey: "filters.standards" },
  { id: "conformity", labelKey: "filters.conformity" },
  { id: "testing", labelKey: "filters.testing" },
  { id: "certification", labelKey: "filters.certification" },
  { id: "regulatory", labelKey: "filters.regulatory" },
  { id: "implementation", labelKey: "filters.implementation" },
];

export function NexusAskDialog({
  open,
  onOpenChange,
  onSubmit,
}: NexusAskDialogProps) {
  const { t } = useTranslation("nexus");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ForumPost["category"]>("standards");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const parsedTags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      category,
      content: content.trim(),
      tags: parsedTags,
    });

    setTitle("");
    setCategory("standards");
    setContent("");
    setTagsInput("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            {t("askDialog.title")}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {t("askDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="q-title" className="text-xs font-semibold">
              {t("askDialog.questionTitle")} *
            </Label>
            <Input
              id="q-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("askDialog.questionTitlePlaceholder")}
              required
              className="text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="q-cat" className="text-xs font-semibold">
              {t("askDialog.category")} *
            </Label>
            <select
              id="q-cat"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as ForumPost["category"])
              }
              className="h-10 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {t(c.labelKey)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="q-content" className="text-xs font-semibold">
              {t("askDialog.content")} *
            </Label>
            <Textarea
              id="q-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("askDialog.contentPlaceholder")}
              rows={4}
              required
              className="resize-none text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="q-tags" className="text-xs font-semibold">
              {t("askDialog.tags")}
            </Label>
            <Input
              id="q-tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder={t("askDialog.tagsPlaceholder")}
              className="text-sm"
            />
          </div>

          <DialogFooter className="gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("askDialog.cancel")}
            </Button>
            <Button type="submit" disabled={!title.trim() || !content.trim()}>
              {t("askDialog.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
