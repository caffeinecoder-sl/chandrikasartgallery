'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Loader2, ArrowLeft, Shield } from 'lucide-react';

export default function AdminSetupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const res = await fetch('/api/admin/setup');
      const data = await res.json();
      setAdminExists(data.adminExists);
    } catch (err) {
      console.error('Failed to check admin status:', err);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, secretKey }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(`Admin user created successfully! Redirecting to login...`);
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(data.error || 'Failed to create admin user');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all disabled:opacity-50";

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white/40" />
      </div>
    );
  }

  if (adminExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-light text-white mb-2">Admin Already Configured</h1>
          <p className="text-white/40 text-sm mb-8">An admin account has already been set up for this gallery.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full py-3.5 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} />
            Back to Gallery
          </Link>
          <div>
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
              <Shield className="w-8 h-8 text-white/60" />
            </div>
            <h1 className="text-5xl font-light text-white mb-4 tracking-tight">
              Initial<br />
              <span className="font-semibold">Setup</span>
            </h1>
            <p className="text-white/40 text-lg max-w-sm">
              Create your admin account to start managing your gallery, artworks, and connect with collectors.
            </p>
          </div>
          <p className="text-white/20 text-xs">
            © 2024 Chandrika Maelge Art. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Setup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mb-6">
              <ArrowLeft size={16} />
              Back to Gallery
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-white mb-2">Create Admin Account</h2>
            <p className="text-white/40 text-sm">Set up your credentials to access the studio</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-emerald-400 text-sm">{success}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-white/70">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Chandrika Maelge"
                required
                disabled={loading}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white/70">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gallery.com"
                required
                disabled={loading}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-white/70">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  minLength={6}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70">Confirm</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  minLength={6}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="secretKey" className="block text-sm font-medium text-white/70">Setup Secret Key</label>
              <input
                id="secretKey"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter your setup key"
                required
                disabled={loading}
                className={inputClass}
              />
              <p className="text-xs text-white/30">
                This is the ADMIN_SETUP_KEY from your environment configuration
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Admin Account'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-white/40 text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-white hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
