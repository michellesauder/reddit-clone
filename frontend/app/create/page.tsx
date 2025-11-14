'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postsApi } from '@/lib/api';
import { auth } from '@/lib/auth';
import Link from 'next/link';

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [postType, setPostType] = useState<'text' | 'link'>('text');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (postType === 'text' && !content.trim()) {
      setError('Content is required for text posts');
      return;
    }

    if (postType === 'link' && !link.trim()) {
      setError('Link is required for link posts');
      return;
    }

    // Basic URL validation
    if (postType === 'link' && link.trim()) {
      try {
        new URL(link);
      } catch {
        setError('Please enter a valid URL (e.g., https://example.com)');
        return;
      }
    }

    setLoading(true);

    try {
      const postData = await postsApi.create(
        title.trim(),
        postType === 'text' ? content.trim() : undefined,
        postType === 'link' ? link.trim() : undefined
      );

      // Redirect to the new post
      router.push(`/posts/${postData.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post. Please try again.');
      console.error('Create post error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
            Reddit Clone
          </Link>
          <Link
            href="/"
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Cancel
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a post</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Post Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Type
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setPostType('text');
                    setLink('');
                  }}
                  className={`px-4 py-2 rounded-md ${
                    postType === 'text'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Text Post
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPostType('link');
                    setContent('');
                  }}
                  className={`px-4 py-2 rounded-md ${
                    postType === 'link'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Link Post
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Post title"
                maxLength={300}
              />
            </div>

            {/* Content (for text posts) */}
            {postType === 'text' && (
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="What's on your mind?"
                  rows={8}
                />
              </div>
            )}

            {/* Link (for link posts) */}
            {postType === 'link' && (
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                  URL *
                </label>
                <input
                  id="link"
                  type="url"
                  required
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter a valid URL (must start with http:// or https://)
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
              <Link
                href="/"
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
