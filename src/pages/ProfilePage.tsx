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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MasterProfile } from '../types';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'json'>('profile');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local editable copy
  const [formData, setFormData] = useState<MasterProfile | null>(profile);
  const [jsonText, setJsonText] = useState(() => (profile ? JSON.stringify(profile, null, 2) : ''));

  if (!formData) return null;

  const handleSaveForm = async () => {
    if (!formData) return;
    await updateProfile(formData);
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

        {/* Tab Switcher & Save Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'profile' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Visual Editor
            </button>
            <button
              onClick={() => {
                setJsonText(JSON.stringify(formData, null, 2));
                setActiveTab('json');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'json' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Structured JSON</span>
            </button>
          </div>

          <button
            onClick={activeTab === 'profile' ? handleSaveForm : handleSaveJson}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Master Profile successfully synchronized and saved to persistent database.</span>
        </div>
      )}

      {/* VISUAL EDITOR TAB */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Section 1: Personal Contact */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" /> Personal & Public Profiles
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
                <label className="text-xs font-medium text-slate-400 block mb-1">Current City & Country</label>
                <input
                  type="text"
                  value={`${formData.personal.currentCity}, ${formData.personal.country}`}
                  onChange={e => {
                    const [c, co] = e.target.value.split(',');
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, currentCity: c?.trim() || '', country: co?.trim() || '' },
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={formData.personal.linkedinUrl}
                  onChange={e =>
                    setFormData({ ...formData, personal: { ...formData.personal, linkedinUrl: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Behance Portfolio</label>
                <input
                  type="text"
                  value={formData.personal.behanceUrl}
                  onChange={e =>
                    setFormData({ ...formData, personal: { ...formData.personal, behanceUrl: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Professional Designations & Skills */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" /> Designation & Experience
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
                <label className="text-xs font-medium text-slate-400 block mb-1">Total Experience (Years)</label>
                <input
                  type="number"
                  value={formData.totalExperienceYears}
                  onChange={e => setFormData({ ...formData, totalExperienceYears: Number(e.target.value) })}
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

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Verified Skills (used strictly for match scoring)
              </label>
              <textarea
                rows={3}
                value={formData.skills.join(', ')}
                onChange={e =>
                  setFormData({
                    ...formData,
                    skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                  })
                }
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* JSON TAB */}
      {activeTab === 'json' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4 text-amber-400" /> Machine-Readable Profile JSON
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
            rows={20}
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-white/10 text-amber-300 font-mono text-xs leading-relaxed focus:outline-none focus:border-amber-400/80"
          />
        </div>
      )}
    </div>
  );
};
