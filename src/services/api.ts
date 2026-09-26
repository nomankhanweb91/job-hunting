import {
  MasterProfile,
  Job,
  JobSource,
  Application,
  EmailOutreach,
  QueueTask,
  User,
  DailyBriefing,
  SystemHealth,
  ApiUsage,
  AutomationRules,
  CaseStudy,
  ResumeVersion
} from '../types';

export const api = {
  // Auth
  async getCurrentUser(): Promise<{ user: User; session: any }> {
    const res = await fetch('/api/auth/me');
    return res.json();
  },

  async login(email: string, password?: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async register(email: string, name: string): Promise<{ success: boolean; user: User; requiresOnboarding: boolean }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });
    return res.json();
  },

  async logout(): Promise<{ success: boolean }> {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    return res.json();
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  async toggle2FA(): Promise<{ success: boolean; twoFactorEnabled: boolean }> {
    const res = await fetch('/api/auth/toggle-2fa', { method: 'POST' });
    return res.json();
  },

  // Profile
  async getProfile(): Promise<MasterProfile> {
    const res = await fetch('/api/profile');
    return res.json();
  },

  async updateProfile(profile: Partial<MasterProfile>): Promise<{ success: boolean; profile: MasterProfile }> {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return res.json();
  },

  async parseResume(text: string): Promise<{ success: boolean; parsed: any; profile: MasterProfile }> {
    const res = await fetch('/api/profile/parse-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return res.json();
  },

  // Sources
  async getSources(): Promise<JobSource[]> {
    const res = await fetch('/api/sources');
    return res.json();
  },

  async toggleSource(id: string): Promise<{ success: boolean; sources: JobSource[] }> {
    const res = await fetch('/api/sources/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return res.json();
  },

  async syncSources(sourceId?: string): Promise<{ success: boolean; newlyIngestedCount: number; totalJobs: number; sources: JobSource[] }> {
    const res = await fetch('/api/sources/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId }),
    });
    return res.json();
  },

  async addCustomSource(source: { name: string; category?: string; feedUrl?: string }): Promise<{ success: boolean; sources: JobSource[] }> {
    const res = await fetch('/api/sources/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(source),
    });
    return res.json();
  },

  // Jobs
  async getJobs(params?: Record<string, string>): Promise<Job[]> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/jobs${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getJob(id: string): Promise<Job> {
    const res = await fetch(`/api/jobs/${id}`);
    return res.json();
  },

  async recalculateMatch(id: string): Promise<any> {
    const res = await fetch(`/api/jobs/${id}/match`, { method: 'POST' });
    return res.json();
  },

  async askAiAboutJob(id: string, question: string): Promise<{ answer: string }> {
    const res = await fetch(`/api/jobs/${id}/ask-ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    return res.json();
  },

  async generateApplication(id: string): Promise<{
    coverLetter: string;
    answers: Record<string, string>;
    recommendedResume: ResumeVersion;
    recommendedCaseStudy: CaseStudy;
  }> {
    const res = await fetch(`/api/jobs/${id}/generate-application`, { method: 'POST' });
    return res.json();
  },

  async applyToJob(id: string, payload: { coverLetter?: string; answers?: Record<string, string>; resumeId?: string }): Promise<{
    success: boolean;
    application: Application;
    browserSession: any;
    humanActionRequired: boolean;
  }> {
    const res = await fetch(`/api/jobs/${id}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Applications
  async getApplications(): Promise<Application[]> {
    const res = await fetch('/api/applications');
    return res.json();
  },

  async getApplication(id: string): Promise<Application> {
    const res = await fetch(`/api/applications/${id}`);
    return res.json();
  },

  async updateApplicationStatus(id: string, status: string, note?: string): Promise<{ success: boolean; application: Application }> {
    const res = await fetch(`/api/applications/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });
    return res.json();
  },

  async resolveHumanAction(id: string, resolution: 'continue' | 'mark_completed' | 'cancel'): Promise<{ success: boolean; application: Application }> {
    const res = await fetch(`/api/applications/${id}/human-action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolution }),
    });
    return res.json();
  },

  // Email Outreach
  async getEmails(): Promise<EmailOutreach[]> {
    const res = await fetch('/api/emails');
    return res.json();
  },

  async generateEmail(jobId: string, category: string, recruiterName?: string): Promise<{ subject: string; body: string }> {
    const res = await fetch('/api/emails/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, category, recruiterName }),
    });
    return res.json();
  },

  async sendEmail(email: Partial<EmailOutreach>): Promise<{ success: boolean; email: EmailOutreach }> {
    const res = await fetch('/api/emails/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(email),
    });
    return res.json();
  },

  // Resumes & Portfolios
  async getResumes(): Promise<ResumeVersion[]> {
    const res = await fetch('/api/resumes');
    return res.json();
  },

  async createResume(data: Partial<ResumeVersion>): Promise<{ success: boolean; resumes: ResumeVersion[] }> {
    const res = await fetch('/api/resumes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getCaseStudies(): Promise<CaseStudy[]> {
    const res = await fetch('/api/case-studies');
    return res.json();
  },

  async createCaseStudy(data: Partial<CaseStudy>): Promise<{ success: boolean; caseStudies: CaseStudy[] }> {
    const res = await fetch('/api/case-studies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Queues
  async getQueue(): Promise<QueueTask[]> {
    const res = await fetch('/api/queue');
    return res.json();
  },

  async clearQueue(): Promise<{ success: boolean; queue: QueueTask[] }> {
    const res = await fetch('/api/queue/clear', { method: 'POST' });
    return res.json();
  },

  async retryTask(id: string): Promise<{ success: boolean; queue: QueueTask[] }> {
    const res = await fetch('/api/queue/retry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return res.json();
  },

  // Automation
  async getAutomationStatus(): Promise<{ agentRunning: boolean; rules: AutomationRules }> {
    const res = await fetch('/api/automation/status');
    return res.json();
  },

  async toggleAgent(): Promise<{ success: boolean; agentRunning: boolean }> {
    const res = await fetch('/api/automation/toggle', { method: 'POST' });
    return res.json();
  },

  async emergencyStop(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/automation/emergency-stop', { method: 'POST' });
    return res.json();
  },

  async updateAutomationRules(rules: Partial<AutomationRules>): Promise<{ success: boolean; rules: AutomationRules }> {
    const res = await fetch('/api/automation/rules', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rules),
    });
    return res.json();
  },

  // AI Command Center
  async executeCommand(command: string): Promise<any> {
    const res = await fetch('/api/ai/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
    });
    return res.json();
  },

  // Daily Briefing
  async getDailyBriefing(): Promise<DailyBriefing> {
    const res = await fetch('/api/ai/briefing');
    return res.json();
  },

  // Reports
  async getReports(): Promise<any> {
    const res = await fetch('/api/reports');
    return res.json();
  },

  // System Health
  async getSystemHealth(): Promise<SystemHealth & { apiUsage: ApiUsage }> {
    const res = await fetch('/api/system/health');
    return res.json();
  },
};
