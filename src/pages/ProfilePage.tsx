import React, { useState } from 'react';
import {
  User,
  Briefcase,
  Sliders,
  Code,
  Save,
  CheckCircle2,
  Copy,
  Sparkles,
  Layers,
  GraduationCap,
  Globe,
  Award,
  FileText,
  Mail,
  Shield,
  FolderGit2,
  Wrench,
  BookOpen,
  Plus,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MasterProfile } from '../types';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local editable copy
  const [formData, setFormData] = useState<MasterProfile | null>(profile);
  const [jsonText, setJsonText] = useState(() => (profile ? JSON.stringify(profile, null, 2) : ''));

  if (!formData) return null;

  const handleSaveForm = async () => {
    if (!formData) return;
    await updateProfile(formData);
    setJsonText(JSON.stringify(formData, null, 2));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveJson = async () => {
    try {
      const parsed = JSON.parse(jsonText);
      await updateProfile(parsed);
      setFormData(parsed);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      alert('Invalid JSON syntax. Please verify formatting.');
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sections = [
    { id: 'personal', label: '1. Personal', icon: User },
    { id: 'professional', label: '2. Professional', icon: Briefcase },
    { id: 'experience', label: '3. Experience', icon: Layers },
    { id: 'education', label: '4. Education', icon: GraduationCap },
    { id: 'skills', label: '5. Skills', icon: Sparkles },
    { id: 'tools', label: '6. Tools', icon: Wrench },
    { id: 'portfolio', label: '7. Portfolio', icon: Globe },
    { id: 'case_studies', label: '8. Case Studies', icon: FolderGit2 },
    { id: 'achievements', label: '9. Achievements', icon: Award },
    { id: 'preferences', label: '10. Preferences', icon: Sliders },
    { id: 'resumes', label: '11. Resumes', icon: FileText },
    { id: 'cover_letters', label: '12. Cover Letters', icon: BookOpen },
    { id: 'email_templates', label: '13. Email Templates', icon: Mail },
    { id: 'application_rules', label: '14. Application Rules', icon: Shield },
    { id: 'json', label: 'Structured JSON', icon: Code },
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">Master Professional Profile</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Single Source of Truth
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grounding document for all AI match calculations, resume customizers, and cover letter generations.
          </p>
        </div>

        <button
          onClick={activeTab === 'json' ? handleSaveJson : handleSaveForm}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Master Profile</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Master Profile successfully synchronized and saved to persistent database.</span>
        </div>
      )}

      {/* Navigation Pills across the 14 Sections + JSON */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 text-xs">
        {sections.map(sec => {
          const Icon = sec.icon;
          const isActive = activeTab === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => {
                if (sec.id === 'json') {
                  setJsonText(JSON.stringify(formData, null, 2));
                }
                setActiveTab(sec.id);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. PERSONAL */}
      {activeTab === 'personal' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" /> Personal Information & Contacts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.personal.fullName}
                onChange={e =>
                  setFormData({ ...formData, personal: { ...formData.personal, fullName: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Professional Email</label>
              <input
                type="email"
                value={formData.personal.professionalEmail}
                onChange={e =>
                  setFormData({ ...formData, personal: { ...formData.personal, professionalEmail: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.personal.phone}
                onChange={e =>
                  setFormData({ ...formData, personal: { ...formData.personal, phone: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Current Country</label>
              <input
                type="text"
                value={formData.personal.country}
                onChange={e =>
                  setFormData({ ...formData, personal: { ...formData.personal, country: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Current City</label>
              <input
                type="text"
                value={formData.personal.currentCity}
                onChange={e =>
                  setFormData({ ...formData, personal: { ...formData.personal, currentCity: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Preferred Countries (comma separated)</label>
              <input
                type="text"
                value={formData.personal.preferredCountries?.join(', ') || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    personal: {
                      ...formData.personal,
                      preferredCountries: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. PROFESSIONAL */}
      {activeTab === 'professional' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-400" /> Professional Designations & Experience Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Current Designation</label>
              <input
                type="text"
                value={formData.currentDesignation}
                onChange={e => setFormData({ ...formData, currentDesignation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Desired Designations (comma separated)</label>
              <input
                type="text"
                value={formData.desiredDesignations?.join(', ') || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    desiredDesignations: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Total Experience (Years)</label>
              <input
                type="number"
                value={formData.totalExperienceYears}
                onChange={e => setFormData({ ...formData, totalExperienceYears: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Relevant Experience (Years)</label>
              <input
                type="number"
                value={formData.relevantExperienceYears}
                onChange={e => setFormData({ ...formData, relevantExperienceYears: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Notice Period (Days)</label>
              <input
                type="number"
                value={formData.preferences.noticePeriodDays}
                onChange={e =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, noticePeriodDays: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Target Industries (comma separated)</label>
              <input
                type="text"
                value={formData.industries?.join(', ') || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    industries: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. EXPERIENCE */}
      {activeTab === 'experience' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" /> Career History ({formData.experiences?.length || 0} Roles)
            </h3>
          </div>
          <div className="space-y-4">
            {formData.experiences?.map((exp, idx) => (
              <div key={exp.id || idx} className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-white font-extrabold">{exp.role}</strong>
                    <span className="text-xs text-amber-400">@ {exp.company}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-xs text-slate-300">{exp.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {exp.skillsUsed?.map((sk, sIdx) => (
                    <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. EDUCATION */}
      {activeTab === 'education' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-amber-400" /> Education & Academic Credentials
          </h3>
          <div className="space-y-3">
            {formData.education?.map((edu, idx) => (
              <div key={edu.id || idx} className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-white font-bold">{edu.degree} in {edu.field}</strong>
                  <span className="text-xs font-mono text-slate-400">{edu.startYear} - {edu.endYear}</span>
                </div>
                <p className="text-xs text-slate-400">{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SKILLS */}
      {activeTab === 'skills' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Verified Core Skills ({formData.skills.length})
          </h3>
          <p className="text-xs text-slate-400">
            These skills are strictly evaluated by the AI match engine to calculate compatibility percentages against job postings.
          </p>
          <textarea
            rows={5}
            value={formData.skills.join(', ')}
            onChange={e =>
              setFormData({
                ...formData,
                skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
              })
            }
            className="w-full p-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed focus:border-amber-400"
          />
          <div className="flex flex-wrap gap-2 pt-2">
            {formData.skills.map((skill, idx) => (
              <span key={idx} className="text-xs px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 6. TOOLS */}
      {activeTab === 'tools' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" /> Software & Technical Tools ({formData.tools.length})
          </h3>
          <textarea
            rows={4}
            value={formData.tools.join(', ')}
            onChange={e =>
              setFormData({
                ...formData,
                tools: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
              })
            }
            className="w-full p-3 rounded-2xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed focus:border-amber-400"
          />
          <div className="flex flex-wrap gap-2 pt-2">
            {formData.tools.map((tool, idx) => (
              <span key={idx} className="text-xs px-2.5 py-1 rounded-xl bg-slate-900 text-slate-200 border border-white/10">
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 7. PORTFOLIO */}
      {activeTab === 'portfolio' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" /> Portfolio URLs & Repositories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Personal Portfolio Website</label>
              <input
                type="text"
                value={formData.personal.portfolioUrl || ''}
                onChange={e =>
                  setFormData({ ...formData, personal: { ...formData.personal, portfolioUrl: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Behance URL</label>
              <input
                type="text"
                value={formData.personal.behanceUrl || ''}
                onChange={e =>
                  setFormData({ ...formData, personal: { ...formData.personal, behanceUrl: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">LinkedIn Profile</label>
              <input
                type="text"
                value={formData.personal.linkedinUrl || ''}
                onChange={e =>
                  setFormData({ ...formData, personal: { ...formData.personal, linkedinUrl: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">GitHub Profile</label>
              <input
                type="text"
                value={formData.personal.githubUrl || ''}
                onChange={e =>
                  setFormData({ ...formData, personal: { ...formData.personal, githubUrl: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* 8. CASE STUDIES */}
      {activeTab === 'case_studies' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-amber-400" /> Case Studies ({formData.caseStudies?.length || 0})
          </h3>
          <div className="space-y-4">
            {formData.caseStudies?.map((cs, idx) => (
              <div key={cs.id || idx} className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-white font-extrabold">{cs.project}</strong>
                  <span className="text-xs font-mono text-amber-400">{cs.industry}</span>
                </div>
                <p className="text-xs text-slate-300"><strong>Problem:</strong> {cs.problem}</p>
                <p className="text-xs text-emerald-300"><strong>Impact:</strong> {cs.impact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. ACHIEVEMENTS */}
      {activeTab === 'achievements' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Career Honors & Milestones
          </h3>
          <div className="space-y-2">
            {formData.achievements?.map((ach, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-900 border border-white/5 text-xs text-slate-200 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{ach}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" /> Job Search Preferences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Minimum Base Salary</label>
              <input
                type="number"
                value={formData.preferences.minSalary}
                onChange={e =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, minSalary: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Preferred Currency</label>
              <input
                type="text"
                value={formData.preferences.preferredCurrency}
                onChange={e =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, preferredCurrency: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Notice Period (Days)</label>
              <input
                type="number"
                value={formData.preferences.noticePeriodDays}
                onChange={e =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, noticePeriodDays: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* 11. RESUMES */}
      {activeTab === 'resumes' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" /> Stored Resume Versions ({formData.resumes.length})
          </h3>
          <div className="space-y-3">
            {formData.resumes.map(r => (
              <div key={r.id} className="p-4 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-white font-bold">{r.name}</strong>
                    {r.isMaster && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        MASTER
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{r.targetRole}</p>
                </div>
                <span className="text-xs font-mono text-slate-400">{r.fileName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12. COVER LETTERS */}
      {activeTab === 'cover_letters' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" /> Default Tailoring Strategy & Narrative
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The AI automatically aligns the candidate&apos;s 10+ year track record in fintech, e-commerce, and enterprise design systems when generating custom cover letters.
          </p>
        </div>
      )}

      {/* 13. EMAIL TEMPLATES */}
      {activeTab === 'email_templates' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" /> Approved Recruiter Email Outreach Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-2">
              <strong className="text-white block font-bold">1. Recruiter Intro After Application</strong>
              <p className="text-slate-400 italic">
                &quot;I recently submitted my application for the Lead UI/UX role at [Company]. With 10+ years in design systems...&quot;
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-2">
              <strong className="text-white block font-bold">2. Value-Add Portfolio Follow-Up (Day 5)</strong>
              <p className="text-slate-400 italic">
                &quot;Following up on my submission with our recent banking design system case study demonstrating a 42% decrease in drop-off...&quot;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 14. APPLICATION RULES */}
      {activeTab === 'application_rules' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" /> Exact 30% Threshold & Autonomous Safety Rules
          </h3>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
            <strong className="text-amber-300">Active Rule: Match Score 30% Auto Apply Threshold</strong>
            <p className="text-slate-300">
              🟢 Match Score &gt;= 30% → Auto Apply (unless halted by safety condition or daily limit)
            </p>
            <p className="text-slate-300">
              🟡 Match Score &lt; 30% → Approval Required (candidate must manually review and authorize)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Max Applications Per Day</label>
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
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Max Per Company Per Day</label>
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
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Daily Recruiter Email Limit</label>
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
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* STRUCTURED JSON TAB */}
      {activeTab === 'json' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4 text-amber-400" /> Machine-Readable Master Profile JSON
            </h3>
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 hover:text-white"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
          </div>

          <textarea
            rows={22}
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-white/10 text-amber-300 font-mono text-xs leading-relaxed focus:outline-none focus:border-amber-400/80"
          />
        </div>
      )}
    </div>
  );
};
