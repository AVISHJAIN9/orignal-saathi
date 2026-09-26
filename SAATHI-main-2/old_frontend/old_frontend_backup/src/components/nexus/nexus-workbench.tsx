import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "motion/react";

import {
  MOCK_FORUM_POSTS,
  type ForumCategory,
  type ForumPost,
  type ForumReply,
} from "@/lib/mock-forum";
import { useAuth } from "@/lib/auth";
import { useUserProfile } from "@/hooks/use-user-profile";
import { NexusHeader } from "./nexus-header";
import { NexusFilters } from "./nexus-filters";
import { NexusPostCard } from "./nexus-post-card";
import { NexusPostDetail } from "./nexus-post-detail";
import {
  NexusAskDialog,
  type NexusAskDialogSubmission,
} from "./nexus-ask-dialog";

export function NexusWorkbench() {
  const { t } = useTranslation("nexus");
  const { currentUser } = useAuth();
  const { profile } = useUserProfile();

  const [posts, setPosts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ForumCategory>("all");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [askDialogOpen, setAskDialogOpen] = useState(false);

  const categoryCounts = useMemo(() => {
    const counts: Record<ForumCategory, number> = {
      all: posts.length,
      standards: 0,
      conformity: 0,
      testing: 0,
      certification: 0,
      regulatory: 0,
      implementation: 0,
      open: 0,
    };

    posts.forEach((p) => {
      counts[p.category]++;
      if (p.verificationStatus === "open") {
        counts.open++;
      }
    });

    return counts;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (activeCategory === "open") {
      result = result.filter((p) => p.verificationStatus === "open");
    } else if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          p.authorName.toLowerCase().includes(q),
      );
    }

    return result;
  }, [posts, activeCategory, searchQuery]);

  const selectedPost = useMemo(() => {
    if (!selectedPostId) return null;
    return posts.find((p) => p.id === selectedPostId) ?? null;
  }, [posts, selectedPostId]);

  function handleToggleBookmark(postId: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p,
      ),
    );
  }

  function handleHelpfulVote(postId: string, replyId: string) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          replies: p.replies.map((r) => {
            if (r.id !== replyId) return r;
            const isUpvoted = !!r.hasUserUpvoted;
            return {
              ...r,
              hasUserUpvoted: !isUpvoted,
              helpfulCount: isUpvoted ? r.helpfulCount - 1 : r.helpfulCount + 1,
            };
          }),
        };
      }),
    );
  }

  function handleAddReply(postId: string, content: string) {
    const newReply: ForumReply = {
      id: `reply-${Date.now()}`,
      authorName: currentUser?.name ?? t("post.you"),
      authorRole: t("post.you"),
      authorAvatarTone: profile.tone,
      isVerifiedExpert: false,
      content,
      timestamp: t("post.justNow"),
      helpfulCount: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          repliesCount: p.repliesCount + 1,
          verificationStatus:
            p.verificationStatus === "open"
              ? "discussed"
              : p.verificationStatus,
          replies: [...p.replies, newReply],
        };
      }),
    );
  }

  function handleAddPost(submission: NexusAskDialogSubmission) {
    const newPost: ForumPost = {
      id: `nexus-${Date.now()}`,
      title: submission.title,
      excerpt:
        submission.content.length > 140
          ? `${submission.content.slice(0, 140)}…`
          : submission.content,
      content: submission.content,
      authorName: currentUser?.name ?? t("post.you"),
      authorRole: t("post.you"),
      authorAvatarTone: profile.tone,
      date: t("post.justNow"),
      category: submission.category,
      verificationStatus: "open",
      repliesCount: 0,
      viewsCount: 1,
      tags:
        submission.tags.length > 0 ? submission.tags : [t("post.generalTag")],
      replies: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setSelectedPostId(newPost.id);
  }

  return (
    <div className="flex flex-col gap-6">
      {selectedPost ? (
        <NexusPostDetail
          post={selectedPost}
          onBack={() => setSelectedPostId(null)}
          onAddReply={handleAddReply}
          onToggleBookmark={handleToggleBookmark}
          onHelpfulVote={handleHelpfulVote}
        />
      ) : (
        <>
          <NexusHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenAskDialog={() => setAskDialogOpen(true)}
          />

          <NexusFilters
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            categoryCounts={categoryCounts}
          />

          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
              <p className="text-sm font-medium text-foreground">
                {t("noResults.title")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("noResults.description")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, index) => (
                  <NexusPostCard
                    key={post.id}
                    post={post}
                    index={index}
                    onSelect={(id) => setSelectedPostId(id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      <NexusAskDialog
        open={askDialogOpen}
        onOpenChange={setAskDialogOpen}
        onSubmit={handleAddPost}
      />
    </div>
  );
}
