import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AutomationProvider, useAutomation } from './context/AutomationContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { CommandCenterModal } from './components/command/CommandCenterModal';
import { BrowserAgentModal } from './components/browser/BrowserAgentModal';

import { DashboardPage } from './pages/DashboardPage';
import { JobFeedPage } from './pages/JobFeedPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { EmailOutreachPage } from './pages/EmailOutreachPage';
import { ResumesPage } from './pages/ResumesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { JobSourcesPage } from './pages/JobSourcesPage';
import { ReportsPage } from './pages/ReportsPage';
import { AutomationQueuePage } from './pages/AutomationQueuePage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { ApprovalQueuePage } from './pages/ApprovalQueuePage';
import { AutoApplyLogPage } from './pages/AutoApplyLogPage';
import { TargetRolesPage } from './pages/TargetRolesPage';
import { Job, Application } from './types';

function MainApp() {
  const { user, showOnboardingModal, setShowOnboardingModal } = useAuth();
  const {
    showCommandCenter,
    setShowCommandCenter,
    activeBrowserModalApp,
    setActiveBrowserModalApp,
  } = useAutomation();

  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | undefined>(undefined);
  const [activeJobFilter, setActiveJobFilter] = useState<any>(null);

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setCurrentPage('job-detail');
  };

  const handleSelectApplication = (app: Application) => {
    setSelectedAppId(app.id);
    setCurrentPage('applications');
  };

  const handleApplicationCreated = (app: Application) => {
    setSelectedAppId(app.id);
    // User stays on detail or can switch to applications
  };

  // Keyboard shortcut for Cmd+K command center
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandCenter(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowCommandCenter]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentPage === 'dashboard' && (
            <DashboardPage
              onNavigate={setCurrentPage}
              onSelectJob={handleSelectJob}
              onSelectApplication={handleSelectApplication}
            />
          )}

          {currentPage === 'jobs' && (
            <JobFeedPage
              onSelectJob={handleSelectJob}
              initialFilter={activeJobFilter}
            />
          )}

          {currentPage === 'target-roles' && <TargetRolesPage />}

          {currentPage === 'approval-queue' && <ApprovalQueuePage />}

          {currentPage === 'auto-apply-log' && <AutoApplyLogPage />}

          {currentPage === 'job-detail' && selectedJob && (
            <JobDetailPage
              job={selectedJob}
              onBack={() => setCurrentPage('jobs')}
              onApplicationCreated={handleApplicationCreated}
            />
          )}

          {currentPage === 'applications' && (
            <ApplicationsPage selectedAppId={selectedAppId} />
          )}

          {currentPage === 'emails' && <EmailOutreachPage />}

          {currentPage === 'resumes' && <ResumesPage />}

          {currentPage === 'portfolio' && <PortfolioPage />}

          {currentPage === 'sources' && <JobSourcesPage />}

          {currentPage === 'reports' && <ReportsPage />}

          {currentPage === 'automation' && <AutomationQueuePage />}

          {currentPage === 'profile' && <ProfilePage onNavigate={setCurrentPage} />}

          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global Modals */}
      <AuthModal />

      {showOnboardingModal && (
        <OnboardingWizard
          onClose={() => setShowOnboardingModal(false)}
          onCompleted={() => setCurrentPage('dashboard')}
        />
      )}

      {showCommandCenter && (
        <CommandCenterModal
          onClose={() => setShowCommandCenter(false)}
          onNavigateToJobsWithFilter={filter => {
            setActiveJobFilter(filter);
            setShowCommandCenter(false);
            setCurrentPage('jobs');
          }}
        />
      )}

      {activeBrowserModalApp && (
        <BrowserAgentModal
          application={activeBrowserModalApp}
          onClose={() => setActiveBrowserModalApp(null)}
          onRefresh={() => {
            // refresh data
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AutomationProvider>
        <MainApp />
      </AutomationProvider>
    </AuthProvider>
  );
}
