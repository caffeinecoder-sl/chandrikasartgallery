'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, Settings, Mail, Cloud } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Email Settings
  const [smtpHost, setSmtpHost] = useState(process.env.NEXT_PUBLIC_SMTP_HOST || '');
  const [smtpPort, setSmtpPort] = useState(process.env.NEXT_PUBLIC_SMTP_PORT || '587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [fromEmail, setFromEmail] = useState(process.env.NEXT_PUBLIC_SMTP_FROM_EMAIL || '');
  const [fromName, setFromName] = useState(process.env.NEXT_PUBLIC_SMTP_FROM_NAME || '');

  // Cloudinary Settings
  const [cloudinaryName, setCloudinaryName] = useState(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setLoading(true);

    try {
      // TODO: Implement settings save to database
      setTimeout(() => {
        setSaved(true);
        setLoading(false);
        setTimeout(() => setSaved(false), 3000);
      }, 500);
    } catch (error) {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-black border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors disabled:opacity-50";
  const labelClass = "block text-sm font-medium text-white/70 mb-2";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Configure your platform</p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-emerald-400 font-medium">Settings saved successfully!</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Email Configuration */}
        <div className="bg-[#111] border border-white/[0.08] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.08] flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Mail size={18} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">Email Configuration</h2>
              <p className="text-sm text-white/40">Set up your email service for newsletters</p>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="smtp-host" className={labelClass}>SMTP Host</label>
                <input
                  id="smtp-host"
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  placeholder="smtp.gmail.com"
                  disabled={loading}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="smtp-port" className={labelClass}>SMTP Port</label>
                <input
                  id="smtp-port"
                  type="text"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  placeholder="587"
                  disabled={loading}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="smtp-user" className={labelClass}>SMTP User</label>
                <input
                  id="smtp-user"
                  type="email"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="your-email@gmail.com"
                  disabled={loading}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="smtp-pass" className={labelClass}>SMTP Password</label>
                <input
                  id="smtp-pass"
                  type="password"
                  value={smtpPass}
                  onChange={(e) => setSmtpPass(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="from-email" className={labelClass}>From Email</label>
                <input
                  id="from-email"
                  type="email"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="noreply@yoursite.com"
                  disabled={loading}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="from-name" className={labelClass}>From Name</label>
                <input
                  id="from-name"
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="Chandrika Maelge Art"
                  disabled={loading}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Storage Configuration */}
        <div className="bg-[#111] border border-white/[0.08] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.08] flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <Cloud size={18} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">Storage Configuration</h2>
              <p className="text-sm text-white/40">Set up Cloudinary for image storage</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="cloudinary-name" className={labelClass}>Cloudinary Cloud Name</label>
              <input
                id="cloudinary-name"
                type="text"
                value={cloudinaryName}
                onChange={(e) => setCloudinaryName(e.target.value)}
                placeholder="your-cloud-name"
                disabled={loading}
                className={inputClass}
              />
            </div>
            <p className="text-sm text-white/40">
              Get your cloud name from your Cloudinary dashboard at{' '}
              <a
                href="https://cloudinary.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                cloudinary.com
              </a>
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
