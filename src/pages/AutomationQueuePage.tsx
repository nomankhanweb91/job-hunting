import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Play,
  Pause,
  AlertTriangle,
  RotateCcw,
  Trash2,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Radio,
  Layers,
} from 'lucide-react';
import { QueueTask } from '../types';
import { api } from '../services/api';
import { useAutomation } from '../context/AutomationContext';

export const AutomationQueuePage: React.FC = () => {
  const { agentRunning, toggleAgent, emergencyStop, rules, updateRules } = useAutomation();
  const [tasks, setTasks] = useState<QueueTask[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const data = await api.getQueue();
      setTasks(data);
    } catch (e) {
      console.error('Failed to load queue:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleClear = async () => {
    const res = await api.clearQueue();
    if (res.success) setTasks(res.queue);
  };

  const handleRetry = async (id: string) => {
    const res = await api.retryTask(id);
    if (res.success) setTasks(res.queue);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">Autonomous Agent Queue & Controls</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {tasks.length} Managed Tasks
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time execution scheduler for job discovery, AI match parsing, browser application runs, and outreach.
          </p>
        </div>

        {/* Global Agent Toggle & Emergency Stop */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAgent}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              agentRunning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {agentRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{agentRunning ? 'PAUSE ALL AGENTS' : 'RESUME AUTOMATION'}</span>
          </button>

          <button
            onClick={emergencyStop}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-lg shadow-rose-600/30 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>EMERGENCY STOP</span>
          </button>
        </div>
      </div>

      {/* Control Switches Card */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" /> Granular Component Circuit Breakers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Auto Application Submissions</span>
              <span className="text-[11px] text-slate-400">Respects match score thresholds</span>
            </div>
            <button
              onClick={() => updateRules({ pauseAllApplications: !rules?.pauseAllApplications })}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                !rules?.pauseAllApplications
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {!rules?.pauseAllApplications ? 'ENABLED' : 'PAUSED'}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Browser Automation Engine</span>
              <span className="text-[11px] text-slate-400">Halts automatically on CAPTCHA</span>
            </div>
            <button
              onClick={() => updateRules({ pauseBrowserAutomation: !rules?.pauseBrowserAutomation })}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                !rules?.pauseBrowserAutomation
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {!rules?.pauseBrowserAutomation ? 'ENABLED' : 'PAUSED'}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Recruiter Email Outreach</span>
              <span className="text-[11px] text-slate-400">Strict daily quotas enforced</span>
            </div>
            <button
              onClick={() => updateRules({ pauseEmailOutreach: !rules?.pauseEmailOutreach })}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                !rules?.pauseEmailOutreach
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {!rules?.pauseEmailOutreach ? 'ENABLED' : 'PAUSED'}
            </button>
          </div>
        </div>
      </div>

      {/* Internal Task Queue */}
      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-xl">
        <div className="p-5 bg-slate-900 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Internal Job Queues
            </h3>
            <p className="text-xs text-slate-400">Discovery, AI Match, Browser, and Follow-Up Queue Status</p>
          </div>
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Completed Tasks</span>
          </button>
        </div>

        <div className="divide-y divide-white/5">
          {tasks.map(task => (
            <div key={task.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/5 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{task.title}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-white/5 uppercase">
                      {task.queue}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{task.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    task.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : task.status === 'running'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      : task.status === 'pending'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {task.status.toUpperCase()}
                </span>

                {task.status === 'failed' && (
                  <button
                    onClick={() => handleRetry(task.id)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700"
                    title="Retry task"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
