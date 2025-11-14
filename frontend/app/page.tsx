"use client";

import { useEffect, useState } from "react";
import { postsApi } from "@/lib/api";
import { auth } from "@/lib/auth";
import type { Post } from "@/types";
import Link from "next/link";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    setIsAuthenticated(auth.isAuthenticated());

    // Fetch posts
    async function fetchPosts() {
      try {
        setLoading(true);
        const data = await postsApi.getAll();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-red-500 text-lg mb-2 font-semibold">
            Error: {error}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Make sure your backend is running on http://localhost:3001
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Reddit Clone</h1>
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
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">No posts yet.</p>
            {isAuthenticated ? (
              <Link
                href="/create"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Create the first post!
              </Link>
            ) : (
              <p className="text-gray-500">
                <Link
                  href="/register"
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </Link>{" "}
                to create posts
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6"
              >
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
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                        {post.title}
                      </h2>
                    </div>

                    {post.content && (
                      <p className="text-gray-700 mb-3 line-clamp-2">
                        {post.content}
                      </p>
                    )}

                    {post.link && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(
                            post.link!,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                        className="text-blue-600 hover:underline mb-3 block text-sm text-left cursor-pointer"
                      >
                        🔗 {post.link}
                      </button>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
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
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
