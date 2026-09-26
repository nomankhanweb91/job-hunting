import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  User,
  Briefcase,
  Sliders,
  FileText,
  Shield,
  Mail,
  X,
  FileCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MasterProfile, RemoteType, EmploymentType } from '../../types';
import { api } from '../../services/api';

interface OnboardingWizardProps {
  onClose: () => void;
  onCompleted?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onClose, onCompleted }) => {
  const { profile, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [parsingResume, setParsingResume] = useState(false);
  const [resumeText, setResumeText] = useState('');

  // Editable local state populated initially with profile data
  const [formData, setFormData] = useState<MasterProfile>(() => {
    if (profile) return profile;
    return {
      personal: {
        fullName: 'Noman Khan',
        professionalEmail: 'nomankhanweb@gmail.com',
        phone: '+971 50 492 8173',
        country: 'United Arab Emirates',
        currentCity: 'Dubai',
        preferredCountries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Remote Worldwide'],
        preferredCities: ['Dubai', 'Abu Dhabi', 'Riyadh'],
        linkedinUrl: 'https://linkedin.com/in/nomankhanux',
        portfolioUrl: 'https://nomankhan.design',
        behanceUrl: 'https://behance.net/nomankhanux',
        githubUrl: 'https://github.com/nomankhanux',
        otherUrls: [],
      },
      currentDesignation: 'Senior UI/UX Designer & Product Lead',
      desiredDesignations: ['Lead UI/UX Designer', 'Senior Product Designer', 'UI/UX Lead'],
      totalExperienceYears: 10,
      relevantExperienceYears: 10,
      skills: ['UI Design', 'UX Design', 'Figma', 'Miro', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'WordPress', 'Shopify', 'WooCommerce'],
      tools: ['Figma', 'Miro', 'Adobe XD', 'Tokens Studio', 'Webflow'],
      industries: ['Fintech & Banking', 'E-commerce & Retail', 'Enterprise SaaS'],
      education: [],
      experiences: [],
      certifications: ['NN/g UX Master', 'Google UX Design Certificate'],
      languages: ['English', 'Urdu / Hindi'],
      caseStudies: [],
      resumes: [],
      achievements: [],
      preferences: {
        desiredRoles: ['Lead UI/UX Designer', 'Senior Product Designer', 'UI/UX Lead'],
        minSalary: 25000,
        preferredCurrency: 'AED',
        remoteTypes: ['hybrid', 'remote'],
        employmentTypes: ['full-time'],
        relocationOpen: true,
        visaRequired: false,
        noticePeriodDays: 30,
      },
      applicationRules: {
        approvalMode: 'smart',
        autoApply: false,
        requireApprovalBelowMatch: 88,
        neverApplyBelowMatch: 70,
        maxApplicationsPerDay: 15,
        maxApplicationsPerCompanyPerDay: 2,
        allowedCountries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Remote'],
        blockedCountries: [],
        allowedJobTypes: ['full-time'],
        salaryMinimum: 22000,
        blockedCompanies: [],
        preferredCompanies: ['Emirates NBD', 'Talabat', 'Stripe', 'Canva'],
        emailOutreachEnabled: true,
        dailyEmailLimit: 8,
        followUpDays: 5,
        maxCompanyContacts: 2,
        pauseAllApplications: false,
        pauseEmailOutreach: false,
        pauseBrowserAutomation: false,
        emergencyStop: false,
      },
      onboardingCompleted: true,
    };
  });

  const steps = [
    { num: 1, title: 'Personal Info', icon: User },
    { num: 2, title: 'Professional Profile', icon: Briefcase },
    { num: 3, title: 'Job Preferences', icon: Sliders },
    { num: 4, title: 'AI Resume Parser', icon: FileText },
    { num: 5, title: 'Application Rules', icon: Shield },
    { num: 6, title: 'Email Outreach', icon: Mail },
  ];

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinish = async () => {
    const updated = {
      ...formData,
      onboardingCompleted: true,
    };
    await updateProfile(updated);
    if (onCompleted) onCompleted();
    onClose();
  };

  const handleParseResume = async () => {
    if (!resumeText.trim()) return;
    setParsingResume(true);
    try {
      const res = await api.parseResume(resumeText);
      if (res.success && res.parsed) {
        setFormData(prev => ({
          ...prev,
          personal: {
            ...prev.personal,
            fullName: res.parsed.fullName || prev.personal.fullName,
            professionalEmail: res.parsed.email || prev.personal.professionalEmail,
            phone: res.parsed.phone || prev.personal.phone,
          },
          currentDesignation: res.parsed.currentDesignation || prev.currentDesignation,
          totalExperienceYears: res.parsed.totalExperienceYears || prev.totalExperienceYears,
          skills: res.parsed.skills?.length ? res.parsed.skills : prev.skills,
        }));
      }
    } catch (e) {
      console.error('Failed to parse resume:', e);
    } finally {
      setParsingResume(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl glass-panel p-6 shadow-2xl border border-white/15 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Onboarding Wizard</h2>
              <p className="text-xs text-slate-400">Configure your Master Profile and Autonomous Job Hunting rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center justify-between gap-1 py-4 border-b border-white/10 overflow-x-auto">
          {steps.map(s => {
            const Icon = s.icon;
            const isDone = currentStep > s.num;
            const isCurr = currentStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isCurr
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : isDone
                    ? 'bg-white/5 text-emerald-300'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Icon className="w-4 h-4" />}
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Step Body */}
        <div className="flex-1 overflow-y-auto py-6 px-1 space-y-4">
          {/* STEP 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" /> Step 1: Personal Contact & Portfolio Links
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.personal.fullName}
                    onChange={e => setFormData({ ...formData, personal: { ...formData.personal, fullName: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Professional Email</label>
                  <input
                    type="email"
                    value={formData.personal.professionalEmail}
                    onChange={e => setFormData({ ...formData, personal: { ...formData.personal, professionalEmail: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Phone Number (with Country Code)</label>
                  <input
                    type="text"
                    value={formData.personal.phone}
                    onChange={e => setFormData({ ...formData, personal: { ...formData.personal, phone: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Current Country & City</label>
                  <input
                    type="text"
                    value={`${formData.personal.currentCity}, ${formData.personal.country}`}
                    onChange={e => {
                      const [city, country] = e.target.value.split(',');
                      setFormData({
                        ...formData,
                        personal: { ...formData.personal, currentCity: city?.trim() || '', country: country?.trim() || '' },
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={formData.personal.linkedinUrl}
                    onChange={e => setFormData({ ...formData, personal: { ...formData.personal, linkedinUrl: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Behance Portfolio URL</label>
                  <input
                    type="text"
                    value={formData.personal.behanceUrl}
                    onChange={e => setFormData({ ...formData, personal: { ...formData.personal, behanceUrl: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1">Personal Portfolio / Website</label>
                  <input
                    type="text"
                    value={formData.personal.portfolioUrl}
                    onChange={e => setFormData({ ...formData, personal: { ...formData.personal, portfolioUrl: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Professional Profile */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" /> Step 2: Designation, Experience & Skills
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Current Designation</label>
                  <input
                    type="text"
                    value={formData.currentDesignation}
                    onChange={e => setFormData({ ...formData, currentDesignation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Total Experience (Years)</label>
                  <input
                    type="number"
                    value={formData.totalExperienceYears}
                    onChange={e => setFormData({ ...formData, totalExperienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1">Skills (comma-separated)</label>
                  <textarea
                    rows={3}
                    value={formData.skills.join(', ')}
                    onChange={e => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-300 block mb-1">Tools & Platforms (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tools.join(', ')}
                    onChange={e => setFormData({ ...formData, tools: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Job Preferences */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" /> Step 3: Compensation & Working Modalities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Minimum Monthly Salary</label>
                  <input
                    type="number"
                    value={formData.preferences.minSalary}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, minSalary: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Preferred Currency</label>
                  <select
                    value={formData.preferences.preferredCurrency}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, preferredCurrency: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  >
                    <option value="AED">AED (UAE Dirham)</option>
                    <option value="SAR">SAR (Saudi Riyal)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="INR">INR (Indian Rupee)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Notice Period (Days)</label>
                  <input
                    type="number"
                    value={formData.preferences.noticePeriodDays}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, noticePeriodDays: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Visa Sponsorship Needed?</label>
                  <select
                    value={formData.preferences.visaRequired ? 'yes' : 'no'}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, visaRequired: e.target.value === 'yes' },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  >
                    <option value="no">No (Already authorized / Resident)</option>
                    <option value="yes">Yes (Requires employer sponsorship)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: AI Resume Parser */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" /> Step 4: Resume Import & Gemini AI Extraction
              </h3>
              <p className="text-xs text-slate-400">
                Paste your resume text below. Gemini 3.8 Flash will extract experience, skills, and tools into your Master Profile.
              </p>
              <textarea
                rows={6}
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder="Paste plain resume text or profile summary here..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400 font-mono"
              />
              <button
                type="button"
                onClick={handleParseResume}
                disabled={parsingResume || !resumeText.trim()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 transition-all shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>{parsingResume ? 'AI Parsing Resume with Gemini...' : 'Extract Data into Profile with AI'}</span>
              </button>
            </div>
          )}

          {/* STEP 5: Application Rules */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" /> Step 5: Application Rules & Safety Thresholds
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Submission Mode</label>
                  <select
                    value={formData.applicationRules.approvalMode}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        applicationRules: {
                          ...formData.applicationRules,
                          approvalMode: e.target.value as any,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  >
                    <option value="manual">Mode 1: Manual (AI prepares, you submit)</option>
                    <option value="smart">Mode 2: Smart Approval (Auto-submits if match &gt;= 88%)</option>
                    <option value="auto">Mode 3: Auto Apply (Strict rule adherence)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Minimum Match Score (%)</label>
                  <input
                    type="number"
                    value={formData.applicationRules.neverApplyBelowMatch}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        applicationRules: {
                          ...formData.applicationRules,
                          neverApplyBelowMatch: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Max Applications Per Day</label>
                  <input
                    type="number"
                    value={formData.applicationRules.maxApplicationsPerDay}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        applicationRules: {
                          ...formData.applicationRules,
                          maxApplicationsPerDay: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Max Apps Per Company</label>
                  <input
                    type="number"
                    value={formData.applicationRules.maxApplicationsPerCompanyPerDay}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        applicationRules: {
                          ...formData.applicationRules,
                          maxApplicationsPerCompanyPerDay: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Email Automation */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" /> Step 6: Recruiter Outreach & Follow-Up Automation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-900 border border-white/10">
                    <input
                      type="checkbox"
                      checked={formData.applicationRules.emailOutreachEnabled}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          applicationRules: {
                            ...formData.applicationRules,
                            emailOutreachEnabled: e.target.checked,
                          },
                        })
                      }
                      className="rounded bg-slate-800 border-white/20 text-amber-500 focus:ring-0"
                    />
                    <span className="text-xs text-slate-200 font-semibold">
                      Enable AI Recruiter Outreach (Only sends when you approve or configured rules permit)
                    </span>
                  </label>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Daily Email Limit</label>
                  <input
                    type="number"
                    value={formData.applicationRules.dailyEmailLimit}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        applicationRules: {
                          ...formData.applicationRules,
                          dailyEmailLimit: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Follow-Up After (Days)</label>
                  <input
                    type="number"
                    value={formData.applicationRules.followUpDays}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        applicationRules: {
                          ...formData.applicationRules,
                          followUpDays: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-slate-500 font-medium">Step {currentStep} of 6</span>

          {currentStep < 6 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-bold transition-all shadow-md"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 text-xs font-black transition-all shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Setup & Launch Agent</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
