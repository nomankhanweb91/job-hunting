import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Bookmark,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  FileText,
  DollarSign,
  MapPin,
  RefreshCw,
  Send,
  Eye,
} from 'lucide-react';
import { Job } from '../types';
import { api } from '../services/api';

export const ApprovalQueuePage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const loadApprovalQueue = async () => {
    setLoading(true);
    try {
      const data = await api.getApprovalQueue();
      setJobs(data);
    } catch (e) {
      console.error('Failed to load approval queue:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovalQueue();
  }, []);

  const handleAction = async (jobId: string, action: 'approve' | 'reject' | 'save') => {
    setActioningId(jobId);
    try {
      const res = await api.approvalQueueAction(jobId, action);
      if (res.success) {
        if (action === 'approve') {
          setNotification(`Application approved and submitted for ${res.job.title} at ${res.job.company}!`);
        } else if (action === 'reject') {
          setNotification(`Job rejected: ${res.job.title}`);
        } else {
          setNotification(`Job saved for later: ${res.job.title}`);
        }
        await loadApprovalQueue();
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (e) {
      console.error('Action failed:', e);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">Approval Queue</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              🟡 Below 30% Threshold ({jobs.length})
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Jobs scoring below the 30% auto-apply threshold require explicit candidate approval before submission.
          </p>
        </div>

        <button
          onClick={loadApprovalQueue}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-500/30 text-xs font-semibold text-slate-300 hover:text-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* 30% Threshold Rule Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex items-start gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-amber-200">Autonomous Safety Control: Exact 30% Rule</strong>
          <p className="text-slate-300 leading-relaxed">
            Every job with <strong className="text-emerald-400">Match Score &gt;= 30%</strong> applies automatically. Every job with <strong className="text-amber-300">Match Score &lt; 30%</strong> is safely halted here for candidate review. No unverified applications are submitted.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Jobs List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto mb-2" />
          <span>Loading approval queue...</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Approval Queue Is Empty</h3>
          <p className="text-xs text-slate-400">
            All newly ingested jobs matched 30% or higher and were automatically processed, or no pending low-match jobs exist.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div
              key={job.id}
              className="p-6 rounded-3xl glass-panel border border-white/10 hover:border-amber-500/30 transition-all space-y-4"
            >
              {/* Row 1: Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-400">{job.company}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-white/5">
                      {job.sourceName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      🟡 MATCH: {job.matchScore.overall}% (&lt; 30% THRESHOLD)
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-1">{job.title}</h3>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}
                  </span>
                </div>
              </div>

              {/* Row 2: Sub-scores & Why Match is Low */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-2xl bg-slate-900 border border-white/5 space-y-1 text-xs">
                  <span className="text-[10px] text-slate-400 font-mono block">MATCH SUB-SCORES</span>
                  <div className="flex items-center justify-between">
                    <span>Skills Match:</span> <strong className="text-amber-400">{job.matchScore.skills}%</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Experience Match:</span> <strong className="text-amber-400">{job.matchScore.experience}%</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Location Match:</span> <strong className="text-slate-300">{job.matchScore.location}%</strong>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1 text-xs md:col-span-2">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                    Why Match Is Low (&lt; 30%)
                  </span>
                  <p className="text-slate-200 leading-relaxed">{job.matchScore.explanation}</p>
                  {job.matchScore.missingSkills?.length > 0 && (
                    <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400">Missing Skills:</span>
                      {job.matchScore.missingSkills.map((m, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-rose-900/40 text-rose-300 border border-rose-500/30">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Resume recommendation & Cover Letter preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/5 space-y-1">
                  <span className="text-[10px] text-amber-400 font-mono font-bold block">RESUME RECOMMENDATION</span>
                  <p className="text-white font-bold">Master UI/UX & Product Design Resume (2026)</p>
                  <p className="text-[11px] text-slate-400">Grounded strictly in 10+ years Figma and design systems.</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/5 space-y-1">
                  <span className="text-[10px] text-amber-400 font-mono font-bold block">COVER LETTER PREVIEW</span>
                  <p className="text-[11px] text-slate-300 italic line-clamp-2">
                    &quot;Dear Hiring Team at {job.company}, I am writing to submit my application for the {job.title} position...&quot;
                  </p>
                </div>
              </div>

              {/* Row 4: Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <a
                  href={job.applicationUrl || job.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300"
                >
                  <span>Inspect Employer Posting</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(job.id, 'reject')}
                    disabled={actioningId === job.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/30 text-xs font-semibold"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>REJECT</span>
                  </button>

                  <button
                    onClick={() => handleAction(job.id, 'save')}
                    disabled={actioningId === job.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-semibold"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>SAVE FOR LATER</span>
                  </button>

                  <button
                    onClick={() => handleAction(job.id, 'approve')}
                    disabled={actioningId === job.id}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>APPROVE & APPLY</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
