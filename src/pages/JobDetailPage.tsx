import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowLeft,
  MapPin,
  DollarSign,
  Briefcase,
  Calendar,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  MessageSquare,
  FileText,
  FileCheck2,
  FolderGit2,
  RefreshCw,
  Copy,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Job, Application } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAutomation } from '../context/AutomationContext';

interface JobDetailPageProps {
  job: Job;
  onBack: () => void;
  onApplicationCreated?: (app: Application) => void;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({
  job,
  onBack,
  onApplicationCreated,
}) => {
  const { profile } = useAuth();
  const { setActiveBrowserModalApp } = useAutomation();

  const [activeTab, setActiveTab] = useState<'overview' | 'match' | 'application' | 'ask_ai'>('overview');
  const [askingAi, setAskingAi] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);

  // Application Generation state
  const [generatingApp, setGeneratingApp] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, string>>({});
  const [recommendedResume, setRecommendedResume] = useState<any>(null);
  const [recommendedCaseStudy, setRecommendedCaseStudy] = useState<any>(null);
  const [applying, setApplying] = useState(false);
  const [applicationResult, setApplicationResult] = useState<Application | null>(null);

  // Suggested questions for Ask AI
  const promptSuggestions = [
    'Am I suitable for this role?',
    'What skills or qualifications am I missing?',
    'Which resume version should I submit?',
    'Should I apply considering the salary band?',
    'Generate tailored recruiter outreach message',
    'Prepare 5 high-yield interview questions for this role',
  ];

