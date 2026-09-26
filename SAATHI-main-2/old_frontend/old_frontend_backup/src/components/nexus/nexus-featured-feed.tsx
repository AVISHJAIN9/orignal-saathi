import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowUpRight,
  CheckCircle2,
  Eye,
  HelpCircle,
  MessageSquare,
  Scroll,
  ShieldCheck,
  Tag,
} from "lucide-react";

import { MOCK_FORUM_POSTS, type VerificationStatus } from "@/lib/mock-forum";
import { cn } from "@/lib/utils";

interface NexusFeaturedFeedProps {
  onSelectPost?: (postId: string) => void;
}

// Amber is reserved elsewhere in this app for warning/attention states (see
// C3/C4 status badges and the classification wizard's safety-critical
// callout) — "discussed" reuses it here only because that's genuinely an
// attention-worthy state (an active, unresolved thread), not as a generic
// accent for the section.
const STATUS_CONFIG: Record<
  VerificationStatus,
  { labelKey: string; icon: typeof ShieldCheck; badgeClass: string }
> = {
  expert_verified: {
    labelKey: "status.expert_verified",
    icon: ShieldCheck,
    badgeClass:
      "border-emerald-700/30 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  verified: {
    labelKey: "status.verified",
    icon: CheckCircle2,
    badgeClass:
      "border-sky-700/30 bg-sky-50 text-sky-800 dark:border-sky-500/30 dark:bg-sky-950/50 dark:text-sky-300",
  },
  discussed: {
    labelKey: "status.discussed",
    icon: MessageSquare,
    badgeClass:
      "border-amber-700/30 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/50 dark:text-amber-300",
  },
  open: {
    labelKey: "status.open",
    icon: HelpCircle,
    badgeClass:
      "border-purple-700/30 bg-purple-50 text-purple-800 dark:border-purple-500/30 dark:bg-purple-950/50 dark:text-purple-300",
  },
};

export function NexusFeaturedFeed({ onSelectPost }: NexusFeaturedFeedProps) {
  const { t } = useTranslation("nexus");
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-post-id");
            if (id) {
              setRevealedIds((prev) => new Set(prev).add(id));
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    const cards = containerRef.current?.querySelectorAll("[data-post-id]");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="nexus-feed"
      ref={containerRef}
      className="relative w-full bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8"
    >
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 border-b border-border pb-6 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-primary uppercase">
              <Scroll className="size-3.5" />
              <span>{t("featuredFeed.eyebrow")}</span>
            </div>
            <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("featuredFeed.heading")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {t("featuredFeed.description")}
            </p>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            {t("featuredFeed.count", { count: MOCK_FORUM_POSTS.length })}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {MOCK_FORUM_POSTS.map((post, index) => {
            const status = STATUS_CONFIG[post.verificationStatus];
            const StatusIcon = status.icon;
            const isRevealed = revealedIds.has(post.id);

            return (
              <article
                key={post.id}
                data-post-id={post.id}
                onClick={() => onSelectPost?.(post.id)}
                className={cn(
                  "group relative cursor-pointer rounded-xl border border-border bg-card p-6 shadow-xs transition-all duration-500 hover:border-primary/40 hover:shadow-md",
                  isRevealed
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0",
                )}
                style={{ transitionDelay: `${(index % 3) * 80}ms` }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                        status.badgeClass,
                      )}
                    >
                      <StatusIcon className="size-3.5" />
                      <span>{t(status.labelKey)}</span>
                    </span>

                    <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="size-3.5" />
                        {post.repliesCount} {t("post.replies")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="size-3.5" />
                        {post.viewsCount} {t("post.views")}
                      </span>
                      <span>{post.date}</span>
                    </div>
                  </div>

                  <h3 className="flex items-start justify-between gap-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary sm:text-xl">
                    <span>{post.title}</span>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </h3>

                  <p className="text-sm leading-relaxed text-foreground/80">
                    {post.excerpt}
                  </p>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <Tag className="mr-1 size-3 text-muted-foreground" />
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border/80 pt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 font-mono font-bold text-primary">
                        {post.authorName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">
                          {post.authorName}
                        </span>
                        <span className="mx-1.5 text-muted-foreground/60">
                          •
                        </span>
                        <span>{post.authorRole}</span>
                        {post.authorOrg && (
                          <>
                            <span className="mx-1 text-muted-foreground/60">
                              @
                            </span>
                            <span className="font-medium text-foreground/80">
                              {post.authorOrg}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <span className="font-mono text-[11px] font-semibold tracking-wider text-primary uppercase group-hover:underline">
                      {t("featuredFeed.inspect")}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
