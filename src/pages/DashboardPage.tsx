import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  FileCheck2,
  Calendar,
  MessageSquare,
  Award,
  Zap,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Briefcase,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { Job, Application, DailyBriefing } from '../types';
import { useAuth } from '../context/AuthContext';
import { useAutomation } from '../context/AutomationContext';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onSelectJob: (job: Job) => void;
  onSelectApplication: (app: Application) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onSelectJob,
  onSelectApplication,
}) => {
  const { profile } = useAuth();
  const { triggerManualSync, syncing, agentRunning, emergencyStop, rules, updateRules } = useAutomation();
  const [loading, setLoading] = useState(true);
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [reportData, setReportData] = useState<any>(null);
  const [autoApplyLogs, setAutoApplyLogs] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [briefingRes, jobsRes, appsRes, repRes, logsRes] = await Promise.all([
          api.getDailyBriefing(),
          api.getJobs(),
          api.getApplications(),
          api.getReports(),
          api.getAutoApplyLogs(),
        ]);
        setBriefing(briefingRes);
        setJobs(jobsRes);
        setApplications(appsRes);
        setReportData(repRes);
        setAutoApplyLogs(logsRes);
      } catch (e) {
        console.error('Failed to load dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleToggleAutoApply = async () => {
    await api.toggleAutoApply();
    if (rules) {
      await updateRules({ autoApply: !rules.autoApply });
    }
  };

  const autoApplyEnabled = agentRunning && rules?.autoApply !== false;
  const approvalJobs = jobs.filter(j => j.status === 'APPROVAL REQUIRED' || j.matchScore.overall < 30);
  const autoAppliedJobs = jobs.filter(j => j.status === 'AUTO APPLIED' || j.matchScore.overall >= 30);

  const metrics = reportData?.metrics || {
    jobsFoundToday: 6,
    newMatches: 4,
    applicationsToday: 2,
    applicationsThisWeek: applications.length,
    applicationsThisMonth: applications.length + 5,
    interviews: 1,
    replies: 3,
    offers: 0,
    successRate: 25,
  };

  const highMatchJobs = jobs.filter(j => j.matchScore.overall >= 88).slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* PROMINENT AI AUTO APPLY BANNER (Exact requirement) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-amber-950/40 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950">
                ACTIVE PIPELINE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                AI AUTO APPLY
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-white/10 text-xs font-bold">
                <span className="text-slate-400">STATUS:</span>
                <span className={autoApplyEnabled ? "text-emerald-400 flex items-center gap-1.5 font-extrabold" : "text-amber-400 font-extrabold"}>
                  <span className={`w-2 h-2 rounded-full ${autoApplyEnabled ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
                  {autoApplyEnabled ? "ON" : "PAUSED"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-300 font-bold">AUTO APPLY THRESHOLD:</span>
              <span className="text-amber-300 font-extrabold text-base bg-amber-500/10 px-3 py-0.5 rounded-lg border border-amber-500/40">
                30%
              </span>
            </div>

            {/* Display rule indicators */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold pt-1">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
                <span className="text-base leading-none">🟢</span>
                <span>30%+ → AUTO APPLY</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-300">
                <span className="text-base leading-none">🟡</span>
                <span>Below 30% → APPROVAL REQUIRED</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleToggleAutoApply}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-white/15 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
            >
              <span>{autoApplyEnabled ? "PAUSE AUTO APPLY" : "RESUME AUTO APPLY"}</span>
            </button>

            <button
              onClick={emergencyStop}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-rose-600/30"
            >
              <AlertCircle className="w-4 h-4" />
              <span>STOP ALL AUTOMATION</span>
            </button>
          </div>
        </div>

        {/* Quick Links to Approval Queue & Auto Apply Log */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-300">
            <span>Approval Queue: <strong className="text-amber-300">{approvalJobs.length} jobs awaiting review (&lt; 30%)</strong></span>
            <span>•</span>
            <span>Auto Applied: <strong className="text-emerald-400">{autoApplyLogs.length} logged submissions (&gt;= 30%)</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('approval-queue')}
              className="text-amber-300 hover:text-amber-200 hover:underline font-bold flex items-center gap-1"
            >
              <span>Review Approval Queue ({approvalJobs.length}) →</span>
            </button>
            <button
              onClick={() => onNavigate('auto-apply-log')}
              className="text-emerald-300 hover:text-emerald-200 hover:underline font-bold flex items-center gap-1"
            >
              <span>View Auto Apply Audit Log ({autoApplyLogs.length}) →</span>
            </button>
          </div>
        </div>
      </div>
      {/* Daily AI Briefing Banner */}
      <div className="p-6 rounded-3xl glass-panel-gold border border-amber-500/30 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/30 flex items-center justify-center text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Daily AI Executive Briefing • {briefing?.date || '26 Sep 2026'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
              {briefing?.greeting || `Welcome back, ${profile?.personal?.fullName || 'Noman Khan'}`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {briefing?.summary ||
                'Your AI job hunting pipeline scanned 11 sources today. Multiple 90%+ design system and fintech lead roles are ready for submission.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('jobs')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20"
            >
              <span>Explore High Matches</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Priority Recommendations */}
        {briefing?.highPriorityRecommendations && (
          <div className="mt-4 pt-4 border-t border-amber-500/20 grid grid-cols-1 md:grid-cols-3 gap-2">
            {briefing.highPriorityRecommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/50 border border-white/5 text-xs text-slate-300"
              >
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{rec}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top 9 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-amber-500/30 transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Jobs Found Today</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">{metrics.jobsFoundToday}</span>
            <span className="text-[10px] text-emerald-400 font-bold">+100% live</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-amber-500/30 transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">New Matches (&gt;85%)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-amber-300">{metrics.newMatches}</span>
            <span className="text-[10px] text-amber-400 font-bold">Priority</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-amber-500/30 transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Applications Today</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">{metrics.applicationsToday}</span>
            <span className="text-[10px] text-slate-400">Limit: 15/day</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-amber-500/30 transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Applications This Week</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">{metrics.applicationsThisWeek}</span>
            <span className="text-[10px] text-emerald-400 font-bold">On Target</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-amber-500/30 transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Interviews</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-300">{metrics.interviews}</span>
            <span className="text-[10px] text-emerald-400 font-bold">Talabat Scheduled</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-amber-500/30 transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Recruiter Replies</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">{metrics.replies}</span>
            <span className="text-[10px] text-slate-400">42% response</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-amber-500/30 transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Offers</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-amber-400">{metrics.offers}</span>
            <span className="text-[10px] text-slate-400">In Pipeline</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-amber-500/30 transition-all">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Success Rate</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-400">{metrics.successRate}%</span>
            <span className="text-[10px] text-emerald-400 font-bold">High Quality</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-amber-500/30 transition-all col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Sources</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">11</span>
            <span className="text-[10px] text-amber-300 font-bold">Naukri, Indeed, LinkedIn</span>
          </div>
        </div>
      </div>

      {/* Main Split: High Match Feed & Active Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Top High Match Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Top Matches Ready For Submission
              </h3>
            </div>
            <button
              onClick={() => onNavigate('jobs')}
              className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All ({jobs.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {highMatchJobs.map(job => (
              <div
                key={job.id}
                className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-amber-500/40 transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-400">{job.company}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-white/5">
                        {job.sourceName}
                      </span>
                      {job.isDemo ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          DEMO DATA — NOT LIVE
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          LIVE INGESTED
                        </span>
                      )}
                    </div>
                    <h4
                      onClick={() => onSelectJob(job)}
                      className="text-sm sm:text-base font-extrabold text-white mt-1 cursor-pointer group-hover:text-amber-300 transition-colors"
                    >
                      {job.title}
                    </h4>
                  </div>

                  {/* Match score badge */}
                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-500/30">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-sm font-black text-amber-300">{job.matchScore.overall}% MATCH</span>
                    </div>
                  </div>
                </div>

                {/* Details row */}
                <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap">
                  <span>📍 {job.location}</span>
                  <span>💼 {job.employmentType} ({job.remoteType})</span>
                  <span>💰 {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}/{job.salary.period}</span>
                </div>

                {/* AI Explanation snippet */}
                <p className="text-xs text-slate-300/90 bg-slate-900/80 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                  <strong className="text-amber-300">AI Match: </strong>
                  {job.matchScore.explanation}
                </p>

                {/* Quick Action buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {job.skills.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectJob(job)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onSelectJob(job)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
                    >
                      Prepare Application
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Applications & Interview Radar */}
        <div className="space-y-6">
          {/* Upcoming Interview alert */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Confirmed Technical Interview
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Talabat (Delivery Hero)</h4>
            <p className="text-xs text-slate-300">
              Senior Product Designer (Design Systems) • Technical Screen with Head of Design Systems on Sep 28 at 10:00 AM GST.
            </p>
            <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-medium">Recommended: Prism Case Study</span>
              <button
                onClick={() => onNavigate('applications')}
                className="text-emerald-300 hover:underline font-bold"
              >
                View Timeline →
              </button>
            </div>
          </div>

          {/* Recent Applications Tracker snapshot */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-400" /> Recent Applications ({applications.length})
              </h3>
              <button
                onClick={() => onNavigate('applications')}
                className="text-xs text-amber-400 hover:underline font-semibold"
              >
                Tracker →
              </button>
            </div>

            <div className="divide-y divide-white/5">
              {applications.slice(0, 4).map(app => (
                <div
                  key={app.id}
                  onClick={() => onSelectApplication(app)}
                  className="py-3 cursor-pointer hover:bg-white/5 rounded-xl px-2 transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate max-w-[180px]">{app.company}</span>
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
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{app.jobTitle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Platform Controls card */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" /> Autonomous Pipeline Controls
            </h3>
            <p className="text-xs text-slate-300">
              Smart Approval mode active: Jobs above 88% match automatically prepare cover letters and screening questionnaires.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => onNavigate('automation')}
                className="w-full py-2 rounded-xl bg-slate-900 border border-white/15 text-slate-200 hover:text-white text-xs font-semibold text-center"
              >
                Configure Queue Rules
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
