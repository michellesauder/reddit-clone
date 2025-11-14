"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { postsApi, commentsApi } from "@/lib/api";
import { auth } from "@/lib/auth";
import type { Post, Comment } from "@/types";
import Link from "next/link";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated());
    fetchPostAndComments();
  }, [postId]);

  async function fetchPostAndComments() {
    try {
      setLoading(true);
      const [postData, commentsData] = await Promise.all([
        postsApi.getOne(postId),
        commentsApi.getByPost(postId),
      ]);
      setPost(postData);
      setComments(commentsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load post");
      console.error("Error fetching post:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitComment(e: React.FormEvent, parentId?: string) {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const content = parentId ? replyContent[parentId] : commentContent;
    if (!content.trim()) return;

    try {
      await commentsApi.create(postId, content, parentId);
      setCommentContent("");
      if (parentId) {
        setReplyContent({ ...replyContent, [parentId]: "" });
        setReplyingTo(null);
      }
      // Refresh comments
      const commentsData = await commentsApi.getByPost(postId);
      setComments(commentsData);
    } catch (err) {
      console.error("Error creating comment:", err);
      alert("Failed to create comment. Please try again.");
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Recursive component to render nested comments
  function CommentItem({
    comment,
    depth = 0,
  }: {
    comment: Comment;
    depth?: number;
  }) {
    const isReplying = replyingTo === comment.id;
    const maxDepth = 5; // Limit nesting depth

    return (
      <div
        className={`${
          depth > 0 ? "ml-8 mt-4 border-l-2 border-gray-200 pl-4" : ""
        }`}
      >
        <div className="bg-gray-50 rounded p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900">
                {comment.author.username}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
            </div>
          </div>
          <p className="text-gray-700 mb-3 whitespace-pre-wrap">
            {comment.content}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">
              ⬆️ {comment._count.votes} votes
            </span>
            {isAuthenticated && depth < maxDepth && (
              <button
                onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                className="text-xs text-blue-600 hover:underline"
              >
                {isReplying ? "Cancel" : "Reply"}
              </button>
            )}
          </div>

          {/* Reply form */}
          {isReplying && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmitComment(e, comment.id);
              }}
              className="mt-4"
              onClick={(e) => e.stopPropagation()}
            >
              <textarea
                value={replyContent[comment.id] || ""}
                onChange={(e) => {
                  e.stopPropagation();
                  setReplyContent({
                    ...replyContent,
                    [comment.id]: e.target.value,
                  });
                }}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Write a reply..."
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                required
                autoFocus
                spellCheck={false}
                autoComplete="off"
                dir="ltr"
                style={{ direction: "ltr", textAlign: "left" }}
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Post Reply
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setReplyingTo(null);
                    setReplyContent({ ...replyContent, [comment.id]: "" });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-red-500 text-lg mb-2 font-semibold">
            {error || "Post not found"}
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 hover:text-blue-600"
          >
            Reddit Clone
          </Link>
          <div className="flex gap-4 items-center">
            {isAuthenticated ? (
              <>
                <Link
                  href="/create"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Create Post
                </Link>
                <button
                  onClick={() => {
                    auth.removeToken();
                    setIsAuthenticated(false);
                    window.location.reload();
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Post */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            {/* Vote indicator placeholder */}
            <div className="flex flex-col items-center pt-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Implement voting
                }}
                className="text-gray-400 hover:text-orange-500"
              >
                ▲
              </button>
              <span className="text-xs font-semibold text-gray-600">
                {post._count.votes}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Implement voting
                }}
                className="text-gray-400 hover:text-blue-500"
              >
                ▼
              </button>
            </div>

            {/* Post content */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              {post.content && (
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>
              )}

              {post.link && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(post.link!, "_blank", "noopener,noreferrer");
                  }}
                  className="text-blue-600 hover:underline mb-4 block text-sm text-left cursor-pointer"
                >
                  🔗 {post.link}
                </button>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-200">
                <span>Posted by {post.author.username}</span>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  💬 {post._count.comments} comments
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Form */}
        {isAuthenticated ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Add a comment</h2>
            <form onSubmit={(e) => handleSubmitComment(e)}>
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="What are your thoughts?"
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
              <button
                type="submit"
                className="mt-3 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Comment
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 text-center">
            <p className="text-gray-600 mb-2">
              <Link href="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>{" "}
              or{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                sign up
              </Link>{" "}
              to leave a comment
            </p>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">
            {comments.length === 0
              ? "No comments yet"
              : `${comments.length} Comments`}
          </h2>
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
