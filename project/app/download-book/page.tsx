'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Loader2, ArrowUpRight, BookOpen } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

export default function DownloadBookPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/subscribers/download-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to process request');
      }

      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <PageHeader title="Download" />

      {/* Hero Header */}
      <section className="pt-32 pb-16 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-r from-rose-500/5 to-pink-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8">
            <BookOpen className="w-7 h-7 text-white/60" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extralight text-white mb-6">
            Free <span className="font-medium">Art Guide</span>
          </h1>
          <p className="text-lg text-white/40 max-w-xl mx-auto font-light">
            Download our exclusive artist portfolio and discover the stories behind each creation.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 lg:px-12 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* What is included */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-10">
                <h2 className="text-2xl font-light text-white mb-8">
                  What is Included
                </h2>
                
                <div className="space-y-6">
                  {[
                    { icon: '📚', title: 'Complete Portfolio', desc: 'High-resolution images of our full art collection' },
                    { icon: '🎨', title: 'Artist Statement', desc: 'The philosophy and inspiration behind our work' },
                    { icon: '📖', title: 'Creative Process', desc: 'Behind-the-scenes insights into art creation' },
                    { icon: '💡', title: 'Tips & Techniques', desc: 'Valuable insights for art enthusiasts' },
                    { icon: '🛍️', title: 'Exclusive Previews', desc: 'First look at upcoming pieces and editions' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <span className="text-2xl flex-shrink-0">{item.icon}</span>
                      <div>
                        <h3 className="text-white font-light mb-1">{item.title}</h3>
                        <p className="text-white/40 text-sm font-light">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preview */}
                <div className="mt-10 pt-8 border-t border-white/[0.05]">
                  <h3 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-6">Book Preview</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {['Portfolio', 'Artist Bio', 'Techniques'].map((item, idx) => (
                      <div key={idx} className="aspect-[3/4] rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                        <span className="text-white/20 text-xs text-center px-2">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Download Form */}
            <div className="lg:col-span-2">
              <div className="sticky top-28 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
                {success ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-light text-white mb-3">Check Your Email</h3>
                    <p className="text-white/40 text-sm font-light mb-6">
                      The art guide has been sent to your inbox.
                    </p>
                    <Link href="/gallery" className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white rounded-full text-sm font-light hover:bg-white/5 transition-all">
                      Explore Gallery
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-light text-white mb-2">
                      Get Your Free Copy
                    </h3>
                    <p className="text-white/40 text-sm font-light mb-6">
                      Enter your email for instant delivery
                    </p>

                    {error && (
                      <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                        <div className="flex gap-3 items-start">
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-300">{error}</p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm text-white/60 mb-2">
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
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all disabled:opacity-50 text-sm"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3.5 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Download Free'
                        )}
                      </button>

                      <p className="text-xs text-white/30 text-center">
                        No spam. Instant delivery to your inbox.
                      </p>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/[0.05] space-y-3">
                      {[
                        { icon: '✨', text: 'Free & instant' },
                        { icon: '📧', text: 'Email delivery' },
                        { icon: '🔒', text: 'Privacy protected' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-white/40 text-sm">
                          <span>{item.icon}</span>
                          <span className="font-light">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Links */}
      <section className="border-t border-white/[0.05] py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/40 font-light">
            Interested in more?{' '}
            <Link href="/gallery" className="text-white hover:text-white/70 underline underline-offset-4 transition-colors">
              View the gallery
            </Link>
            {' '}or{' '}
            <Link href="/shop" className="text-white hover:text-white/70 underline underline-offset-4 transition-colors">
              browse our shop
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
