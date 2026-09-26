import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  CheckCircle,
  ExternalLink,
  Bookmark,
  EyeOff,
  Radio,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { Job } from '../types';
import { api } from '../services/api';
import { useAutomation } from '../context/AutomationContext';

interface JobFeedPageProps {
  onSelectJob: (job: Job) => void;
  initialFilter?: any;
}

export const JobFeedPage: React.FC<JobFeedPageProps> = ({ onSelectJob, initialFilter }) => {
  const { triggerManualSync, syncing } = useAutomation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sources, setSources] = useState<any[]>([]);

  const filterTabs = [
    { id: 'all', label: 'All Jobs' },
    { id: 'auto_apply_eligible', label: '🟢 30%+ (Auto Apply)' },
    { id: 'approval_required', label: '🟡 Below 30% (Approval Required)' },
    { id: 'gulf', label: 'Gulf (UAE / KSA)' },
    { id: 'remote', label: 'Remote / Global' },
    { id: 'high_salary', label: 'High Salary' },
    { id: 'live_only', label: 'Live Ingested Only' },
  ];

  const allStatuses = [
    'NEW',
    'ANALYZING',
    'MATCHED',
    'AUTO APPLY QUEUE',
    'AUTO APPLIED',
    'APPROVAL REQUIRED',
    'APPROVED',
    'REJECTED BY USER',
    'APPLICATION FAILED',
    'APPLICATION COMPLETED',
    'INTERVIEW',
    'REJECTED',
    'FOLLOW-UP DUE',
  ];

  const loadJobs = async () => {
    setLoading(true);
    try {
      const [jobsData, sourcesData] = await Promise.all([
        api.getJobs(),
        api.getSources(),
      ]);
      setJobs(jobsData);
      setSources(sourcesData);
    } catch (e) {
      console.error('Failed to load jobs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleSync = async () => {
    await triggerManualSync();
    await loadJobs();
  };

  // Filter logic
  let filtered = jobs.filter(j => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText =
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.skills.some(s => s.toLowerCase().includes(q));
      if (!matchText) return false;
    }

    // Source filter
    if (sourceFilter !== 'all' && j.sourceId !== sourceFilter) {
      return false;
    }

    // Status filter (one of 13 states)
    if (statusFilter !== 'all') {
      if (j.status?.toUpperCase() !== statusFilter.toUpperCase()) {
        return false;
      }
    }

    // Category tabs
    if (activeFilter === 'auto_apply_eligible') return j.matchScore.overall >= 30;
    if (activeFilter === 'approval_required') return j.matchScore.overall < 30 || j.status === 'APPROVAL REQUIRED';
    if (activeFilter === 'gulf') {
      return (
        j.country.toLowerCase().includes('united arab emirates') ||
        j.country.toLowerCase().includes('saudi') ||
        j.country.toLowerCase().includes('qatar') ||
        j.location.toLowerCase().includes('dubai') ||
        j.location.toLowerCase().includes('riyadh')
      );
    }
    if (activeFilter === 'remote') return j.remoteType === 'remote';
    if (activeFilter === 'high_salary') return (j.salary.min >= 25000 && j.salary.currency === 'AED') || j.salary.min >= 90000;
    if (activeFilter === 'live_only') return !j.isDemo;

    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">Autonomous Job Feed</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {filtered.length} Jobs Found
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated across 11 job boards with real deduplication and candidate-profile scoring.
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-500/40 text-xs font-semibold text-slate-200 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Ingesting New Feeds...' : 'Sync Active Sources'}</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        {/* Search Input & Source Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by job title, company, skills (e.g. Figma, Design Systems, Fintech)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400/80"
            />
          </div>

          <div className="sm:w-56 shrink-0">
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-amber-400/80"
            >
              <option value="all">All Sources (11 Connected)</option>
              {sources.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.jobsFound})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:w-56 shrink-0">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-amber-400/80"
            >
              <option value="all">All 13 Application States</option>
              {allStatuses.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto mb-2" />
          <span>Ingesting jobs & computing multidimensional match vectors...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel text-center space-y-3">
          <p className="text-slate-300 text-sm font-semibold">No jobs match your selected filter criteria.</p>
          <p className="text-slate-500 text-xs">Try selecting &quot;All Jobs&quot; or clearing your search query.</p>
          <button
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
              setSourceFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(job => (
            <div
              key={job.id}
              className="p-5 rounded-3xl glass-panel border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 group relative"
            >
              <div className="space-y-3">
                {/* Source & Demo vs Live Badge */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-white/10">
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

                    {job.matchScore.overall >= 30 ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        🟢 30%+ AUTO APPLY
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        🟡 BELOW 30% APPROVAL REQUIRED
                      </span>
                    )}

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-slate-900 text-slate-300 border border-white/20">
                      STATUS: {job.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Match percentage pill */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-500/30">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-black text-amber-300">{job.matchScore.overall}% MATCH</span>
                  </div>
                </div>

                {/* Job Title & Company */}
                <div>
                  <h3
                    onClick={() => onSelectJob(job)}
                    className="text-base font-extrabold text-white cursor-pointer group-hover:text-amber-300 transition-colors"
                  >
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">{job.company}</span>
                    <span>•</span>
                    <span>{job.companyIndustry}</span>
                  </div>
                </div>

                {/* Details pills */}
                <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {job.employmentType} ({job.remoteType})
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}/{job.salary.period}
                  </span>
                </div>

                {/* Description snippet */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* AI Explanation preview */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 text-[11px] text-slate-300">
                  <strong className="text-amber-300">Match Insight: </strong>
                  {job.matchScore.explanation}
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.slice(0, 5).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 5 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md text-slate-500">
                      +{job.skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    title="Bookmark Job"
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title="Ignore Job"
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-300 transition-colors"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectJob(job)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
                  >
                    View Job
                  </button>

                  <button
                    onClick={() => onSelectJob(job)}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20"
                  >
                    Generate Application
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