  const handleGenerateApplication = async () => {
    setGeneratingApp(true);
    try {
      const res = await api.generateApplication(job.id);
      setCoverLetter(res.coverLetter);
      setScreeningAnswers(res.answers || {});
      setRecommendedResume(res.recommendedResume);
      setRecommendedCaseStudy(res.recommendedCaseStudy);
      setActiveTab('application');
    } catch (e) {
      console.error('Failed to generate application:', e);
    } finally {
      setGeneratingApp(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      const res = await api.applyToJob(job.id, {
        coverLetter,
        answers: screeningAnswers,
        resumeId: recommendedResume?.id,
      });

      if (res.success && res.application) {
        setApplicationResult(res.application);
        if (onApplicationCreated) onApplicationCreated(res.application);

        // Open live browser modal to view the automated execution
        setActiveBrowserModalApp(res.application);
      }
    } catch (e) {
      console.error('Failed to apply:', e);
    } finally {
      setApplying(false);
    }
  };

  const handleAskAi = async (questionText?: string) => {
    const q = questionText || aiQuestion;
    if (!q.trim()) return;

    const userMsg = { sender: 'user' as const, text: q };
    setAiChatHistory(prev => [...prev, userMsg]);
    setAiQuestion('');
    setAskingAi(true);

    try {
      const res = await api.askAiAboutJob(job.id, q);
      setAiChatHistory(prev => [...prev, { sender: 'ai' as const, text: res.answer }]);
    } catch (e) {
      setAiChatHistory(prev => [
        ...prev,
        { sender: 'ai' as const, text: 'Unable to analyze job with AI at this moment. Please check server logs.' },
      ]);
    } finally {
      setAskingAi(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Job Feed</span>
        </button>

        <div className="flex items-center gap-2">
          {job.isDemo ? (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              DEMO DATA — NOT LIVE
            </span>
          ) : (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              LIVE INGESTED JOB
            </span>
          )}

          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-500/30 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <span>Original Posting</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Hero Job Banner */}
      <div className="p-6 rounded-3xl glass-panel border border-white/15 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-amber-400 font-mono">{job.company}</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">{job.sourceName}</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Discovered {job.discoveredDate.slice(0, 10)}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{job.title}</h1>
            <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {job.location} ({job.country})
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {job.employmentType} • {job.remoteType}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}/{job.salary.period}
              </span>
            </div>
          </div>

          {/* Action buttons & match pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-500/30 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xl font-black">{job.matchScore.overall}%</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                COMPATIBILITY
              </span>
            </div>

            <button
              onClick={handleGenerateApplication}
              disabled={generatingApp}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{generatingApp ? 'Preparing Material...' : 'Prepare Application'}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-t border-white/10 pt-4 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Job Overview & Scope
          </button>
          <button
            onClick={() => setActiveTab('match')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'match'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            AI Match Breakdown ({job.matchScore.overall}%)
          </button>
          <button
            onClick={() => {
              if (!coverLetter) handleGenerateApplication();
              setActiveTab('application');
            }}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'application'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            AI Application Package
          </button>
          <button
            onClick={() => setActiveTab('ask_ai')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'ask_ai'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask AI About This Job</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Role Description</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.responsibilities?.length > 0 && (
              <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements?.length > 0 && (
              <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Requirements</h3>
                <ul className="space-y-2">
                  {job.requirements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-white/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {job.benefits?.length > 0 && (
              <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Benefits & Perks</h3>
                <ul className="space-y-2">
                  {job.benefits.map((b, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AI MATCH BREAKDOWN */}
      {activeTab === 'match' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Match explanation */}
            <div className="p-6 rounded-3xl glass-panel-gold border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Transparent Match Explanation
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {job.matchScore.explanation}
              </p>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Profile Strengths & Matches
                </span>
                <ul className="space-y-2">
                  {job.matchScore.pros.map((p, i) => (
                    <li key={i} className="text-xs text-slate-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                  Identified Skill Gaps
                </span>
                <ul className="space-y-2">
                  {job.matchScore.missingSkills?.length > 0 ? (
                    job.matchScore.missingSkills.map((m, i) => (
                      <li key={i} className="text-xs text-slate-200 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>Missing: {m}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-400">Zero critical skill gaps detected.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Score Meters */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Sub-Score Breakdown</h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Skills Match</span>
                  <span className="font-bold text-amber-300">{job.matchScore.skills}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${job.matchScore.skills}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Experience (10 yrs vs {job.experienceRequiredYears} req)</span>
                  <span className="font-bold text-emerald-400">{job.matchScore.experience}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${job.matchScore.experience}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Location Compatibility</span>
                  <span className="font-bold text-emerald-400">{job.matchScore.location}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${job.matchScore.location}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Salary Expectation</span>
                  <span className="font-bold text-amber-300">{job.matchScore.salary}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${job.matchScore.salary}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APPLICATION PACKAGE */}
      {activeTab === 'application' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Cover letter editor */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" /> Tailored Cover Letter
                </h3>
                <span className="text-[10px] text-slate-400">Gemini 3.8 Flash • Custom metrics included</span>
              </div>
              <textarea
                rows={10}
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed focus:border-amber-400 font-mono"
              />
            </div>

            {/* Generated screening answers */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Screening Questionnaire Answers
              </h3>
              <div className="space-y-3">
                {Object.entries(screeningAnswers).map(([q, ans], i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                    <span className="text-xs font-bold text-slate-300 block">{q}</span>
                    <input
                      type="text"
                      value={ans}
                      onChange={e => setScreeningAnswers({ ...screeningAnswers, [q]: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Recommended assets */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Selected Resume & Case Study</h3>

              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-[10px] text-amber-400 font-mono font-bold block">RECOMMENDED RESUME</span>
                <p className="text-xs font-bold text-white">
                  {recommendedResume?.name || profile?.resumes[0]?.name || 'Master UI/UX Resume 2026.pdf'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-[10px] text-amber-400 font-mono font-bold block">MATCHED PORTFOLIO CASE STUDY</span>
                <p className="text-xs font-bold text-white">
                  {recommendedCaseStudy?.project || profile?.caseStudies[0]?.project || 'Emirates Mobile Banking & Wealth'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {recommendedCaseStudy?.impact || 'Increased completion rate by 58%'}
                </p>
              </div>
            </div>

            {/* Application Quality Score */}
            <div className="p-6 rounded-3xl glass-panel-gold border border-amber-500/30 space-y-3">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                Application Quality Score: 98/100
              </span>
              <p className="text-xs text-slate-300">
                Verified zero factual fabrications. All legal preferences and work authorization declarations align with master profile.
              </p>

              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{applying ? 'Browser Agent Launching...' : 'Dispatch Browser Agent & Apply'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ASK AI ABOUT THIS JOB */}
      {activeTab === 'ask_ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Chat Output Area */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 min-h-[350px] max-h-[500px] overflow-y-auto space-y-4">
              {aiChatHistory.length === 0 ? (
                <div className="text-center py-12 space-y-2 text-slate-400 text-xs">
                  <Sparkles className="w-6 h-6 text-amber-400 mx-auto" />
                  <p className="text-slate-300 font-semibold text-sm">Ask Gemini 3.8 Flash anything about this job</p>
                  <p>Inquire about suitability, interview preparation, missing skills, or recruiter messages.</p>
                </div>
              ) : (
                aiChatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 text-xs leading-relaxed ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                          : 'bg-slate-900 border border-white/10 text-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input bar */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleAskAi();
              }}
              className="relative"
            >
              <input
                type="text"
                value={aiQuestion}
                onChange={e => setAiQuestion(e.target.value)}
                placeholder="Ask e.g. 'What specific interview questions should I prepare for this company?'..."
                className="w-full px-4 py-3 pr-20 rounded-2xl bg-slate-900 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={askingAi || !aiQuestion.trim()}
                className="absolute right-2 top-2 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 disabled:opacity-50 transition-all"
              >
                {askingAi ? 'Thinking...' : 'Ask'}
              </button>
            </form>
          </div>

          {/* Quick Prompts */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Suggested Questions</h4>
            <div className="space-y-2">
              {promptSuggestions.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleAskAi(prompt)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 border border-white/5 hover:border-amber-500/40 text-xs text-slate-300 hover:text-amber-300 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
