'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, AlertCircle, FileText } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  publishDate?: Date;
  wordCount: number;
  author: { name: string };
}

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog/list');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting post');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Blog Posts</h1>
          <p className="text-white/40 text-sm mt-1">Manage your blog content</p>
        </div>
        <Link href="/admin/blog/new">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors">
            <Plus size={16} />
            New Post
          </span>
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Error</p>
            <p className="text-red-400/70 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-white/40" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-[#111] border border-white/[0.08] rounded-xl p-12 text-center">
          <FileText className="h-12 w-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/60 mb-2">No blog posts yet</p>
          <p className="text-white/30 text-sm mb-4">Create your first post to get started</p>
          <Link href="/admin/blog/new">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors">
              <Plus size={16} />
              Create Post
            </span>
          </Link>
        </div>
      ) : (
        <div className="bg-[#111] border border-white/[0.08] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-white/[0.08]">
              <tr>
                <th className="text-left py-3 px-5 text-xs font-medium text-white/40 uppercase tracking-wider">Title</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-white/40 uppercase tracking-wider hidden sm:table-cell">Words</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-white/40 uppercase tracking-wider hidden md:table-cell">Author</th>
                <th className="text-right py-3 px-5 text-xs font-medium text-white/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-5">
                    <span className="text-white text-sm font-medium">{post.title}</span>
                    <span className="block text-white/30 text-xs mt-0.5 truncate max-w-xs">{post.slug}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        post.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-white/50 text-sm hidden sm:table-cell">{post.wordCount}</td>
                  <td className="py-4 px-5 text-white/50 text-sm hidden md:table-cell">{post.author?.name}</td>
                  <td className="py-4 px-5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link href={`/admin/blog/${post._id}`}>
                        <span className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-colors inline-flex">
                          <Edit2 size={16} />
                        </span>
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
