import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  CornerDownLeft,
  CheckCircle2,
  AlertCircle,
  Command,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAutomation } from '../../context/AutomationContext';

interface CommandCenterModalProps {
  onClose: () => void;
  onNavigateToJobsWithFilter?: (filter: any) => void;
  onNavigateToApplicationsWithFilter?: (filter: any) => void;
}

export const CommandCenterModal: React.FC<CommandCenterModalProps> = ({
  onClose,
  onNavigateToJobsWithFilter,
  onNavigateToApplicationsWithFilter,
}) => {
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toggleAgent, emergencyStop } = useAutomation();

  const sampleCommands = [
    'Find UI UX jobs in Dubai above AED 25,000',
    "Show today's best matches above 90%",
    'Apply to all jobs above 90% match',
    'Show applications where there is no response for 5 days',
    'Generate follow-up emails for pending applications',
    'Stop all automatic applications',
  ];

  const handleExecute = async (cmdText: string) => {
    const query = cmdText || command;
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await api.executeCommand(query);
      setResult(res);

      // Trigger client navigation if appropriate
      if (res.action === 'filter_jobs' && onNavigateToJobsWithFilter) {
        onNavigateToJobsWithFilter(res.parameters);
      }
    } catch (e: any) {
      setResult({
        error: e.message || 'Failed to process command',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel p-6 shadow-2xl border border-white/15">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <Command className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                NOMAN AI Command Center
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Type natural language instructions to search, filter, automate, or control agents safely.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input box */}
        <div className="mt-4">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleExecute(command);
            }}
            className="relative"
          >
            <input
              type="text"
              value={command}
              onChange={e => setCommand(e.target.value)}
              placeholder='e.g., "Find UI UX jobs in Dubai above AED 25,000" or "Stop all automatic applications"...'
              className="w-full px-4 py-3.5 pr-24 rounded-xl bg-slate-900 border border-white/15 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/80 shadow-inner"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !command.trim()}
              className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 transition-all shadow-md"
            >
              {loading ? (
                <span>Executing...</span>
              ) : (
                <>
                  <span>Run</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mt-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Suggested Prompts
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleCommands.map((sample, i) => (
              <button
                key={i}
                onClick={() => {
                  setCommand(sample);
                  handleExecute(sample);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-900/90 border border-white/10 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors text-left"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Execution Output */}
        {result && (
          <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Action: {result.action?.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono">Status: Executed Safely</span>
                </div>
                <p className="text-xs text-slate-200">{result.explanation}</p>
                {result.resultMessage && (
                  <p className="text-xs text-emerald-300 font-medium">{result.resultMessage}</p>
                )}
                {result.parameters && (
                  <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2 rounded-lg mt-2 border border-white/5">
                    {JSON.stringify(result.parameters)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Compliance Footer */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Actions strictly respect Master Profile preferences and anti-bot rules.</span>
          </div>
          <span>Esc to dismiss</span>
        </div>
      </div>
    </div>
  );
};
