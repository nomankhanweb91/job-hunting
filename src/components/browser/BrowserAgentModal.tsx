import React, { useState } from 'react';
import {
  Monitor,
  X,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Play,
  Eye,
  FileCheck,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { Application, BrowserAgentStep } from '../../types';
import { api } from '../../services/api';

interface BrowserAgentModalProps {
  application: Application;
  onClose: () => void;
  onRefresh: () => void;
}

export const BrowserAgentModal: React.FC<BrowserAgentModalProps> = ({
  application,
  onClose,
  onRefresh,
}) => {
  const [submittingAction, setSubmittingAction] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'logs' | 'dom'>('visual');

  const steps = application.browserSteps || [];
  const waitingHumanStep = steps.find(s => s.status === 'waiting_human');
  const hasHumanActionRequired = Boolean(waitingHumanStep) || application.status === 'approval_required';

  const handleResolve = async (resolution: 'continue' | 'mark_completed' | 'cancel') => {
    setSubmittingAction(true);
    try {
      await api.resolveHumanAction(application.id, resolution);
      onRefresh();
    } catch (e) {
      console.error('Failed to resolve human action:', e);
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl glass-panel shadow-2xl border border-white/20 overflow-hidden">
        {/* Browser Top Navigation Bar representation */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Traffic light dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950 border border-white/10 text-xs font-mono text-slate-300 w-72 sm:w-96 truncate">
              <Monitor className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{application.applicationUrl || application.sourceUrl}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                hasHumanActionRequired
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {hasHumanActionRequired ? 'HUMAN ACTION REQUIRED' : 'BROWSER AGENT COMPLETE'}
            </span>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Human Action Alert Bar if CAPTCHA or OTP appeared */}
        {hasHumanActionRequired && (
          <div className="bg-amber-950/70 border-b border-amber-500/40 p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-200">
                    Verification Challenge Detected
                  </h4>
                  <p className="text-[11px] text-amber-300/80">
                    {waitingHumanStep?.humanPrompt ||
                      'Employer application portal presented a CAPTCHA/human gate. Automated bot circumvention is disabled by safety compliance. Please confirm or complete in portal.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 flex-wrap">
                <a
                  href={application.applicationUrl || application.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-white/15 text-slate-200 hover:text-white text-xs font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>OPEN PAGE</span>
                </a>

                <button
                  onClick={() => handleResolve('continue')}
                  disabled={submittingAction}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-bold transition-all disabled:opacity-50"
                >
                  CONTINUE
                </button>

                <button
                  onClick={() => handleResolve('mark_completed')}
                  disabled={submittingAction}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-bold transition-all disabled:opacity-50"
                >
                  MARK AS COMPLETED
                </button>

                <button
                  onClick={() => handleResolve('cancel')}
                  disabled={submittingAction}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 text-xs font-medium"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body: Tabs */}
        <div className="flex items-center gap-4 px-6 pt-3 border-b border-white/10 bg-slate-950/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('visual')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'visual'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Execution Visualizer
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'logs'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Agent Step Logs ({steps.length})
          </button>
          <button
            onClick={() => setActiveTab('dom')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'dom'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Form Fields & Submissions
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'visual' && (
            <div className="space-y-4">
              {/* Simulated Browser Viewport */}
              <div className="rounded-xl border border-white/15 bg-slate-950 p-4 relative overflow-hidden shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold text-slate-200">
                      DOM Automation Target: {application.company} Careers
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Viewport: 1440x900</span>
                </div>

                {/* Simulated rendered form fields with highlight box */}
                <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-white/10">
                  <div className="border border-emerald-500/40 bg-emerald-500/10 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold block">
                        IDENTIFIED FIELD #1: Full Name
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {application.submittedAnswers?.['Full Name'] || 'Noman Khan'}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                      FILLED
                    </span>
                  </div>

                  <div className="border border-emerald-500/40 bg-emerald-500/10 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold block">
                        IDENTIFIED FIELD #2: Email
                      </span>
                      <span className="text-xs font-semibold text-white">
                        nomankhanweb@gmail.com
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                      VERIFIED
                    </span>
                  </div>

                  <div className="border border-emerald-500/40 bg-emerald-500/10 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold block">
                        IDENTIFIED FIELD #3: Attachment (PDF Resume)
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {application.resumeUsedName || 'Master UI/UX Resume (2026).pdf'}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                      UPLOADED
                    </span>
                  </div>

                  {hasHumanActionRequired && (
                    <div className="border-2 border-dashed border-amber-500 bg-amber-500/10 p-4 rounded-lg flex items-center gap-3">
                      <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-amber-300 block">
                          Security Gate: Interactive Human Verification
                        </span>
                        <p className="text-[11px] text-slate-300">
                          Execution paused safely. CAPTCHA or external portal credentials need user interaction.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-2">
              {steps.map(step => (
                <div
                  key={step.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-white/10 font-mono text-xs"
                >
                  <span className="text-slate-500 font-bold">#{step.stepNumber}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 uppercase">{step.action}</span>
                      <span className="text-[10px] text-slate-400">{step.timestamp.slice(11, 19)}</span>
                    </div>
                    <p className="text-slate-300 text-xs font-sans">{step.screenshotCaption}</p>
                    {step.targetElement && (
                      <span className="text-[11px] text-slate-500 block">Selector: {step.targetElement}</span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      step.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : step.status === 'waiting_human'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'dom' && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                Submitted Screening Answers & Profile Declarations
              </h5>
              <div className="divide-y divide-white/10 border border-white/10 rounded-xl bg-slate-900/80">
                {Object.entries(application.submittedAnswers || {}).map(([key, val], i) => (
                  <div key={i} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-400 font-medium">{key}</span>
                    <span className="text-white font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-t border-white/10 text-xs text-slate-400">
          <span>Target: {application.jobTitle} at {application.company}</span>
          <span>Match Score: {application.matchScore}%</span>
        </div>
      </div>
    </div>
  );
};
