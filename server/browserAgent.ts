import { BrowserAgentStep } from '../src/types/index.js';

export interface BrowserSession {
  applicationId: string;
  jobId: string;
  url: string;
  status: 'idle' | 'running' | 'waiting_human' | 'completed' | 'failed' | 'cancelled';
  steps: BrowserAgentStep[];
  humanPrompt?: string;
  humanActionType?: 'captcha' | 'otp' | 'legal_declaration' | 'payment_gate';
  externalPageUrl?: string;
}

export const activeBrowserSessions = new Map<string, BrowserSession>();

/**
 * Creates and starts a browser automation run for an application.
 * Follows strict compliance rules: never bypasses CAPTCHA/OTP; halts safely when human action is needed.
 */
export function startBrowserAutomation(
  applicationId: string,
  jobId: string,
  url: string,
  profile: any,
  job: any,
  answers: Record<string, string> = {}
): BrowserSession {
  // If this job has CAPTCHA or external portal requirement, we simulate human verification step
  const isExternalOrCaptchaProne = job.sourceName === 'LinkedIn' || job.company === 'PhonePe';

  const session: BrowserSession = {
    applicationId,
    jobId,
    url,
    status: 'running',
    steps: [
      {
        id: `step-1-${Date.now()}`,
        stepNumber: 1,
        timestamp: new Date().toISOString(),
        action: 'navigate',
        targetElement: 'window.location',
        value: url,
        status: 'completed',
        screenshotCaption: `Navigated to application portal at ${job.company}`,
      },
      {
        id: `step-2-${Date.now()}`,
        stepNumber: 2,
        timestamp: new Date().toISOString(),
        action: 'detect_form',
        targetElement: 'form#job-application, form.application-form',
        status: 'completed',
        screenshotCaption: 'Located primary job application container and required form inputs',
      },
      {
        id: `step-3-${Date.now()}`,
        stepNumber: 3,
        timestamp: new Date().toISOString(),
        action: 'fill_field',
        targetElement: 'input[name="full_name"]',
        fieldLabel: 'Full Name',
        value: profile.personal?.fullName || 'Noman Khan',
        status: 'completed',
        screenshotCaption: `Populated candidate full name: ${profile.personal?.fullName || 'Noman Khan'}`,
      },
      {
        id: `step-4-${Date.now()}`,
        stepNumber: 4,
        timestamp: new Date().toISOString(),
        action: 'fill_field',
        targetElement: 'input[name="email"]',
        fieldLabel: 'Email Address',
        value: profile.personal?.professionalEmail || 'nomankhanweb@gmail.com',
        status: 'completed',
        screenshotCaption: 'Verified and inserted professional contact email',
      },
      {
        id: `step-5-${Date.now()}`,
        stepNumber: 5,
        timestamp: new Date().toISOString(),
        action: 'fill_field',
        targetElement: 'input[name="phone"]',
        fieldLabel: 'Phone Number',
        value: profile.personal?.phone || '+971 50 123 4567',
        status: 'completed',
        screenshotCaption: 'Filled contact telephone with country code',
      },
      {
        id: `step-6-${Date.now()}`,
        stepNumber: 6,
        timestamp: new Date().toISOString(),
        action: 'upload_resume',
        targetElement: 'input[type="file"]#resume',
        fieldLabel: 'Resume Attachment',
        value: 'Noman_Khan_Master_UIUX_Resume_2026.pdf',
        status: 'completed',
        screenshotCaption: 'Attached verified PDF resume matching job qualifications',
      },
      {
        id: `step-7-${Date.now()}`,
        stepNumber: 7,
        timestamp: new Date().toISOString(),
        action: 'fill_field',
        targetElement: 'textarea[name="cover_letter"]',
        fieldLabel: 'Cover Letter / Note to Hiring Team',
        value: 'Attached tailored statement of intent and portfolio references.',
        status: 'completed',
        screenshotCaption: 'Inserted AI customized cover letter highlighting design systems and fintech metrics',
      }
    ]
  };

  // If CAPTCHA is simulated:
  if (isExternalOrCaptchaProne) {
    session.status = 'waiting_human';
    session.humanActionType = 'captcha';
    session.humanPrompt = 'Cloudflare / reCAPTCHA challenge detected on employer portal. Automation halted safely per compliance policy. Please complete verification.';
    session.externalPageUrl = url;
    session.steps.push({
      id: `step-8-${Date.now()}`,
      stepNumber: 8,
      timestamp: new Date().toISOString(),
      action: 'captcha_detected',
      targetElement: 'div.g-recaptcha, iframe[src*="recaptcha"]',
      fieldLabel: 'Human Verification Challenge',
      status: 'waiting_human',
      screenshotCaption: 'CAPTCHA barrier detected. Agent stopped safely to protect user account integrity.',
      humanPrompt: session.humanPrompt,
    });
  } else {
    // Standard successful completion
    session.steps.push(
      {
        id: `step-8-${Date.now()}`,
        stepNumber: 8,
        timestamp: new Date().toISOString(),
        action: 'click_submit',
        targetElement: 'button[type="submit"]',
        fieldLabel: 'Submit Application Button',
        status: 'completed',
        screenshotCaption: 'Verified all required fields valid. Executed submission action.',
      },
      {
        id: `step-9-${Date.now()}`,
        stepNumber: 9,
        timestamp: new Date().toISOString(),
        action: 'confirm_submission',
        targetElement: 'div.submission-confirmation, h2:contains("Thank you")',
        status: 'completed',
        screenshotCaption: 'Application submission successfully acknowledged by employer system.',
      }
    );
    session.status = 'completed';
  }

  activeBrowserSessions.set(applicationId, session);
  return session;
}

/**
 * Handle user resolving human action (e.g. solved CAPTCHA, completed page manually, or cancelled)
 */
export function resolveHumanAction(
  applicationId: string,
  resolution: 'continue' | 'mark_completed' | 'cancel'
): BrowserSession | null {
  const session = activeBrowserSessions.get(applicationId);
  if (!session) return null;

  if (resolution === 'cancel') {
    session.status = 'cancelled';
    session.steps.push({
      id: `step-cancel-${Date.now()}`,
      stepNumber: session.steps.length + 1,
      timestamp: new Date().toISOString(),
      action: 'halt_human_needed',
      status: 'failed',
      screenshotCaption: 'User elected to cancel automation task.',
    });
  } else if (resolution === 'continue' || resolution === 'mark_completed') {
    session.status = 'completed';
    // Update the pending step
    const lastStep = session.steps[session.steps.length - 1];
    if (lastStep && lastStep.status === 'waiting_human') {
      lastStep.status = 'completed';
    }
    session.steps.push({
      id: `step-resolved-${Date.now()}`,
      stepNumber: session.steps.length + 1,
      timestamp: new Date().toISOString(),
      action: 'confirm_submission',
      targetElement: 'body',
      status: 'completed',
      screenshotCaption: 'Human verification completed. Application finalized and verified.',
    });
  }

  activeBrowserSessions.set(applicationId, session);
  return session;
}
