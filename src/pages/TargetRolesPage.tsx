import React, { useState, useEffect, useMemo } from 'react';
import {
  Target,
  Search,
  CheckSquare,
  Square,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  Shield,
  Layers,
  Star,
  Flame,
  Tag,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { TargetRolesConfig, TargetRoleItem, RolePriority } from '../types';
import { ROLE_CATEGORIES, generateDefaultTargetRolesConfig } from '../data/defaultTargetRoles';
import { useAuth } from '../context/AuthContext';

export const TargetRolesPage: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [config, setConfig] = useState<TargetRolesConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Conflict state
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);

  // New tag inputs
  const [newPrefRoleInput, setNewPrefRoleInput] = useState('');
  const [newExRoleInput, setNewExRoleInput] = useState('');
  const [newPrefKeywordInput, setNewPrefKeywordInput] = useState('');
  const [newExKeywordInput, setNewExKeywordInput] = useState('');

  // Custom role modal
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customRoleName, setCustomRoleName] = useState('');
  const [customRoleCategory, setCustomRoleCategory] = useState<string>(ROLE_CATEGORIES[0]?.name || 'UI/UX Design');
  const [customRolePriority, setCustomRolePriority] = useState<RolePriority>('HIGH');
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  // Load config on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await api.getTargetRoles();
        if (data && Array.isArray(data.roles) && data.roles.length > 0) {
          setConfig(data);
        } else {
          const fallback = generateDefaultTargetRolesConfig();
          setConfig(fallback);
        }
      } catch (err) {
        console.error('Failed to load target roles config:', err);
        const fallback = generateDefaultTargetRolesConfig();
        setConfig(fallback);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Expand all categories by default on first load
  useEffect(() => {
    if (ROLE_CATEGORIES.length > 0 && Object.keys(expandedCategories).length === 0) {
      const initial: Record<string, boolean> = {};
      ROLE_CATEGORIES.forEach(c => {
        initial[c.name] = true;
      });
      setExpandedCategories(initial);
    }
  }, [expandedCategories]);

  // Save handler
  const handleSave = async (customConfig?: TargetRolesConfig) => {
    const configToSave = customConfig || config;
    if (!configToSave) return;
    try {
      setSaving(true);
      const res = await api.updateTargetRoles(configToSave);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        await refreshProfile();
      }
    } catch (err) {
      console.error('Failed to save target roles:', err);
    } finally {
      setSaving(false);
    }
  };

  // Toggle individual role
  const handleToggleRole = (id: string) => {
    if (!config) return;
    const updatedRoles = config.roles.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    const updated = { ...config, roles: updatedRoles };
    setConfig(updated);
  };

  // Change individual role priority
  const handleChangePriority = (id: string, priority: RolePriority) => {
    if (!config) return;
    const updatedRoles = config.roles.map(r => (r.id === id ? { ...r, priority } : r));
    const updated = { ...config, roles: updatedRoles };
    setConfig(updated);
  };

  // Toggle category all
  const handleToggleCategory = (categoryName: string, enable: boolean) => {
    if (!config) return;
    const updatedRoles = config.roles.map(r =>
      r.category === categoryName ? { ...r, enabled: enable } : r
    );
    const updated = { ...config, roles: updatedRoles };
    setConfig(updated);
  };

  // Set all roles in category to specific priority
  const handleSetCategoryPriority = (categoryName: string, priority: RolePriority) => {
    if (!config) return;
    const updatedRoles = config.roles.map(r =>
      r.category === categoryName ? { ...r, priority } : r
    );
    const updated = { ...config, roles: updatedRoles };
    setConfig(updated);
  };

  // Select / Deselect All
  const handleSelectAll = () => {
    if (!config) return;
    const updatedRoles = config.roles.map(r => ({ ...r, enabled: true }));
    setConfig({ ...config, roles: updatedRoles });
  };

  const handleDeselectAll = () => {
    if (!config) return;
    const updatedRoles = config.roles.map(r => ({ ...r, enabled: false }));
    setConfig({ ...config, roles: updatedRoles });
  };

  // Reset to default
  const handleResetToDefaults = () => {
    if (window.confirm('Reset all target roles and priorities to system defaults? Any custom added roles will be preserved.')) {
      const defaults = generateDefaultTargetRolesConfig();
      // Keep any custom roles user added
      const customRoles = config?.roles.filter(r => r.isCustom) || [];
      const mergedRoles = [...defaults.roles, ...customRoles];
      const newConfig: TargetRolesConfig = {
        ...defaults,
        roles: mergedRoles,
      };
      setConfig(newConfig);
      handleSave(newConfig);
    }
  };

  // Custom role add/edit/delete
  const handleOpenAddCustomModal = () => {
    setEditingRoleId(null);
    setCustomRoleName('');
    setCustomRoleCategory(ROLE_CATEGORIES[0]?.name || 'CATEGORY 1 — UI/UX DESIGN');
    setCustomRolePriority('HIGH');
    setShowCustomModal(true);
  };

  const handleOpenEditCustomModal = (role: TargetRoleItem) => {
    setEditingRoleId(role.id);
    setCustomRoleName(role.name);
    setCustomRoleCategory(role.category);
    setCustomRolePriority(role.priority);
    setShowCustomModal(true);
  };

  const handleSaveCustomRole = () => {
    if (!customRoleName.trim() || !config) return;

    if (editingRoleId) {
      // Edit existing
      const updatedRoles = config.roles.map(r =>
        r.id === editingRoleId
          ? { ...r, name: customRoleName.trim(), category: customRoleCategory, priority: customRolePriority }
          : r
      );
      setConfig({ ...config, roles: updatedRoles });
    } else {
      // Add new custom role
      const newRole: TargetRoleItem = {
        id: `custom-role-${Date.now()}`,
        name: customRoleName.trim(),
        category: customRoleCategory,
        enabled: true,
        priority: customRolePriority,
        isCustom: true,
      };
      setConfig({ ...config, roles: [...config.roles, newRole] });
    }

    setShowCustomModal(false);
  };

  const handleDeleteCustomRole = (id: string) => {
    if (!config) return;
    const updatedRoles = config.roles.filter(r => r.id !== id);
    setConfig({ ...config, roles: updatedRoles });
  };

  // Preferred & Excluded Tag Management with Validation
  const handleAddPreferredRole = () => {
    const val = newPrefRoleInput.trim();
    if (!val || !config) return;

    // Check conflict with Excluded
    if (config.excludedRoles.some(r => r.toLowerCase() === val.toLowerCase())) {
      setConflictMessage(`Conflict detected: "${val}" is already in your Excluded Roles list. A role cannot be both Preferred and Excluded.`);
      return;
    }

    if (!config.preferredRoles.some(r => r.toLowerCase() === val.toLowerCase())) {
      setConfig({ ...config, preferredRoles: [...config.preferredRoles, val] });
    }
    setNewPrefRoleInput('');
    setConflictMessage(null);
  };

  const handleRemovePreferredRole = (role: string) => {
    if (!config) return;
    setConfig({ ...config, preferredRoles: config.preferredRoles.filter(r => r !== role) });
  };

  const handleAddExcludedRole = () => {
    const val = newExRoleInput.trim();
    if (!val || !config) return;

    // Check conflict with Preferred
    if (config.preferredRoles.some(r => r.toLowerCase() === val.toLowerCase())) {
      setConflictMessage(`Conflict detected: "${val}" is already in your Preferred Roles list. A role cannot be both Preferred and Excluded.`);
      return;
    }

    if (!config.excludedRoles.some(r => r.toLowerCase() === val.toLowerCase())) {
      setConfig({ ...config, excludedRoles: [...config.excludedRoles, val] });
    }
    setNewExRoleInput('');
    setConflictMessage(null);
  };

  const handleRemoveExcludedRole = (role: string) => {
    if (!config) return;
    setConfig({ ...config, excludedRoles: config.excludedRoles.filter(r => r !== role) });
  };

  const handleAddPreferredKeyword = () => {
    const val = newPrefKeywordInput.trim();
    if (!val || !config) return;

    // Check conflict with Excluded Keywords
    if (config.excludedKeywords.some(k => k.toLowerCase() === val.toLowerCase())) {
      setConflictMessage(`Conflict detected: "${val}" is already in your Excluded Keywords list.`);
      return;
    }

    if (!config.preferredKeywords.some(k => k.toLowerCase() === val.toLowerCase())) {
      setConfig({ ...config, preferredKeywords: [...config.preferredKeywords, val] });
    }
    setNewPrefKeywordInput('');
    setConflictMessage(null);
  };

  const handleRemovePreferredKeyword = (kw: string) => {
    if (!config) return;
    setConfig({ ...config, preferredKeywords: config.preferredKeywords.filter(k => k !== kw) });
  };

  const handleAddExcludedKeyword = () => {
    const val = newExKeywordInput.trim();
    if (!val || !config) return;

    // Check conflict with Preferred Keywords
    if (config.preferredKeywords.some(k => k.toLowerCase() === val.toLowerCase())) {
      setConflictMessage(`Conflict detected: "${val}" is already in your Preferred Keywords list.`);
      return;
    }

    if (!config.excludedKeywords.some(k => k.toLowerCase() === val.toLowerCase())) {
      setConfig({ ...config, excludedKeywords: [...config.excludedKeywords, val] });
    }
    setNewExKeywordInput('');
    setConflictMessage(null);
  };

  const handleRemoveExcludedKeyword = (kw: string) => {
    if (!config) return;
    setConfig({ ...config, excludedKeywords: config.excludedKeywords.filter(k => k !== kw) });
  };

  // Toggle category expansion
  const toggleCategoryExpand = (catName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  // Derived filtered roles
  const filteredRoles = useMemo(() => {
    if (!config) return [];
    return config.roles.filter(r => {
      const matchesSearch =
        searchQuery === '' ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategoryFilter === 'all' || r.category === selectedCategoryFilter;

      const matchesPriority =
        selectedPriorityFilter === 'all' || r.priority === selectedPriorityFilter;

      return matchesSearch && matchesCat && matchesPriority;
    });
  }, [config, searchQuery, selectedCategoryFilter, selectedPriorityFilter]);

  // Group filtered roles by category
  const groupedRoles = useMemo(() => {
    const groups: Record<string, TargetRoleItem[]> = {};
    for (const r of filteredRoles) {
      if (!groups[r.category]) {
        groups[r.category] = [];
      }
      groups[r.category].push(r);
    }
    return groups;
  }, [filteredRoles]);

  // Stats
  const totalRoles = config?.roles.length || 0;
  const enabledRolesCount = config?.roles.filter(r => r.enabled).length || 0;
  const highPriorityCount = config?.roles.filter(r => r.enabled && r.priority === 'HIGH').length || 0;
  const medPriorityCount = config?.roles.filter(r => r.enabled && r.priority === 'MEDIUM').length || 0;
  const lowPriorityCount = config?.roles.filter(r => r.enabled && r.priority === 'LOW').length || 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading Target Roles Matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-amber-950/40 border-2 border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-sm">
                <Target className="w-3.5 h-3.5" /> TARGET ROLES MATRIX
              </span>
              <span className="text-xs font-bold text-slate-400">
                13 Categories • 160 Roles Catalog
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Target Roles & Seniority Alignment
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Configure which job titles your AI Job Hunter prioritizes across Gulf and global feeds. Roles with <strong className="text-amber-400">HIGH</strong> priority carry maximum weight in job match scoring, while excluded roles and keywords trigger safety holds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all active:scale-95 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Target Roles</span>
                </>
              )}
            </button>

            <button
              onClick={handleOpenAddCustomModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Role</span>
            </button>

            <button
              onClick={handleResetToDefaults}
              title="Reset priorities to defaults"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-white/5">
            <span className="text-[11px] text-slate-400 block mb-1 font-medium">Catalog Total</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white">{totalRoles}</span>
              <span className="text-[11px] text-slate-500">roles</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-emerald-500/20">
            <span className="text-[11px] text-emerald-400 block mb-1 font-medium">Enabled Active</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-emerald-400">{enabledRolesCount}</span>
              <span className="text-[11px] text-emerald-500 font-mono">({Math.round((enabledRolesCount / Math.max(1, totalRoles)) * 100)}%)</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-amber-500/20">
            <span className="text-[11px] text-amber-400 block mb-1 font-medium flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> High Priority
            </span>
            <span className="text-xl font-black text-amber-300">{highPriorityCount}</span>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-blue-500/20">
            <span className="text-[11px] text-blue-400 block mb-1 font-medium">Medium Priority</span>
            <span className="text-xl font-black text-blue-300">{medPriorityCount}</span>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-700/40">
            <span className="text-[11px] text-slate-400 block mb-1 font-medium">Low Priority</span>
            <span className="text-xl font-black text-slate-400">{lowPriorityCount}</span>
          </div>
        </div>
      </div>

      {/* Conflict Validation Alert */}
      {conflictMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex items-start justify-between gap-3 text-rose-200 text-xs animate-in slide-in-from-top-2">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-rose-300">Preference Conflict Warning</p>
              <p className="mt-0.5">{conflictMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setConflictMessage(null)}
            className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Filter & Quick Selection Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search roles (e.g. Lead, Figma, Shopify)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategoryFilter}
            onChange={e => setSelectedCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="all">All 13 Categories</option>
            {ROLE_CATEGORIES.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPriorityFilter}
            onChange={e => setSelectedPriorityFilter(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="all">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          {/* Quick Select / Deselect All */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <CheckSquare className="w-3.5 h-3.5" /> Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <Square className="w-3.5 h-3.5" /> Deselect All
            </button>
          </div>
        </div>
      </div>

      {/* Role Categories Accordion & Lists */}
      <div className="space-y-4">
        {ROLE_CATEGORIES.map(cat => {
          const catRoles = groupedRoles[cat.name] || [];
          // If searching or filtering and no roles match, hide category
          if (catRoles.length === 0 && (searchQuery || selectedCategoryFilter !== 'all' || selectedPriorityFilter !== 'all')) {
            return null;
          }

          // Stats for this category in full catalog
          const allRolesInCat = config?.roles.filter(r => r.category === cat.name) || [];
          const enabledInCat = allRolesInCat.filter(r => r.enabled).length;
          const isExpanded = expandedCategories[cat.name] !== false;

          return (
            <div
              key={cat.id}
              className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-lg transition-all"
            >
              {/* Category Header */}
              <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div
                  onClick={() => toggleCategoryExpand(cat.name)}
                  className="flex items-center gap-3 cursor-pointer group flex-1"
                >
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-105 transition-transform">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {cat.name}
                      </h2>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">
                        {enabledInCat} / {allRolesInCat.length} Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{cat.description}</p>
                  </div>
                </div>

                {/* Category Action Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Category Bulk Priority */}
                  <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/10 text-[11px]">
                    <span className="text-slate-400 px-1 text-[10px] font-medium hidden md:inline">Batch:</span>
                    <button
                      onClick={() => handleSetCategoryPriority(cat.name, 'HIGH')}
                      className="px-2 py-0.5 rounded text-[10px] font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
                      title="Set all roles in category to HIGH priority"
                    >
                      HIGH
                    </button>
                    <button
                      onClick={() => handleSetCategoryPriority(cat.name, 'MEDIUM')}
                      className="px-2 py-0.5 rounded text-[10px] font-bold text-blue-300 hover:bg-blue-500/20 transition-colors"
                      title="Set all roles in category to MEDIUM priority"
                    >
                      MED
                    </button>
                    <button
                      onClick={() => handleSetCategoryPriority(cat.name, 'LOW')}
                      className="px-2 py-0.5 rounded text-[10px] font-bold text-slate-400 hover:bg-white/10 transition-colors"
                      title="Set all roles in category to LOW priority"
                    >
                      LOW
                    </button>
                  </div>

                  {/* Enable / Disable All for Category */}
                  {enabledInCat < allRolesInCat.length ? (
                    <button
                      onClick={() => handleToggleCategory(cat.name, true)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition-colors"
                    >
                      Enable All
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleCategory(cat.name, false)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
                    >
                      Disable All
                    </button>
                  )}

                  <button
                    onClick={() => toggleCategoryExpand(cat.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Roles Grid within Category */}
              {isExpanded && (
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {catRoles.map(role => {
                    const isHigh = role.priority === 'HIGH';
                    const isMed = role.priority === 'MEDIUM';

                    return (
                      <div
                        key={role.id}
                        className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          role.enabled
                            ? 'bg-slate-950/80 border-amber-500/30 shadow-sm'
                            : 'bg-slate-950/30 border-white/5 opacity-60'
                        }`}
                      >
                        {/* Checkbox & Role Name */}
                        <div
                          onClick={() => handleToggleRole(role.id)}
                          className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0"
                        >
                          <input
                            type="checkbox"
                            checked={role.enabled}
                            onChange={() => {}} // Handled by div click
                            className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-900 border-white/20 shrink-0 cursor-pointer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold truncate ${role.enabled ? 'text-white' : 'text-slate-400'}`}>
                                {role.name}
                              </span>
                              {role.isCustom && (
                                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                                  Custom
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Priority Selector & Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {role.enabled && (
                            <div className="flex items-center rounded-lg bg-slate-900 p-0.5 border border-white/10 text-[10px]">
                              <button
                                onClick={() => handleChangePriority(role.id, 'HIGH')}
                                className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                                  isHigh
                                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                                    : 'text-slate-400 hover:text-amber-300'
                                }`}
                              >
                                HIGH
                              </button>
                              <button
                                onClick={() => handleChangePriority(role.id, 'MEDIUM')}
                                className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                                  isMed
                                    ? 'bg-blue-500 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-blue-300'
                                }`}
                              >
                                MED
                              </button>
                              <button
                                onClick={() => handleChangePriority(role.id, 'LOW')}
                                className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                                  role.priority === 'LOW'
                                    ? 'bg-slate-700 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                              >
                                LOW
                              </button>
                            </div>
                          )}

                          {/* Custom Role Actions */}
                          {role.isCustom && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditCustomModal(role)}
                                className="p-1 rounded text-slate-400 hover:text-amber-400 transition-colors"
                                title="Edit role"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCustomRole(role.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                                title="Delete custom role"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Preferred and Excluded Preferences Section (Section D) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Preferred Roles Box */}
        <div className="p-6 rounded-2xl glass-panel border border-emerald-500/30 bg-slate-900/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Preferred Roles (High Affinity Boost)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {config?.preferredRoles.length || 0} Listed
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Jobs matching these preferred roles receive an automatic match score boost up to 98% and are flagged with high priority.
          </p>

          {/* Add input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newPrefRoleInput}
              onChange={e => setNewPrefRoleInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddPreferredRole()}
              placeholder="Add preferred role (e.g. Design Systems Lead)..."
              className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <button
              onClick={handleAddPreferredRole}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold transition-colors"
            >
              Add
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {config?.preferredRoles.map(role => (
              <span
                key={role}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
              >
                <span>{role}</span>
                <button
                  onClick={() => handleRemovePreferredRole(role)}
                  className="hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Excluded Roles Box */}
        <div className="p-6 rounded-2xl glass-panel border border-rose-500/30 bg-slate-900/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Excluded Roles (Automatic Hold / &lt;30%)
              </h3>
            </div>
            <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
              {config?.excludedRoles.length || 0} Listed
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Jobs matching any excluded role will immediately be penalized to &lt;30% match score and routed strictly to the Approval Queue.
          </p>

          {/* Add input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newExRoleInput}
              onChange={e => setNewExRoleInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddExcludedRole()}
              placeholder="Add excluded role (e.g. Embedded C++ Engineer)..."
              className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50"
            />
            <button
              onClick={handleAddExcludedRole}
              className="px-3.5 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold transition-colors"
            >
              Add
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {config?.excludedRoles.map(role => (
              <span
                key={role}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm"
              >
                <span>{role}</span>
                <button
                  onClick={() => handleRemoveExcludedRole(role)}
                  className="hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Preferred Keywords */}
        <div className="p-6 rounded-2xl glass-panel border border-amber-500/30 bg-slate-900/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Preferred Keywords (Skills & Tools)
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
              {config?.preferredKeywords.length || 0} Listed
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Postings containing these terms (e.g. Figma, Tokens Studio, Fintech) receive a positive skills and domain compatibility boost.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newPrefKeywordInput}
              onChange={e => setNewPrefKeywordInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddPreferredKeyword()}
              placeholder="Add preferred keyword (e.g. Tokens Studio)..."
              className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
            <button
              onClick={handleAddPreferredKeyword}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {config?.preferredKeywords.map(kw => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
              >
                <span>{kw}</span>
                <button
                  onClick={() => handleRemovePreferredKeyword(kw)}
                  className="hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Excluded Keywords */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-700 bg-slate-900/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Excluded Keywords (Negative Filters)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-white/10">
              {config?.excludedKeywords.length || 0} Listed
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Postings containing terms like &quot;Unpaid&quot;, &quot;Internship&quot;, or &quot;Cold Calling&quot; will be penalized to protect your time and prevent unwanted applications.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newExKeywordInput}
              onChange={e => setNewExKeywordInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddExcludedKeyword()}
              placeholder="Add negative keyword (e.g. Unpaid, Commission Only)..."
              className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
            />
            <button
              onClick={handleAddExcludedKeyword}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-white/20 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {config?.excludedKeywords.map(kw => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-white/10 shadow-sm"
              >
                <span>{kw}</span>
                <button
                  onClick={() => handleRemoveExcludedKeyword(kw)}
                  className="hover:text-rose-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Save Toolbar */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-sm shadow-2xl shadow-amber-500/40 hover:brightness-110 active:scale-95 transition-all border border-amber-300/40"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Saving Preferences...</span>
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-slate-950" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Target Roles Matrix</span>
            </>
          )}
        </button>
      </div>

      {/* Custom Role Add/Edit Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {editingRoleId ? 'Edit Custom Role' : 'Add Custom Target Role'}
                </h3>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Role Title *
                </label>
                <input
                  type="text"
                  value={customRoleName}
                  onChange={e => setCustomRoleName(e.target.value)}
                  placeholder="e.g. Lead Generative AI Product Designer"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Assign Category
                </label>
                <select
                  value={customRoleCategory}
                  onChange={e => setCustomRoleCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                >
                  {ROLE_CATEGORIES.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Priority Weight
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['HIGH', 'MEDIUM', 'LOW'] as RolePriority[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCustomRolePriority(p)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        customRolePriority === p
                          ? p === 'HIGH'
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                            : p === 'MEDIUM'
                            ? 'bg-blue-500 text-white border-blue-400 shadow-md'
                            : 'bg-slate-700 text-white border-slate-500 shadow-md'
                          : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustomRole}
                disabled={!customRoleName.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:brightness-110 shadow-md disabled:opacity-50"
              >
                {editingRoleId ? 'Update Role' : 'Add to Catalog'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
