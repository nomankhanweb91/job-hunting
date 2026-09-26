import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { Application, AutomationRules } from '../types';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'match' | 'submitted' | 'captcha' | 'interview' | 'followup' | 'warning';
  read: boolean;
}

interface AutomationContextType {
  agentRunning: boolean;
  toggleAgent: () => Promise<void>;
  emergencyStop: () => Promise<void>;
  rules: AutomationRules | null;
  updateRules: (rules: Partial<AutomationRules>) => Promise<void>;
  notifications: NotificationItem[];
  unreadCount: number;
  markAllNotificationsRead: () => void;
  showCommandCenter: boolean;
  setShowCommandCenter: (show: boolean) => void;
  activeBrowserModalApp: Application | null;
  setActiveBrowserModalApp: (app: Application | null) => void;
  triggerManualSync: (sourceId?: string) => Promise<{ newlyIngestedCount: number }>;
  syncing: boolean;
}

const AutomationContext = createContext<AutomationContextType | undefined>(undefined);

export const AutomationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agentRunning, setAgentRunning] = useState<boolean>(true);
  const [rules, setRules] = useState<AutomationRules | null>(null);
  const [showCommandCenter, setShowCommandCenter] = useState<boolean>(false);
  const [activeBrowserModalApp, setActiveBrowserModalApp] = useState<Application | null>(null);
  const [syncing, setSyncing] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: '94% Match Job Discovered',
      message: 'Emirates NBD posted Lead UI/UX Designer in Dubai Media City.',
      time: '15m ago',
      type: 'match',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Human Verification Required',
      message: 'Canva Staff Product Designer portal requires CAPTCHA verification.',
      time: '24m ago',
      type: 'captcha',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Interview Round Confirmed',
      message: 'Talabat confirmed Technical Design System screen for Sep 28.',
      time: '1h ago',
      type: 'interview',
      read: false,
    },
    {
      id: 'notif-4',
      title: 'Follow-Up Recommended',
      message: 'Atlassian Ecosystem Partner application submitted 6 days ago without response.',
      time: '2h ago',
      type: 'followup',
      read: true,
    },
  ]);

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await api.getAutomationStatus();
        if (data) {
          setAgentRunning(data.agentRunning);
          setRules(data.rules);
        }
      } catch (e) {
        console.error('Failed to load automation status:', e);
      }
    }
    loadStatus();
  }, []);

  const toggleAgent = async () => {
    try {
      const res = await api.toggleAgent();
      if (res.success) {
        setAgentRunning(res.agentRunning);
      }
    } catch (e) {
      console.error('Failed to toggle agent:', e);
    }
  };

  const emergencyStop = async () => {
    try {
      const res = await api.emergencyStop();
      if (res.success) {
        setAgentRunning(false);
        setNotifications(prev => [
          {
            id: `notif-${Date.now()}`,
            title: 'EMERGENCY STOP ACTIVATED',
            message: 'All running browser agents, applications, and queue tasks halted immediately.',
            time: 'Just now',
            type: 'warning',
            read: false,
          },
          ...prev,
        ]);
      }
    } catch (e) {
      console.error('Failed emergency stop:', e);
    }
  };

  const updateRules = async (newRules: Partial<AutomationRules>) => {
    try {
      const res = await api.updateAutomationRules(newRules);
      if (res.success) {
        setRules(res.rules);
      }
    } catch (e) {
      console.error('Failed to update rules:', e);
    }
  };

  const triggerManualSync = async (sourceId?: string) => {
    setSyncing(true);
    try {
      const res = await api.syncSources(sourceId);
      if (res.success) {
        setNotifications(prev => [
          {
            id: `notif-${Date.now()}`,
            title: 'Source Ingestion Sync Completed',
            message: `Scanned active feeds. Detected ${res.newlyIngestedCount} new postings with zero duplicates.`,
            time: 'Just now',
            type: 'match',
            read: false,
          },
          ...prev,
        ]);
        return { newlyIngestedCount: res.newlyIngestedCount };
      }
      return { newlyIngestedCount: 0 };
    } finally {
      setSyncing(false);
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AutomationContext.Provider
      value={{
        agentRunning,
        toggleAgent,
        emergencyStop,
        rules,
        updateRules,
        notifications,
        unreadCount,
        markAllNotificationsRead,
        showCommandCenter,
        setShowCommandCenter,
        activeBrowserModalApp,
        setActiveBrowserModalApp,
        triggerManualSync,
        syncing,
      }}
    >
      {children}
    </AutomationContext.Provider>
  );
};

export const useAutomation = () => {
  const context = useContext(AutomationContext);
  if (!context) throw new Error('useAutomation must be used within an AutomationProvider');
  return context;
};
