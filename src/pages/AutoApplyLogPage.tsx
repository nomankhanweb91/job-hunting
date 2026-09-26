import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Monitor,
  RefreshCw,
} from 'lucide-react';
import { AutoApplyLogRecord } from '../types';
import { api } from '../services/api';

export const AutoApplyLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AutoApplyLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAutoApplyLogs();
      setLogs(data);
    } catch (e) {
      console.error('Failed to load auto apply logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filtered = logs.filter(
    l =>
      l.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.sourceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">Auto Apply Audit Log</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              🟢 Exact 30%+ Submissions ({logs.length})
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete compliance record of all automatically submitted applications meeting the 30% threshold.
          </p>
        </div>

        <button
          onClick={loadLogs}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-500/30 text-xs font-semibold text-slate-300 hover:text-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter auto-apply logs by company, role, or source..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* Log Entries */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto mb-2" />
          <span>Loading audit log...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel text-center text-slate-400 text-xs">
          No auto-apply log records found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(item => (
            <div
              key={item.id}
              className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-sm"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-400">{item.company}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-white/5">
                      {item.sourceName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      🟢 MATCH: {item.matchScore}% (AUTO APPLIED)
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-1">{item.jobTitle}</h3>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
                  <span>📅 {item.applicationDate}</span>
                  <span>⏰ {item.applicationTime}</span>
                </div>
              </div>

              {/* Match Analysis & Result */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-slate-900 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 font-bold block">
                    MATCH ANALYSIS
                  </span>
                  <p className="text-slate-300 leading-relaxed">{item.matchAnalysis}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold block">
                    APPLICATION RESULT
                  </span>
                  <p className="text-white font-bold">{item.applicationResult}</p>
                  {item.screenshotProof && (
                    <span className="text-[11px] text-slate-400 block pt-1">
                      Proof: {item.screenshotProof}
                    </span>
                  )}
                </div>
              </div>

              {/* Resume & Cover Letter Used */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block">RESUME SUBMITTED</span>
                  <span className="text-white font-semibold">{item.resumeUsed}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block">COVER LETTER CONTENT</span>
                  <p className="text-[11px] text-slate-300 italic line-clamp-2">{item.coverLetterUsed}</p>
                </div>
              </div>

              {/* Agent Actions Checklist */}
              {item.agentActions?.length > 0 && (
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">
                    Browser Agent Step Audit ({item.agentActions.length} Actions)
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {item.agentActions.map((action, aIdx) => (
                      <span
                        key={aIdx}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-white/5 text-[11px]"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{action}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* External URL */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <a
                  href={item.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-amber-400 hover:underline font-semibold"
                >
                  <span>View Original Employer Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <span className="text-[10px] font-mono text-emerald-400">VERIFIED SAFE EXECUTION</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
