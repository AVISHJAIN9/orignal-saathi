import { useState, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  Sparkles,
  ThumbsUp,
} from "lucide-react";

import type { ForumPost, ForumReply } from "@/lib/mock-forum";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface NexusPostDetailProps {
  post: ForumPost;
  onBack: () => void;
  onAddReply: (postId: string, replyContent: string) => void;
  onToggleBookmark: (postId: string) => void;
  onHelpfulVote: (postId: string, replyId: string) => void;
}

function avatarToneClass(tone: ForumPost["authorAvatarTone"]): string {
  if (tone === "navy") return "bg-primary text-primary-foreground";
  if (tone === "sage") return "bg-emerald-600 text-white";
  return "bg-amber-600 text-white";
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export function NexusPostDetail({
  post,
  onBack,
  onAddReply,
  onToggleBookmark,
  onHelpfulVote,
}: NexusPostDetailProps) {
  const { t } = useTranslation("nexus");
  const [replyText, setReplyText] = useState("");

  const statusStyles: Record<
    ForumPost["verificationStatus"],
    { labelKey: string; className: string; icon: ReactNode }
  > = {
    open: {
      labelKey: "status.open",
      className:
        "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      icon: <Clock className="size-3" />,
    },
    discussed: {
      labelKey: "status.discussed",
      className:
        "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400",
      icon: <MessageSquare className="size-3" />,
    },
    verified: {
      labelKey: "status.verified",
      className:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      icon: <CheckCircle2 className="size-3" />,
    },
    expert_verified: {
      labelKey: "status.expert_verified",
      className: "border-primary/30 bg-primary/10 text-primary",
      icon: <Sparkles className="size-3" />,
    },
  };

  const statusInfo = statusStyles[post.verificationStatus];

  function handleSubmitReply(e: FormEvent) {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddReply(post.id, replyText.trim());
    setReplyText("");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="gap-2 rounded-xl"
        >
          <ArrowLeft className="size-4" />
          {t("backToList")}
        </Button>

        <Button
          variant={post.isBookmarked ? "default" : "outline"}
          size="sm"
          onClick={() => onToggleBookmark(post.id)}
          className="gap-2 rounded-xl"
        >
          <Bookmark
            className={`size-3.5 ${post.isBookmarked ? "fill-current" : ""}`}
          />
          {post.isBookmarked ? t("post.bookmarked") : t("post.bookmark")}
        </Button>
      </div>

      <article className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold ${statusInfo.className}`}
          >
            {statusInfo.icon}
            {t(statusInfo.labelKey)}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{post.date}</span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3.5">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarToneClass(post.authorAvatarTone)}`}
          >
            {initialsOf(post.authorName)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {post.authorName}
            </span>
            <span className="text-xs text-muted-foreground">
              {post.authorRole}
              {post.authorOrg ? ` • ${post.authorOrg}` : ""}
            </span>
          </div>
        </div>

        <div className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
          {post.content}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-xs text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      </article>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">
            {post.replies.length} {t("post.replies")}
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {post.replies.map((reply: ForumReply) => (
            <div
              key={reply.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-xs"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarToneClass(reply.authorAvatarTone)}`}
                  >
                    {initialsOf(reply.authorName)}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">
                        {reply.authorName}
                      </span>
                      {reply.isVerifiedExpert && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.2 text-[10px] font-semibold text-primary">
                          <Sparkles className="size-2.5" />
                          {t("post.expertBadge")}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {reply.authorRole}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-xs text-muted-foreground">
                  {reply.timestamp}
                </span>
              </div>

              <p className="text-xs leading-relaxed whitespace-pre-line text-foreground/90 sm:text-sm">
                {reply.content}
              </p>

              {reply.citations && reply.citations.length > 0 && (
                <div className="mt-1 flex flex-col gap-1.5 rounded-xl border border-primary/20 bg-primary/5 p-3">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-primary">
                    <BookOpen className="size-3.5" />
                    {t("post.citations")}
                  </span>
                  <div className="flex flex-col gap-1">
                    {reply.citations.map((c, i) => (
                      <div
                        key={i}
                        className="text-xs font-medium text-foreground/80"
                      >
                        <span className="mr-2 font-mono font-bold text-primary">
                          {c.code}
                        </span>
                        <span>{c.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-1 flex items-center justify-between border-t border-border/60 pt-3">
                <button
                  type="button"
                  onClick={() => onHelpfulVote(post.id, reply.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    reply.hasUserUpvoted
                      ? "bg-emerald-500/15 font-semibold text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <ThumbsUp
                    className={`size-3.5 ${reply.hasUserUpvoted ? "fill-current" : ""}`}
                  />
                  <span>
                    {t("post.helpful")} ({reply.helpfulCount})
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmitReply}
          className="mt-2 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              {t("post.writeReply")}
            </h3>
          </div>

          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={t("post.replyPlaceholder")}
            rows={4}
            className="resize-none bg-background text-sm"
          />

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              disabled={!replyText.trim()}
              className="gap-2 rounded-xl"
            >
              <Send className="size-4" />
              {t("post.postReply")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
