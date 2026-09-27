export type RemoteType = 'remote' | 'hybrid' | 'onsite';
export type EmploymentType = 'full-time' | 'contract' | 'freelance' | 'internship' | 'part-time';
export type RiskLevel = 'low' | 'review' | 'suspicious';
export type ApprovalMode = 'manual' | 'smart' | 'auto';

export type ApplicationStatus =
  | 'NEW'
  | 'ANALYZING'
  | 'MATCHED'
  | 'AUTO APPLY QUEUE'
  | 'AUTO APPLIED'
  | 'APPROVAL REQUIRED'
  | 'APPROVED'
  | 'REJECTED BY USER'
  | 'APPLICATION FAILED'
  | 'APPLICATION COMPLETED'
  | 'INTERVIEW'
  | 'REJECTED'
  | 'FOLLOW-UP DUE'
  | 'HUMAN ACTION REQUIRED'
  // Lowercase compatibility aliases
  | 'new'
  | 'ready'
  | 'saved'
  | 'analyzing'
  | 'matched'
  | 'auto_applied'
  | 'approval_required'
  | 'applied'
  | 'application_failed'
  | 'interview'
  | 'technical_round'
  | 'hr_round'
  | 'followup_due'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export type JobStatus = ApplicationStatus;

export interface AutoApplyLogRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  sourceName: string;
  jobUrl: string;
  matchScore: number;
  matchAnalysis: string;
  resumeUsed: string;
  coverLetterUsed: string;
  applicationDate: string;
  applicationTime: string;
  applicationResult: string;
  agentActions: string[];
  errors: string | null;
  screenshotProof?: string;
  status: ApplicationStatus;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: User;
  device: string;
  lastActive: string;
}

export interface PersonalInfo {
  fullName: string;
  professionalEmail: string;
  phone: string;
  country: string;
  currentCity: string;
  preferredCountries: string[];
  preferredCities: string[];
  linkedinUrl: string;
  portfolioUrl: string;
  behanceUrl: string;
  githubUrl: string;
  otherUrls: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
  skillsUsed: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface CaseStudy {
  id: string;
  project: string;
  role: string;
  industry: string;
  problem: string;
  research: string;
  process: string;
  tools: string[];
  solution: string;
  impact: string;
  url: string;
  tags: string[];
}

export interface ResumeVersion {
  id: string;
  name: string;
  targetRole: string;
  summary: string;
  skills: string[];
  fileUrl?: string;
  fileName?: string;
  updatedAt: string;
  isMaster?: boolean;
}

export type RolePriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface TargetRoleItem {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  priority: RolePriority;
  isCustom?: boolean;
}

export interface TargetRolesConfig {
  roles: TargetRoleItem[];
  preferredRoles: string[];
  excludedRoles: string[];
  preferredKeywords: string[];
  excludedKeywords: string[];
}

export interface MasterProfile {
  personal: PersonalInfo;
  currentDesignation: string;
  desiredDesignations: string[];
  totalExperienceYears: number;
  relevantExperienceYears: number;
  skills: string[];
  tools: string[];
  industries: string[];
  education: EducationItem[];
  experiences: ExperienceItem[];
  certifications: string[];
  languages: string[];
  caseStudies: CaseStudy[];
  resumes: ResumeVersion[];
  achievements: string[];
  targetRolesConfig?: TargetRolesConfig;
  preferences: {
    desiredRoles: string[];
    minSalary: number;
    preferredCurrency: string;
    remoteTypes: RemoteType[];
    employmentTypes: EmploymentType[];
    relocationOpen: boolean;
    visaRequired: boolean;
    noticePeriodDays: number;
  };
  applicationRules: AutomationRules;
  onboardingCompleted: boolean;
}

export interface AutomationRules {
  approvalMode: ApprovalMode;
  autoApply: boolean;
  autoApplyThreshold: number; // Exactly 30% rule
  requireApprovalBelowMatch: number;
  neverApplyBelowMatch: number;
  maxApplicationsPerDay: number;
  maxApplicationsPerCompanyPerDay: number;
  allowedCountries: string[];
  blockedCountries: string[];
  allowedJobTypes: EmploymentType[];
  salaryMinimum: number;
  blockedCompanies: string[];
  preferredCompanies: string[];
  emailOutreachEnabled: boolean;
  dailyEmailLimit: number;
  followUpDays: number;
  maxCompanyContacts: number;
  pauseAllApplications: boolean;
  pauseEmailOutreach: boolean;
  pauseBrowserAutomation: boolean;
  emergencyStop: boolean;
}

export interface JobMatchBreakdown {
  overall: number;
  skills: number;
  experience: number;
  location: number;
  salary: number;
  role: number;
  industry: number;
  education: number;
  employmentType?: number;
  pros: string[];
  cons: string[];
  missingSkills: string[];
  learningRecommendations?: { skill: string; advice: string }[];
  explanation: string;
}

export interface Job {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceLogo?: string;
  sourceUrl: string;
  applicationUrl: string;
  canonicalUrl: string;
  company: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyIndustry?: string;
  title: string;
  location: string;
  country: string;
  remoteType: RemoteType;
  salary: {
    min: number;
    max: number;
    currency: string;
    period: 'monthly' | 'yearly' | 'hourly';
    isDisclosed: boolean;
  };
  employmentType: EmploymentType;
  experienceRequiredYears: number;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedDate: string;
  discoveredDate: string;
  deadline?: string;
  matchScore: JobMatchBreakdown;
  status: JobStatus;
  isDemo: boolean;
  riskLevel: RiskLevel;
  riskReason?: string;
  easyApply: boolean;
}

export interface JobSource {
  id: string;
  name: string;
  logo: string;
  category: 'global' | 'gulf' | 'india' | 'tech' | 'career_page' | 'custom';
  status: 'connected' | 'manual_action_required' | 'integration_required' | 'syncing' | 'error';
  lastSync: string;
  jobsFound: number;
  jobsMatched: number;
  applicationsCount: number;
  errorsCount: number;
  enabled: boolean;
  feedUrl?: string;
  authRequired: boolean;
  notes?: string;
}

export interface ApplicationEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'discovery' | 'analysis' | 'resume' | 'cover_letter' | 'form' | 'submitted' | 'interview' | 'status_change';
}

