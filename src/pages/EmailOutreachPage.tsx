import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react';
import { EmailOutreach, Application } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const EmailOutreachPage: React.FC = () => {
  const { profile } = useAuth();
  const [emails, setEmails] = useState<EmailOutreach[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);

  // Compose form state
  const [targetAppId, setTargetAppId] = useState('');
  const [category, setCategory] = useState<string>('recruiter_intro');
  const [recruiterName, setRecruiterName] = useState('Hiring Manager');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [company, setCompany] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [emailData, appsData] = await Promise.all([
        api.getEmails(),
        api.getApplications(),
      ]);
      setEmails(emailData);
      setApplications(appsData);
    } catch (e) {
      console.error('Failed to load email outreach data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectApp = (appId: string) => {
    setTargetAppId(appId);
    const app = applications.find(a => a.id === appId);
    if (app) {
      setCompany(app.company);
      if (app.recruiter) {
        setRecruiterName(app.recruiter.name);
        setRecruiterEmail(app.recruiter.email);
      } else {
        setRecruiterEmail(`recruitment@${app.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`);
      }
    }
  };

  const handleGenerateAI = async () => {
    setGenerating(true);
    try {
      const targetApp = applications.find(a => a.id === targetAppId);
      const res = await api.generateEmail(targetApp?.jobId || 'job-live-101', category, recruiterName);
      setSubject(res.subject);
      setBody(res.body);
    } catch (e) {
      console.error('Failed to generate email:', e);
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!subject || !body || !recruiterEmail) return;
    setSending(true);
    try {
      await api.sendEmail({
        applicationId: targetAppId,
        company,
        recruiterName,
        recruiterEmail,
        subject,
        body,
        category: category as any,
      });
      await loadData();
      setShowCompose(false);
      setSubject('');
      setBody('');
    } catch (e) {
      console.error('Failed to send email:', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">Recruiter Email Outreach Engine</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {emails.length} Communications
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Personalized recruiter intros, follow-ups, and interview thank-yous with delivery tracking.
          </p>
        </div>

        <button
          onClick={() => {
            if (applications.length > 0) handleSelectApp(applications[0].id);
            setShowCompose(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New AI Outreach Email</span>
        </button>
      </div>

      {/* Smart Follow-Up Recommendation Box if apps pending response */}
      <div className="p-5 rounded-2xl glass-panel-gold border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Smart Follow-Up Detection</span>
          </div>
          <p className="text-xs text-slate-200">
            Atlassian Partner application was submitted 6 days ago without response. AI generated a polite check-in note.
          </p>
        </div>

        <button
          onClick={() => {
            const pendingApp = applications.find(a => a.status === 'followup_due') || applications[0];
            if (pendingApp) handleSelectApp(pendingApp.id);
            setCategory('followup');
            setShowCompose(true);
            handleGenerateAI();
          }}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0"
        >
          Review & Send Follow-Up
        </button>
      </div>

      {/* Email Feed / Tracker List */}
      <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
        <div className="p-4 bg-slate-900 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Outreach History & Status</h3>
          <span className="text-[11px] text-slate-400">Daily Sending Limit: 8/day</span>
        </div>

        <div className="divide-y divide-white/5">
          {emails.map(email => (
            <div key={email.id} className="p-5 space-y-3 hover:bg-white/5 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{email.subject}</h4>
                    <p className="text-[11px] text-slate-400">
                      To: {email.recruiterName} ({email.recruiterEmail}) • {email.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      email.status === 'sent'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {email.status.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {email.createdAt.slice(0, 10)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-white/5 whitespace-pre-line leading-relaxed">
                {email.body}
              </p>

              {/* Thread tracking events */}
              {email.threadEvents?.length > 0 && (
                <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                  {email.threadEvents.map((ev, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{ev.event}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Compose Outreach Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl glass-panel p-6 shadow-2xl border border-white/15 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Generate Recruiter Email with AI
              </h3>
              <button
                onClick={() => setShowCompose(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Target Application</label>
                <select
                  value={targetAppId}
                  onChange={e => handleSelectApp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                >
                  {applications.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.company} - {a.jobTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Email Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                >
                  <option value="recruiter_intro">Recruiter Introduction</option>
                  <option value="application_email">Application Email</option>
                  <option value="followup">Follow-Up (No response)</option>
                  <option value="interview_thank_you">Interview Thank You</option>
                  <option value="networking">Networking & Portfolio Share</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Recruiter Name</label>
                <input
                  type="text"
                  value={recruiterName}
                  onChange={e => setRecruiterName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Recruiter Email</label>
                <input
                  type="email"
                  value={recruiterEmail}
                  onChange={e => setRecruiterEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateAI}
              disabled={generating}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{generating ? 'Crafting with Gemini 3.8 Flash...' : 'Generate High-Converting Outreach Email'}</span>
            </button>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Email Body</label>
              <textarea
                rows={6}
                value={body}
                onChange={e => setBody(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={sending || !subject || !body || !recruiterEmail}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? 'Sending...' : 'Send Outreach Email'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
