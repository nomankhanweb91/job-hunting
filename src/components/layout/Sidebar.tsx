import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  FileCheck2,
  Mail,
  FileText,
  FolderGit2,
  Radio,
  BarChart3,
  Cpu,
  User,
  Settings,
  Sparkles,
  Zap,
  ShieldAlert,
  ClipboardList,
} from 'lucide-react';
import { useAutomation } from '../../context/AutomationContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { unreadCount, agentRunning } = useAutomation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Job Feed', icon: Briefcase, badge: 'Active' },
    { id: 'approval-queue', label: 'Approval Queue', icon: ShieldAlert, badge: '<30%' },
    { id: 'auto-apply-log', label: 'Auto Apply Log', icon: ClipboardList, badge: '30%+' },
    { id: 'applications', label: 'Applications', icon: FileCheck2 },
    { id: 'emails', label: 'Email Outreach', icon: Mail },
    { id: 'resumes', label: 'AI Resumes', icon: FileText },
    { id: 'portfolio', label: 'Portfolio Intel', icon: FolderGit2 },
    { id: 'sources', label: 'Job Sources', icon: Radio, count: '11' },
    { id: 'reports', label: 'Reports & Stats', icon: BarChart3 },
    { id: 'automation', label: 'Queues & Safety', icon: Cpu },
    { id: 'profile', label: 'Master Profile', icon: User },
    { id: 'settings', label: 'Settings & API', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-slate-950/70 p-4 shrink-0 min-h-[calc(100vh-65px)] justify-between">
        <div className="space-y-6">
          {/* Quick AI Assistant Card */}
          <div className="p-3.5 rounded-2xl glass-panel-gold border border-amber-500/30">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-300">AI Application Engine</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Monitoring 11 job sources with Gemini 3.8 Flash. Deduplication and smart auto-match active.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium text-slate-400 bg-slate-800">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer / System Status */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Gemini 3.8 Flash</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Compliance Guard</span>
            </div>
            <span className="text-[10px] text-slate-300">STRICT</span>
          </div>
        </div>
      </aside>

      {/* Mobile Responsive Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {navItems.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
            currentPage === 'settings' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};
