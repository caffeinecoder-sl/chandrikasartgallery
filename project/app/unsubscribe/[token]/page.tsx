'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Loader2, ArrowUpRight } from 'lucide-react';

export default function UnsubscribePage() {
  const params = useParams();
  const token = params.token as string;
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUnsubscribe = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/subscribers/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to unsubscribe');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing unsubscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-10">
          {success ? (
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>

              <h1 className="text-2xl font-light text-white mb-3">
                Unsubscribed
              </h1>
              <p className="text-white/40 font-light mb-8">
                You have been successfully removed from our mailing list.
              </p>

              {/* Info Box */}
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 mb-8">
                <p className="text-white/60 text-sm font-light">
                  You will no longer receive emails from us. We are sorry to see you go.
                </p>
              </div>

              {/* Links */}
              <div className="space-y-3 text-sm mb-8">
                <p className="text-white/40">If you change your mind:</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/subscribe" className="text-white hover:text-white/70 underline underline-offset-4 transition-colors">
                    Resubscribe
                  </Link>
                  <span className="text-white/20">•</span>
                  <Link href="/gallery" className="text-white hover:text-white/70 underline underline-offset-4 transition-colors">
                    Gallery
                  </Link>
                  <span className="text-white/20">•</span>
                  <Link href="/blog" className="text-white hover:text-white/70 underline underline-offset-4 transition-colors">
                    Blog
                  </Link>
                </div>
              </div>

              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all">
                Return to Home
                <ArrowUpRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="text-center">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-white/40" />
              </div>

              <h1 className="text-2xl font-light text-white mb-3">
                Confirm Unsubscribe
              </h1>
              <p className="text-white/40 font-light mb-8">
                Are you sure you want to unsubscribe from our mailing list?
              </p>

              {/* Error */}
              {error && (
                <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                  <div className="flex gap-3 items-start text-left">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </div>
              )}

              {/* What you will miss */}
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-5 mb-8 text-left">
                <h3 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4">
                  You will no longer receive
                </h3>
                <ul className="space-y-2.5 text-sm text-white/60">
                  <li className="flex items-center gap-2">
                    <span>✉️</span>
                    <span className="font-light">Weekly updates and articles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🎨</span>
                    <span className="font-light">New artwork announcements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🎁</span>
                    <span className="font-light">Exclusive offers and previews</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleUnsubscribe}
                  disabled={loading}
                  className="flex-1 px-6 py-3.5 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Yes, Unsubscribe'
                  )}
                </button>
                <Link
                  href="/"
                  className="flex-1 px-6 py-3.5 border border-white/20 text-white rounded-xl font-light hover:bg-white/5 transition-all text-center"
                >
                  Cancel
                </Link>
              </div>

              <p className="text-xs text-white/30 mt-6">
                You can always resubscribe later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
