'use client';

import { useState, useEffect } from 'react';
import { Download, Trash2, Loader2, AlertCircle, Users } from 'lucide-react';

interface Subscriber {
  _id: string;
  email: string;
  subscribedDate: string;
  isActive: boolean;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch('/api/subscribers/list');
        if (!res.ok) throw new Error('Failed to fetch subscribers');
        const data = await res.json();
        setSubscribers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading subscribers');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return;

    try {
      const res = await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete subscriber');
      setSubscribers(subscribers.filter((s) => s._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting subscriber');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Email', 'Subscribed Date', 'Status'];
    const rows = subscribers.map((s) => [
      s.email,
      new Date(s.subscribedDate).toLocaleDateString(),
      s.isActive ? 'Active' : 'Inactive',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const activeCount = subscribers.filter(s => s.isActive).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Subscribers</h1>
          <p className="text-white/40 text-sm mt-1">Manage your newsletter subscribers</p>
        </div>
        {subscribers.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
          >
            <Download size={16} />
            Export CSV
          </button>
        )}
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111] border border-white/[0.08] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Users size={18} className="text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-white">{activeCount}</div>
          <div className="text-sm text-white/40">Active Subscribers</div>
        </div>
        <div className="bg-[#111] border border-white/[0.08] rounded-xl p-5">
          <div className="text-2xl font-semibold text-white">{subscribers.length}</div>
          <div className="text-sm text-white/40">Total Subscribers</div>
        </div>
        <div className="bg-[#111] border border-white/[0.08] rounded-xl p-5">
          <div className="text-2xl font-semibold text-white">
            {subscribers.length > 0 ? Math.round((activeCount / subscribers.length) * 100) : 0}%
          </div>
          <div className="text-sm text-white/40">Active Rate</div>
        </div>
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
      ) : subscribers.length === 0 ? (
        <div className="bg-[#111] border border-white/[0.08] rounded-xl p-12 text-center">
          <Users className="h-12 w-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/60 mb-2">No subscribers yet</p>
          <p className="text-white/30 text-sm">
            Subscribers will appear here when users sign up for your newsletter
          </p>
        </div>
      ) : (
        <div className="bg-[#111] border border-white/[0.08] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-white/[0.08]">
              <tr>
                <th className="text-left py-3 px-5 text-xs font-medium text-white/40 uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-white/40 uppercase tracking-wider">Subscribed</th>
                <th className="text-left py-3 px-5 text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                <th className="text-right py-3 px-5 text-xs font-medium text-white/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {subscribers.map((sub) => (
                <tr key={sub._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-5 text-white text-sm">{sub.email}</td>
                  <td className="py-4 px-5 text-white/50 text-sm">
                    {new Date(sub.subscribedDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        sub.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-white/5 text-white/40 border border-white/10'
                      }`}
                    >
                      {sub.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => handleDelete(sub._id)}
                      className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
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
