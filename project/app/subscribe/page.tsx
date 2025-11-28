'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Loader2, ArrowUpRight, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/subscribers/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error subscribing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <PageHeader title="Subscribe" />

      {/* Main Content */}
      <section className="min-h-screen flex items-center justify-center px-6 lg:px-12 pt-20 pb-32">
        <div className="w-full max-w-xl relative">
          {/* Decorative Elements */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-r from-amber-500/10 to-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-gradient-to-r from-violet-500/10 to-purple-500/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white/60" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-extralight text-white mb-4">
                Stay <span className="font-medium">Inspired</span>
              </h1>
              <p className="text-lg text-white/40 font-light max-w-md mx-auto">
                Join a community of art lovers and receive exclusive updates, 
                new releases, and behind-the-scenes content.
              </p>
            </div>

            {/* Form Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-10 backdrop-blur-sm">
              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-light text-white mb-3">Welcome to the Circle</h2>
                  <p className="text-white/40 mb-8 font-light">
                    Check your inbox for a confirmation email.
                  </p>
                  <Link href="/gallery" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all">
                    Explore Gallery
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                      <div className="flex gap-3 items-start">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-300">{error}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        disabled={loading}
                        className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all disabled:opacity-50 text-base"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-4 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                      {loading ? 'Subscribing...' : 'Subscribe Now'}
                    </button>
                  </form>

                  <p className="text-xs text-white/30 text-center mt-6">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </>
              )}
            </div>

            {/* Benefits */}
            {!success && (
              <div className="mt-12 grid grid-cols-2 gap-6">
                {[
                  { icon: '✨', text: 'Exclusive previews' },
                  { icon: '🎨', text: 'New releases' },
                  { icon: '📖', text: 'Artist insights' },
                  { icon: '🎁', text: 'Special offers' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-white/40">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-light">{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Explore Links */}
      <section className="border-t border-white/[0.05] py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/40 font-light">
            Want to explore first?{' '}
            <Link href="/gallery" className="text-white hover:text-white/70 underline underline-offset-4 transition-colors">
              View the gallery
            </Link>
            {' '}or{' '}
            <Link href="/blog" className="text-white hover:text-white/70 underline underline-offset-4 transition-colors">
              read the journal
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
