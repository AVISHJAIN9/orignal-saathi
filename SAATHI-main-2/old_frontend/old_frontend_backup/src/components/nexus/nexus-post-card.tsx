import type { MouseEvent, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import {
  Bookmark,
  CheckCircle2,
  Clock,
  Eye,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import type { ForumPost } from "@/lib/mock-forum";
import { cn } from "@/lib/utils";

interface NexusPostCardProps {
  post: ForumPost;
  onSelect: (id: string) => void;
  onToggleBookmark: (id: string, e: MouseEvent) => void;
  index?: number;
}

const CATEGORY_TINTS: Record<string, { leftBorder: string; washBg: string }> = {
  standards: {
    leftBorder: "border-l-4 border-l-sky-500",
    washBg: "bg-gradient-to-r from-sky-500/[0.04] via-transparent to-card",
  },
  conformity: {
    leftBorder: "border-l-4 border-l-emerald-500",
    washBg: "bg-gradient-to-r from-emerald-500/[0.04] via-transparent to-card",
  },
  testing: {
    leftBorder: "border-l-4 border-l-purple-500",
    washBg: "bg-gradient-to-r from-purple-500/[0.04] via-transparent to-card",
  },
  certification: {
    leftBorder: "border-l-4 border-l-primary",
    washBg: "bg-gradient-to-r from-primary/[0.04] via-transparent to-card",
  },
  regulatory: {
    leftBorder: "border-l-4 border-l-amber-500",
    washBg: "bg-gradient-to-r from-amber-500/[0.05] via-transparent to-card",
  },
  implementation: {
    leftBorder: "border-l-4 border-l-teal-500",
    washBg: "bg-gradient-to-r from-teal-500/[0.04] via-transparent to-card",
  },
};

export function NexusPostCard({
  post,
  onSelect,
  onToggleBookmark,
  index = 0,
}: NexusPostCardProps) {
  const { t } = useTranslation("nexus");

  const statusStyles: Record<
    ForumPost["verificationStatus"],
    { labelKey: string; className: string; icon: ReactNode }
  > = {
    open: {
      labelKey: "status.open",
      className:
        "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono text-[0.65rem] font-bold uppercase",
      icon: <Clock className="size-3" />,
    },
    discussed: {
      labelKey: "status.discussed",
      className:
        "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300 font-mono text-[0.65rem] font-bold uppercase",
      icon: <MessageSquare className="size-3" />,
    },
    verified: {
      labelKey: "status.verified",
      className:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-[0.65rem] font-bold uppercase",
      icon: <CheckCircle2 className="size-3" />,
    },
    expert_verified: {
      labelKey: "status.expert_verified",
      className:
        "border-primary/40 bg-primary/10 text-primary font-mono text-[0.65rem] font-bold uppercase",
      icon: <Sparkles className="size-3" />,
    },
  };

  const statusInfo = statusStyles[post.verificationStatus];
  const tint = CATEGORY_TINTS[post.category] || CATEGORY_TINTS["standards"];

  const toneClass =
    post.authorAvatarTone === "navy"
      ? "bg-primary text-primary-foreground"
      : post.authorAvatarTone === "sage"
        ? "bg-emerald-600 text-white"
        : "bg-amber-600 text-white";

  const authorInitials = post.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 24,
        delay: Math.min(index * 0.04, 0.25),
      }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      onClick={() => onSelect(post.id)}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-3.5 overflow-hidden rounded-xl border border-border/80 bg-card p-6 shadow-[var(--shadow-elevation-1)] transition-all duration-200 hover:border-primary/40 hover:shadow-lg",
        tint.leftBorder,
        tint.washBg,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 ${statusInfo.className}`}
          >
            {statusInfo.icon}
            {t(statusInfo.labelKey)}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="font-mono text-xs text-muted-foreground">
            {post.date}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(post.id, e);
          }}
          className={`rounded-lg p-2 transition-all duration-150 active:scale-90 ${
            post.isBookmarked
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title={post.isBookmarked ? t("post.bookmarked") : t("post.bookmark")}
        >
          <Bookmark
            className={`size-4 ${post.isBookmarked ? "fill-primary text-primary" : ""}`}
          />
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <h2 className="text-base leading-snug font-bold text-foreground transition-colors group-hover:text-primary">
          {post.title}
        </h2>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {post.excerpt}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-1 flex flex-col justify-between gap-3 border-t border-border/60 pt-3.5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-xs ${toneClass}`}
          >
            {authorInitials}
          </div>
          <div className="flex flex-col">
            <span className="text-xs leading-tight font-bold text-foreground">
              {post.authorName}
            </span>
            <span className="text-[11px] leading-tight text-muted-foreground">
              {post.authorRole}
              {post.authorOrg ? ` • ${post.authorOrg}` : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageSquare className="size-3.5" />
            <span>
              {post.repliesCount} {t("post.replies")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="size-3.5" />
            <span>
              {post.viewsCount} {t("post.views")}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
