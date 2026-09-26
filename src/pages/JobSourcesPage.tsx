import React, { useState, useEffect } from 'react';
import {
  Radio,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import { JobSource } from '../types';
import { api } from '../services/api';
import { useAutomation } from '../context/AutomationContext';

export const JobSourcesPage: React.FC = () => {
  const { triggerManualSync, syncing } = useAutomation();
  const [sources, setSources] = useState<JobSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newCategory, setNewCategory] = useState('custom');
  const [newFeedUrl, setNewFeedUrl] = useState('');

  const loadSources = async () => {
    setLoading(true);
    try {
      const data = await api.getSources();
      setSources(data);
    } catch (e) {
      console.error('Failed to load job sources:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  const handleToggle = async (id: string) => {
    const res = await api.toggleSource(id);
    if (res.success) {
      setSources(res.sources);
    }
  };

  const handleSyncSource = async (id?: string) => {
    await triggerManualSync(id);
    await loadSources();
  };

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName) return;
    const res = await api.addCustomSource({
      name: newSourceName,
      category: newCategory,
      feedUrl: newFeedUrl,
    });
    if (res.success) {
      setSources(res.sources);
      setShowAddModal(false);
      setNewSourceName('');
      setNewFeedUrl('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">Aggregated Job Sources & Connectors</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {sources.length} Platforms
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real integrations, RSS pipelines, public job pages, and compliant browser agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSyncSource()}
            disabled={syncing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-500/40 text-xs font-semibold text-slate-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync All Sources'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Job Source</span>
          </button>
        </div>
      </div>

      {/* Compliance Notice Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block mb-0.5">Strict Compliance & Anti-Bot Policy</strong>
          <span>
            We do not bypass CAPTCHA, scrape unauthorized private portals, or spoof human credentials. When a source requires manual human intervention (e.g. LinkedIn security verification), the system marks it as &quot;Manual action required&quot; and halts safely.
          </span>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map(source => (
          <div
            key={source.id}
            className={`p-5 rounded-3xl glass-panel border transition-all flex flex-col justify-between space-y-4 ${
              source.enabled ? 'border-white/10 hover:border-amber-500/40' : 'opacity-60 border-white/5'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                    <img src={source.logo} alt={source.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{source.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{source.category}</span>
                  </div>
                </div>

                {/* Enable/Disable Toggle */}
                <button
                  onClick={() => handleToggle(source.id)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors ${
                    source.enabled ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      source.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Status Badge */}
              <div>
                {source.status === 'connected' && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Connected (Active Feed)
                  </span>
                )}
                {source.status === 'manual_action_required' && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <ShieldAlert className="w-3 h-3 text-amber-400" /> Manual Action Required
                  </span>
                )}
                {source.status === 'integration_required' && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/10">
                    <Lock className="w-3 h-3 text-slate-400" /> Integration Required (API Keys)
                  </span>
                )}
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-white/5 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Found</span>
                  <strong className="text-white font-black">{source.jobsFound}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Matched</span>
                  <strong className="text-amber-300 font-black">{source.jobsMatched}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Applied</span>
                  <strong className="text-emerald-400 font-black">{source.applicationsCount}</strong>
                </div>
              </div>

              {source.notes && (
                <p className="text-[11px] text-slate-400 leading-snug">{source.notes}</p>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>Last sync: {source.lastSync.slice(11, 16) || 'Pending'}</span>
              <button
                onClick={() => handleSyncSource(source.id)}
                disabled={syncing || !source.enabled}
                className="text-amber-400 hover:underline font-semibold disabled:opacity-30"
              >
                Sync Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <form
            onSubmit={handleAddCustom}
            className="relative w-full max-w-md rounded-2xl glass-panel p-6 shadow-2xl border border-white/15 space-y-4"
          >
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" /> Add Custom Job Board or ATS Feed
            </h3>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Source Name</label>
              <input
                type="text"
                required
                placeholder="e.g. RemoteOK, Greenhouse ATS, Lever"
                value={newSourceName}
                onChange={e => setNewSourceName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              >
                <option value="tech">Tech & Startups</option>
                <option value="gulf">Gulf & Middle East</option>
                <option value="career_page">Company ATS Career Page</option>
                <option value="global">Global Remote Feed</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">RSS / JSON Feed or Career Portal URL</label>
              <input
                type="text"
                placeholder="https://example.com/careers/rss"
                value={newFeedUrl}
                onChange={e => setNewFeedUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Connect Source
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