export interface BrowserAgentStep {
  id: string;
  stepNumber: number;
  timestamp: string;
  action:
    | 'navigate'
    | 'detect_form'
    | 'fill_field'
    | 'select_option'
    | 'upload_resume'
    | 'captcha_detected'
    | 'otp_detected'
    | 'click_submit'
    | 'confirm_submission'
    | 'halt_human_needed';
  targetElement?: string;
  fieldLabel?: string;
  value?: string;
  status: 'completed' | 'in_progress' | 'waiting_human' | 'failed';
  screenshotCaption?: string;
  humanPrompt?: string;
}

export interface RecruiterInfo {
  name: string;
  title: string;
  email: string;
  linkedin?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  sourceName: string;
  sourceUrl: string;
  applicationUrl: string;
  appliedDate: string;
  status: ApplicationStatus;
  matchScore: number;
  resumeUsedId: string;
  resumeUsedName: string;
  coverLetter: string;
  submittedAnswers: Record<string, string>;
  timeline: ApplicationEvent[];
  browserSteps: BrowserAgentStep[];
  recruiter?: RecruiterInfo;
  followUpDue?: string | null;
  interviewDate?: string;
  notes?: string;
  qualityScore: {
    resumeRelevance: number;
    coverLetterRelevance: number;
    answerCompleteness: number;
    profileCompleteness: number;
    overallScore: number;
  };
}

export interface EmailOutreach {
  id: string;
  applicationId?: string;
  company: string;
  recruiterName: string;
  recruiterEmail: string;
  subject: string;
  body: string;
  category: 'application_email' | 'recruiter_intro' | 'followup' | 'interview_thank_you' | 'networking' | 'cold_outreach';
  status: 'draft' | 'scheduled' | 'sent' | 'delivered' | 'opened' | 'replied' | 'bounced';
  createdAt: string;
  sentAt?: string;
  scheduledFor?: string;
  followUpDaysCount: number;
  threadEvents: { timestamp: string; event: string }[];
}

export interface QueueTask {
  id: string;
  queue: 'discovery' | 'analysis' | 'application' | 'approval' | 'browser' | 'email' | 'followup';
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  retries: number;
  maxRetries: number;
  error?: string;
}

export interface SystemHealth {
  geminiApi: {
    status: 'connected' | 'error' | 'warning' | 'disabled';
    connectionStatus?: 'CONNECTED' | 'CONNECTION ERROR' | 'NOT TESTED';
    latencyMs: number;
    model: string;
    lastSuccessfulRequest?: string | null;
    lastError?: string | null;
    quotaExceeded?: boolean;
  };
  database: { status: 'connected' | 'error'; totalRecords: number };
  jobSources: { connected: number; total: number; lastSync: string };
  emailProvider: { status: 'connected' | 'integration_required'; provider: string };
  browserAgent: { status: 'idle' | 'running' | 'paused'; activeTasks: number };
  scheduler: { status: 'active' | 'paused'; nextRunInSec: number };
  queue: { pending: number; running: number; failed: number };
}

export interface GeminiTestResponse {
  success: boolean;
  model: string;
  message?: string;
  error?: string;
  lastSuccessfulRequest?: string | null;
  lastError?: string | null;
  latencyMs?: number;
}

export interface ApiUsage {
  requestsCount: number;
  tokensUsed: number;
  estimatedCostUsd: number;
  dailyBudgetUsd: number;
  monthlyBudgetUsd: number;
  quotaExceeded: boolean;
  quotaPaused: boolean;
}

export interface DailyBriefing {
  date: string;
  greeting: string;
  summary: string;
  newJobsCount: number;
  topMatchesCount: number;
  applicationsPendingApproval: number;
  followUpsDueCount: number;
  upcomingInterviews: { company: string; role: string; date: string }[];
  highPriorityRecommendations: string[];
}
