'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const isOverLimit = wordCount > 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    if (isOverLimit) {
      setError('Content exceeds 500 word limit');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/blog/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          featuredImage,
          excerpt,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create post');
      }

      router.push('/admin/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-black border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors disabled:opacity-50";
  const labelClass = "block text-sm font-medium text-white/70 mb-2";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-white">Create Blog Post</h1>
          <p className="text-white/40 text-sm mt-1">Write and publish your story</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#111] border border-white/[0.08] rounded-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="title" className={labelClass}>Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              disabled={loading}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="excerpt" className={labelClass}>Excerpt</label>
            <input
              id="excerpt"
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary (optional)"
              disabled={loading}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="featured-image" className={labelClass}>Featured Image URL</label>
            <input
              id="featured-image"
              type="url"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
              className={inputClass}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="content" className="text-sm font-medium text-white/70">Content * (Max 500 words)</label>
              <span className={`text-sm font-medium ${isOverLimit ? 'text-red-400' : 'text-white/40'}`}>
                {wordCount} / 500
              </span>
            </div>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post here..."
              rows={12}
              disabled={loading}
              required
              className={`${inputClass} resize-none ${isOverLimit ? 'border-red-500/50' : ''}`}
            />
          </div>

          <div>
            <label htmlFor="status" className={labelClass}>Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              disabled={loading}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/[0.05]">
            <button
              type="submit"
              disabled={loading || isOverLimit}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => router.back()}
              className="px-4 py-2.5 rounded-lg border border-white/[0.08] text-white/70 text-sm font-medium hover:bg-white/[0.03] hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
