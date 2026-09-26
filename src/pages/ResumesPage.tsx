import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  Plus,
  CheckCircle2,
  Calendar,
  Layers,
  Edit3,
} from 'lucide-react';
import { ResumeVersion } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ResumesPage: React.FC = () => {
  const { profile } = useAuth();
  const [resumes, setResumes] = useState<ResumeVersion[]>([]);
  const [activeResume, setActiveResume] = useState<ResumeVersion | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTargetRole, setNewTargetRole] = useState('');
  const [newSummary, setNewSummary] = useState('');

  const loadResumes = async () => {
    try {
      const data = await api.getResumes();
      setResumes(data);
      if (data.length > 0 && !activeResume) {
        setActiveResume(data[0]);
      }
    } catch (e) {
      console.error('Failed to load resumes:', e);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleCreate = async () => {
    if (!newName || !newTargetRole) return;
    const res = await api.createResume({
      name: newName,
      targetRole: newTargetRole,
      summary: newSummary || `Professional résumé tailored for ${newTargetRole} roles highlighting 10+ years experience in Figma, design systems, and mobile UX.`,
      skills: profile?.skills || [],
    });
    if (res.success) {
      setResumes(res.resumes);
      setActiveResume(res.resumes[res.resumes.length - 1]);
      setShowCreateModal(false);
      setNewName('');
      setNewTargetRole('');
      setNewSummary('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">AI Resume Engine & Versions</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {resumes.length} Versions Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Region and role-tailored resumes strictly grounded in your authentic 10+ years experience.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF Export</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Targeted Resume</span>
          </button>
        </div>
      </div>

      {/* Main split: Version switcher and Printable Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Versions List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Available Versions</h3>
          <div className="space-y-2">
            {resumes.map(r => (
              <div
                key={r.id}
                onClick={() => setActiveResume(r)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  activeResume?.id === r.id
                    ? 'glass-panel-gold border-amber-500/40 shadow-md'
                    : 'glass-panel border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{r.name}</span>
                  {r.isMaster && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      MASTER
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300">{r.targetRole}</p>
                <p className="text-[10px] text-slate-500 font-mono">Updated {r.updatedAt.slice(0, 10)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Printable Resume Document Preview */}
        <div className="lg:col-span-2">
          {activeResume ? (
            <div className="rounded-3xl glass-panel border border-white/15 p-8 text-slate-100 shadow-2xl space-y-6 print:bg-white print:text-black print:p-0 print:border-none">
              {/* Resume Header */}
              <div className="border-b border-white/10 pb-6 text-center space-y-2">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {profile?.personal?.fullName || 'Noman Khan'}
                </h2>
                <p className="text-sm font-semibold text-amber-300">
                  {activeResume.targetRole || profile?.currentDesignation}
                </p>
                <div className="flex items-center justify-center gap-3 text-xs text-slate-300 flex-wrap pt-1">
                  <span>{profile?.personal?.professionalEmail}</span>
                  <span>•</span>
                  <span>{profile?.personal?.phone}</span>
                  <span>•</span>
                  <span>{profile?.personal?.currentCity}, {profile?.personal?.country}</span>
                  <span>•</span>
                  <a href={profile?.personal?.portfolioUrl} className="text-amber-400 hover:underline">
                    {profile?.personal?.portfolioUrl}
                  </a>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Executive Summary
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeResume.summary}
                </p>
              </div>

              {/* Core Competencies */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Core Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(profile?.skills || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-white/10 text-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Professional Experience */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Professional Experience
                </h3>
                <div className="space-y-4">
                  {(profile?.experiences || []).map(exp => (
                    <div key={exp.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white text-sm">{exp.role}</span>
                        <span className="text-slate-400 font-mono">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      <p className="text-xs text-amber-300 font-medium">{exp.company} • {exp.location}</p>
                      <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>
                      {exp.highlights?.length > 0 && (
                        <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
                          {exp.highlights.map((h, hIdx) => (
                            <li key={hIdx}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              {Boolean(profile?.education && profile.education.length > 0) && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                    Education & Credentials
                  </h3>
                  {profile?.education?.map(edu => (
                    <div key={edu.id} className="flex items-center justify-between text-xs text-slate-300">
                      <span>
                        <strong className="text-white">{edu.degree} in {edu.field}</strong> — {edu.institution}
                      </span>
                      <span className="font-mono text-slate-400">{edu.startYear} - {edu.endYear}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">Select a resume version to preview.</div>
          )}
        </div>
      </div>

      {/* Target Resume Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl glass-panel p-6 shadow-2xl border border-white/15 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Create Targeted Resume Version
            </h3>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Resume Name</label>
              <input
                type="text"
                placeholder="e.g. UAE & Gulf Executive UI/UX Resume"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Target Role</label>
              <input
                type="text"
                placeholder="e.g. Lead UI/UX Designer / Product Design Director"
                value={newTargetRole}
                onChange={e => setNewTargetRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Custom Summary</label>
              <textarea
                rows={4}
                placeholder="Specific executive highlights for this version..."
                value={newSummary}
                onChange={e => setNewSummary(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName || !newTargetRole}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Save Version
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
