import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Bell,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Terminal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAutomation } from '../../context/AutomationContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { user, profile, logout, setShowOnboardingModal } = useAuth();
  const {
    agentRunning,
    toggleAgent,
    emergencyStop,
    notifications,
    unreadCount,
    markAllNotificationsRead,
    setShowCommandCenter,
    triggerManualSync,
    syncing,
  } = useAutomation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
                  NOMAN AI
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  JOB HUNTER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Find Jobs. Match Jobs. Apply Smarter. Track Everything.
              </p>
            </div>
          </div>
        </div>

        {/* Global Search / AI Command Center Bar */}
        <div className="flex-1 max-w-xl mx-2 hidden md:block">
          <button
            onClick={() => setShowCommandCenter(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 hover:border-amber-500/40 text-slate-400 text-xs transition-colors group shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              <span>Ask AI or run command (e.g. &quot;Find UI/UX jobs in Dubai above AED 25,000&quot;)...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-800/80 rounded border border-white/10">
              <Terminal className="w-3 h-3" /> Cmd+K
            </kbd>
          </button>
        </div>

        {/* Agent Status, Sync, Emergency Stop & User Controls */}
        <div className="flex items-center gap-2.5">
          {/* Ingestion Sync Trigger */}
          <button
            onClick={() => triggerManualSync()}
            disabled={syncing}
            title="Scan supported job sources now"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 text-xs font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{syncing ? 'Scanning Feeds...' : 'Sync Sources'}</span>
          </button>

          {/* AI Agent Status Control */}
          <div className="flex items-center bg-slate-900/90 border border-white/10 rounded-lg p-1 text-xs font-medium">
            <button
              onClick={toggleAgent}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                agentRunning
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${agentRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-semibold">{agentRunning ? 'AI AGENT: RUNNING' : 'AI AGENT: PAUSED'}</span>
              {agentRunning ? <Pause className="w-3 h-3 ml-1" /> : <Play className="w-3 h-3 ml-1" />}
            </button>
          </div>

          {/* Emergency Stop Button */}
          <button
            onClick={emergencyStop}
            title="Emergency halt all running automation tasks"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/40 border border-rose-600/40 text-rose-300 hover:bg-rose-900/50 hover:text-rose-100 text-xs font-bold transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden xl:inline">STOP ALL AGENTS</span>
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markAllNotificationsRead();
              }}
              className="relative p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-sm text-white">Notifications & Alerts</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{notifications.length} recent</span>
                </div>

                <div className="divide-y divide-white/5 max-h-80 overflow-y-auto mt-2">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`py-3 px-1 transition-colors hover:bg-white/5 rounded-lg ${!n.read ? 'bg-amber-500/5' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-xs text-white">{n.title}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{n.message}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('applications');
                    }}
                    className="text-xs text-amber-400 hover:underline font-medium"
                  >
                    View in Application Tracker →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900 border border-white/10 hover:border-amber-500/30 transition-colors"
            >
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-xs">
                {profile?.personal?.fullName ? profile.personal.fullName.slice(0, 2).toUpperCase() : 'NK'}
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden md:inline">
                {profile?.personal?.fullName || 'Noman Khan'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="font-bold text-xs text-white">{profile?.personal?.fullName || 'Noman Khan'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{profile?.personal?.professionalEmail || user?.email}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Master Profile Active</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('profile');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                  >
                    Master Profile & JSON
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('settings');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                  >
                    Automation Rules & API Health
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowOnboardingModal(true);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                  >
                    Re-run Onboarding Wizard
                  </button>
                </div>

                <div className="pt-1 border-t border-white/10">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
