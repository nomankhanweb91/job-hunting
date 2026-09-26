import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Filter,
  Search,
  Kanban,
  List,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Calendar,
  Sparkles,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  X,
  Play,
  Monitor,
} from 'lucide-react';
import { Application, ApplicationStatus } from '../types';
import { api } from '../services/api';
import { useAutomation } from '../context/AutomationContext';

interface ApplicationsPageProps {
  selectedAppId?: string;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ selectedAppId }) => {
  const { setActiveBrowserModalApp } = useAutomation();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDrawerApp, setActiveDrawerApp] = useState<Application | null>(null);

  const loadApps = async () => {
    setLoading(true);
    try {
      const data = await api.getApplications();
      setApplications(data);
      if (selectedAppId) {
        const found = data.find(a => a.id === selectedAppId);
        if (found) setActiveDrawerApp(found);
      }
    } catch (e) {
      console.error('Failed to load applications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, [selectedAppId]);

  const kanbanColumns: { id: ApplicationStatus; label: string; color: string }[] = [
    { id: 'approval_required', label: 'Approval Required', color: 'border-amber-500/40 text-amber-300' },
    { id: 'applied', label: 'Submitted / Applied', color: 'border-blue-500/40 text-blue-300' },
    { id: 'interview', label: 'Interviews & Screens', color: 'border-emerald-500/40 text-emerald-300' },
    { id: 'followup_due', label: 'Follow-Up Due', color: 'border-purple-500/40 text-purple-300' },
    { id: 'offer', label: 'Offers', color: 'border-yellow-500/40 text-yellow-300' },
    { id: 'rejected', label: 'Rejected / Archived', color: 'border-slate-700 text-slate-400' },
  ];

  const filteredApps = applications.filter(a => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!a.company.toLowerCase().includes(q) && !a.jobTitle.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (statusFilter !== 'all' && a.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleStatusChange = async (appId: string, newStatus: string) => {
    await api.updateApplicationStatus(appId, newStatus);
    await loadApps();
    if (activeDrawerApp && activeDrawerApp.id === appId) {
      const refreshed = await api.getApplication(appId);
      setActiveDrawerApp(refreshed);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">Application Tracker & Audit Trail</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {applications.length} Applications
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end audit logs, browser step replays, recruiter communications, and interview tracking.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-white/10">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Table List</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search applied company, position..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400/80"
          />
        </div>

        <div className="sm:w-56 shrink-0">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-amber-400/80"
          >
            <option value="all">All Statuses ({applications.length})</option>
            <option value="approval_required">Approval Required</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="followup_due">Follow-Up Due</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map(col => {
            const colApps = filteredApps.filter(a => {
              if (col.id === 'interview') {
                return a.status === 'interview' || a.status === 'technical_round' || a.status === 'hr_round';
              }
              return a.status === col.id;
            });

            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl bg-slate-950/60 border border-white/10 p-3 min-w-[240px]"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <span className={`text-xs font-bold ${col.color}`}>{col.label}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
                    {colApps.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px]">
                  {colApps.map(app => (
                    <div
                      key={app.id}
                      onClick={() => setActiveDrawerApp(app)}
                      className="p-3.5 rounded-xl glass-panel border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer space-y-2 group shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 group-hover:text-amber-300 transition-colors">
                          {app.company}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400">
                          {app.matchScore}%
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-white leading-snug">
                        {app.jobTitle}
                      </h4>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-slate-400">
                        <span>{app.sourceName}</span>
                        <span>{app.appliedDate.slice(5, 10)}</span>
                      </div>

                      {app.status === 'approval_required' && (
                        <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 font-medium">
                          <ShieldAlert className="w-3 h-3 text-amber-400" />
                          <span>Human action required</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST TABLE VIEW */}
      {viewMode === 'list' && (
        <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="p-4">Company & Role</th>
                <th className="p-4">Source</th>
                <th className="p-4">Match %</th>
                <th className="p-4">Applied Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredApps.map(app => (
                <tr
                  key={app.id}
                  onClick={() => setActiveDrawerApp(app)}
                  className="hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <td className="p-4">
                    <span className="font-bold text-white block">{app.company}</span>
                    <span className="text-slate-400 text-[11px]">{app.jobTitle}</span>
                  </td>
                  <td className="p-4 text-slate-300">{app.sourceName}</td>
                  <td className="p-4 font-bold text-amber-400">{app.matchScore}%</td>
                  <td className="p-4 text-slate-400">{app.appliedDate.slice(0, 10)}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'interview'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : app.status === 'approval_required'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {app.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setActiveDrawerApp(app);
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-white/10"
                    >
                      Inspect Timeline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* APPLICATION AUDIT TIMELINE DRAWER */}
      {activeDrawerApp && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[540px] bg-slate-950 border-l border-white/15 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">{activeDrawerApp.company}</span>
                <h3 className="text-base font-extrabold text-white mt-1">{activeDrawerApp.jobTitle}</h3>
                <span className="text-xs text-slate-400">
                  Applied via {activeDrawerApp.sourceName} • Match Score: {activeDrawerApp.matchScore}%
                </span>
              </div>
              <button
                onClick={() => setActiveDrawerApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar & Browser Inspector Trigger */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Application Lifecycle Status</span>
                <select
                  value={activeDrawerApp.status}
                  onChange={e => handleStatusChange(activeDrawerApp.id, e.target.value)}
                  className="px-3 py-1 rounded-lg bg-slate-950 border border-white/10 text-xs text-amber-300 font-bold"
                >
                  <option value="approval_required">Approval Required</option>
                  <option value="applied">Applied</option>
                  <option value="interview">Interview Scheduled</option>
                  <option value="followup_due">Follow-Up Due</option>
                  <option value="offer">Offer Received</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>

              {/* Browser agent replay trigger */}
              <button
                onClick={() => setActiveBrowserModalApp(activeDrawerApp)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-white/10 transition-colors"
              >
                <Monitor className="w-4 h-4 text-amber-400" />
                <span>Open Browser Agent Execution Inspector</span>
              </button>
            </div>

            {/* Recruiter Information */}
            {activeDrawerApp.recruiter && (
              <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Identified Recruiter & Hiring Contact
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                    {activeDrawerApp.recruiter.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{activeDrawerApp.recruiter.name}</h5>
                    <p className="text-[11px] text-slate-400">{activeDrawerApp.recruiter.title}</p>
                    <p className="text-[11px] text-amber-400 font-mono">{activeDrawerApp.recruiter.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quality Score Breakdown */}
            {activeDrawerApp.qualityScore && (
              <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Application Quality Verification: {activeDrawerApp.qualityScore.overallScore}/100
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span>Resume Relevance:</span> <strong className="text-emerald-400">{activeDrawerApp.qualityScore.resumeRelevance}%</strong>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span>Cover Letter:</span> <strong className="text-emerald-400">{activeDrawerApp.qualityScore.coverLetterRelevance}%</strong>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span>Answer Completeness:</span> <strong className="text-emerald-400">{activeDrawerApp.qualityScore.answerCompleteness}%</strong>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span>Profile Compliance:</span> <strong className="text-emerald-400">{activeDrawerApp.qualityScore.profileCompleteness}%</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Permanent Audit Timeline */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Permanent Timestamped Timeline
              </span>
              <div className="border-l-2 border-amber-500/30 ml-2 pl-4 space-y-4">
                {activeDrawerApp.timeline.map((event, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-950" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{event.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{event.timestamp.slice(11, 16)}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-6 text-center">
            <button
              onClick={() => setActiveDrawerApp(null)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:text-white"
            >
              Close Drawer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
