import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Sparkles,
  Layers,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { CaseStudy } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const PortfolioPage: React.FC = () => {
  const { profile } = useAuth();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [project, setProject] = useState('');
  const [role, setRole] = useState('Lead Product Designer');
  const [industry, setIndustry] = useState('Fintech & Banking');
  const [problem, setProblem] = useState('');
  const [research, setResearch] = useState('');
  const [process, setProcess] = useState('');
  const [tools, setTools] = useState('Figma, Miro');
  const [solution, setSolution] = useState('');
  const [impact, setImpact] = useState('');
  const [url, setUrl] = useState('');

  const loadCaseStudies = async () => {
    try {
      const data = await api.getCaseStudies();
      setCaseStudies(data);
    } catch (e) {
      console.error('Failed to load case studies:', e);
    }
  };

  useEffect(() => {
    loadCaseStudies();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !solution) return;

    const res = await api.createCaseStudy({
      project,
      role,
      industry,
      problem,
      research,
      process,
      tools: tools.split(',').map(t => t.trim()),
      solution,
      impact,
      url: url || 'https://nomankhan.design',
      tags: [industry, ...tools.split(',').map(t => t.trim())],
    });

    if (res.success) {
      setCaseStudies(res.caseStudies);
      setShowAddModal(false);
      setProject('');
      setProblem('');
      setSolution('');
      setImpact('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">Portfolio & Case Study Intelligence</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {caseStudies.length} Case Studies
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Structured design projects auto-selected by AI for high-match employer applications.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Case Study</span>
        </button>
      </div>

      {/* Case studies list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {caseStudies.map(cs => (
          <div
            key={cs.id}
            className="p-6 rounded-3xl glass-panel border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {cs.industry}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{cs.role}</span>
              </div>

              <h3 className="text-base font-extrabold text-white">{cs.project}</h3>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-rose-400 block mb-0.5">Problem Solved:</span>
                  <p className="text-slate-300 leading-relaxed">{cs.problem}</p>
                </div>

                <div>
                  <span className="font-bold text-amber-300 block mb-0.5">Research & Process:</span>
                  <p className="text-slate-300 leading-relaxed">{cs.research || cs.process}</p>
                </div>

                <div>
                  <span className="font-bold text-emerald-400 block mb-0.5">Solution Delivered:</span>
                  <p className="text-slate-300 leading-relaxed">{cs.solution}</p>
                </div>
              </div>

              {/* Quantifiable business impact */}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Business Impact: </strong>
                  {cs.impact}
                </span>
              </div>

              {/* Tools */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(cs.tools || []).map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-white/5">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <a
                href={cs.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Live Walkthrough</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] text-slate-500 font-mono">AI Match Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <form
            onSubmit={handleAdd}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel p-6 shadow-2xl border border-white/15 space-y-4"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Add Verified Portfolio Case Study
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WealthTech Mobile App Redesign"
                  value={project}
                  onChange={e => setProject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Industry</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fintech / E-commerce / SaaS"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">The Problem / Challenge</label>
              <textarea
                rows={2}
                required
                placeholder="What was broken or hindering conversion?"
                value={problem}
                onChange={e => setProblem(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">User Research & Sprints</label>
              <textarea
                rows={2}
                placeholder="How did you validate assumptions and user testing?"
                value={research}
                onChange={e => setResearch(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Design Solution</label>
              <textarea
                rows={2}
                required
                placeholder="Describe your design system, UX architecture, or prototypes"
                value={solution}
                onChange={e => setSolution(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Business Impact / Metric Lift</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 58% increase in transaction completion"
                  value={impact}
                  onChange={e => setImpact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Case Study URL</label>
                <input
                  type="text"
                  placeholder="https://nomankhan.design/case-study"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
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
                Save Case Study
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
