'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Loader2, CheckCircle, Send, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NewsletterPage() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/subscribers/list');
        if (res.ok) {
          const data = await res.json();
          setSubscriberCount(data.filter((s: any) => s.isActive).length);
        }
      } catch (err) {
        console.error('Failed to fetch subscriber count');
      }
    };
    fetchCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setResult(null);

    if (!subject.trim() || !content.trim()) {
      setError('Subject and content are required');
      return;
    }

    if (subscriberCount === 0) {
      setError('No active subscribers to send to');
      return;
    }

    if (!confirm(`Send this newsletter to ${subscriberCount} subscriber(s)?`)) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send newsletter');
      }

      setSuccess(true);
      setResult({ sent: data.sent || 0, failed: data.failed || 0 });
      setSubject('');
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending newsletter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Newsletter</h1>
        <p className="text-white/40 text-sm mt-1">Compose and send emails to your subscribers</p>
      </div>

      {/* Subscriber Count Card */}
      <div className="bg-[#111] border border-white/[0.08] rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <Users size={18} className="text-violet-400" />
            </div>
            <div>
              <span className="text-2xl font-semibold text-white">{subscriberCount}</span>
              <span className="text-white/40 text-sm ml-2">active subscriber{subscriberCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <Link 
            href="/admin/subscribers" 
            className="inline-flex items-center gap-1 text-white/40 hover:text-white text-sm transition-colors"
          >
            Manage
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Success Message */}
      {success && result && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-emerald-400 font-medium">Newsletter Sent!</p>
            <p className="text-emerald-400/70 text-sm mt-1">
              Successfully sent to {result.sent} subscriber{result.sent !== 1 ? 's' : ''}.
              {result.failed > 0 && ` ${result.failed} failed.`}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Error</p>
            <p className="text-red-400/70 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Compose Form */}
      <div className="bg-[#111] border border-white/[0.08] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.08]">
          <h2 className="text-lg font-medium text-white">Compose Newsletter</h2>
          <p className="text-sm text-white/40 mt-0.5">Write your email content below</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium text-white/70">
                Subject Line
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
                disabled={loading}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-medium text-white/70">
                Email Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your newsletter content here..."
                rows={12}
                disabled={loading}
                required
                className="w-full px-4 py-3 rounded-lg bg-black border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors resize-none disabled:opacity-50"
              />
              <p className="text-xs text-white/30">
                You can use basic HTML tags for formatting (bold, italic, links, etc.)
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || subscriberCount === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Newsletter
                  </>
                )}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setSubject('');
                  setContent('');
                  setError('');
                  setSuccess(false);
                }}
                className="px-5 py-2.5 rounded-lg border border-white/[0.08] text-white/60 text-sm font-medium hover:text-white hover:bg-white/[0.03] transition-colors disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
