import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, MasterProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  profile: MasterProfile | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (email: string, name: string) => Promise<{ success: boolean; requiresOnboarding: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<MasterProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  toggle2FA: () => Promise<void>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MasterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  const refreshProfile = async () => {
    try {
      const p = await api.getProfile();
      setProfile(p);
      if (!p.onboardingCompleted) {
        setShowOnboardingModal(true);
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const authData = await api.getCurrentUser();
        if (authData?.user) {
          setUser(authData.user);
          await refreshProfile();
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await api.login(email, password);
      if (res.success && res.user) {
        setUser(res.user);
        await refreshProfile();
        setShowAuthModal(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const register = async (email: string, name: string) => {
    try {
      const res = await api.register(email, name);
      if (res.success && res.user) {
        setUser(res.user);
        await refreshProfile();
        setShowAuthModal(false);
        if (res.requiresOnboarding) {
          setShowOnboardingModal(true);
        }
        return { success: true, requiresOnboarding: res.requiresOnboarding };
      }
      return { success: false, requiresOnboarding: false };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, requiresOnboarding: false };
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setShowAuthModal(true);
  };

  const updateProfile = async (updated: Partial<MasterProfile>) => {
    try {
      const res = await api.updateProfile(updated);
      if (res.success && res.profile) {
        setProfile(res.profile);
        if (user) {
          setUser({ ...user, name: res.profile.personal.fullName });
        }
      }
    } catch (e) {
      console.error('Failed to update profile:', e);
    }
  };

  const toggle2FA = async () => {
    try {
      const res = await api.toggle2FA();
      if (user && res.success) {
        setUser({ ...user, twoFactorEnabled: res.twoFactorEnabled });
      }
    } catch (e) {
      console.error('Failed to toggle 2FA:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
        toggle2FA,
        showAuthModal,
        setShowAuthModal,
        showOnboardingModal,
        setShowOnboardingModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
