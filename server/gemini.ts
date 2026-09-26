import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize the GoogleGenAI instance with the required telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';

let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Token usage tracker
export const aiUsageStats = {
  requestsCount: 0,
  tokensUsed: 0,
  estimatedCostUsd: 0,
  dailyBudgetUsd: 5.0,
  monthlyBudgetUsd: 50.0,
  quotaExceeded: false,
  quotaPaused: false,
};

function recordTokenUsage(estimatedTokens: number = 600) {
  aiUsageStats.requestsCount += 1;
  aiUsageStats.tokensUsed += estimatedTokens;
  aiUsageStats.estimatedCostUsd = Number(((aiUsageStats.tokensUsed / 1_000_000) * 0.15).toFixed(4));
  if (aiUsageStats.estimatedCostUsd >= aiUsageStats.dailyBudgetUsd) {
    aiUsageStats.quotaPaused = true;
  }
}

/**
 * Robust JSON extractor from model output (handles code fences)
 */
function cleanJsonOutput(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

/**
 * 1. Calculate Match between Master Profile and Job
 */
export async function calculateJobMatchWithAI(profile: any, job: any) {
  if (aiUsageStats.quotaPaused) {
    return {
      error: 'AI quota reached. Automation paused.',
      useFallback: true,
    };
  }

  if (!aiClient) {
    return null; // Will trigger deterministic fallback
  }

  try {
    const prompt = `
You are the NOMAN AI JOB HUNTER Matching Engine. Analyze the compatibility between this candidate's profile and the job posting.
DO NOT fabricate qualifications or assume skills that are not present.

Candidate Profile:
- Name: ${profile.personal?.fullName || 'Candidate'}
- Target Roles: ${(profile.desiredDesignations || []).join(', ')}
- Total Experience: ${profile.totalExperienceYears || 0} years
- Key Skills: ${(profile.skills || []).join(', ')}
- Tools: ${(profile.tools || []).join(', ')}
- Preferred Locations: ${(profile.personal?.preferredCountries || []).join(', ')}
- Preferred Remote: ${(profile.preferences?.remoteTypes || []).join(', ')}
- Min Salary: ${profile.preferences?.minSalary || 0} ${profile.preferences?.preferredCurrency || 'USD'}

Job Details:
- Title: ${job.title}
- Company: ${job.company}
- Location: ${job.location}, ${job.country}
- Remote Type: ${job.remoteType}
- Experience Required: ${job.experienceRequiredYears} years
- Skills Required: ${(job.skills || []).join(', ')}
- Description: ${job.description}
- Salary: ${job.salary?.min || 0} - ${job.salary?.max || 0} ${job.salary?.currency || ''}

Respond ONLY in valid JSON with this exact structure:
{
  "overall": number (0-100),
  "skills": number (0-100),
  "experience": number (0-100),
  "location": number (0-100),
  "salary": number (0-100),
  "role": number (0-100),
  "industry": number (0-100),
  "education": number (0-100),
  "pros": ["string", "string"],
  "cons": ["string", "string"],
  "missingSkills": ["string"],
  "learningRecommendations": [{"skill": "string", "advice": "string"}],
  "explanation": "Clear 2-sentence rationale of why this job matches or has gaps."
}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    recordTokenUsage(750);
    const parsed = JSON.parse(cleanJsonOutput(response.text || '{}'));
    return parsed;
  } catch (error) {
    console.warn('Gemini match calculation failed, using fallback:', error);
    return null;
  }
}

/**
 * 2. Generate Tailored Cover Letter
 */
export async function generateCoverLetterWithAI(profile: any, job: any, tone: string = 'professional') {
  if (!aiClient) return null;
  try {
    const prompt = `
Generate a tailored, high-converting cover letter for:
Candidate: ${profile.personal?.fullName}
Current: ${profile.currentDesignation} with ${profile.totalExperienceYears} years of experience
Core Skills: ${(profile.skills || []).slice(0, 8).join(', ')}
Relevant Case Study: ${profile.caseStudies?.[0]?.project ? `${profile.caseStudies[0].project} (${profile.caseStudies[0].impact})` : 'Design System scaling and mobile UX'}

Applying to:
Company: ${job.company}
Role: ${job.title}
Key Job Requirements: ${(job.requirements || []).join('; ') || job.description}

Tone: ${tone}
Rules:
- DO NOT invent fake employment or credentials.
- Keep it under 280 words.
- Professional, concise, highlight design thinking and business impact.
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    recordTokenUsage(400);
    return response.text?.trim() || '';
  } catch (err) {
    console.error('Error generating cover letter:', err);
    return null;
  }
}

/**
 * 3. Generate Application Form Answers
 */
export async function generateApplicationAnswersWithAI(profile: any, job: any, questions: string[]) {
  if (!aiClient) return null;
  try {
    const prompt = `
Provide factual, professional answers to job application screening questions based STRICTLY on the candidate's profile.
If a question involves legal declaration, visa, or unstated facts, declare strictly based on preferences.

Candidate:
- Name: ${profile.personal?.fullName}
- Experience: ${profile.totalExperienceYears} years
- Notice Period: ${profile.preferences?.noticePeriodDays || 30} days
- Visa Needed: ${profile.preferences?.visaRequired ? 'Yes, requires sponsorship' : 'No'}
- Min Salary: ${profile.preferences?.minSalary} ${profile.preferences?.preferredCurrency}
- Skills: ${(profile.skills || []).join(', ')}

Job: ${job.title} at ${job.company}

Questions to answer:
${questions.map((q, i) => `${i + 1}. "${q}"`).join('\n')}

Return JSON map of {"Question": "Answer"}.
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    recordTokenUsage(500);
    return JSON.parse(cleanJsonOutput(response.text || '{}'));
  } catch (err) {
    console.error('Error generating application answers:', err);
    return null;
  }
}

/**
 * 4. Ask AI About This Job
 */
export async function askAiAboutJobWithAI(profile: any, job: any, question: string) {
  if (!aiClient) return null;
  try {
    const prompt = `
You are the NOMAN AI Job Hunter assistant. The candidate is evaluating this job posting.
Candidate Profile:
- Name: ${profile.personal?.fullName}
- Current Role: ${profile.currentDesignation}
- Experience: ${profile.totalExperienceYears} years
- Skills: ${(profile.skills || []).join(', ')}
- Preferences: ${(profile.preferences?.remoteTypes || []).join(', ')} | Min: ${profile.preferences?.minSalary} ${profile.preferences?.preferredCurrency}

Job Info:
- Company: ${job.company} (${job.location}, ${job.country})
- Role: ${job.title}
- Salary: ${job.salary?.min} - ${job.salary?.max} ${job.salary?.currency}
- Description: ${job.description}
- Requirements: ${(job.requirements || []).join('; ')}

User's Question:
"${question}"

Provide a sharp, actionable, honest answer. If they are missing skills or if the salary is below their minimum, tell them transparently.
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    recordTokenUsage(350);
    return response.text?.trim() || '';
  } catch (err) {
    console.error('Error answering job question:', err);
    return null;
  }
}

/**
 * 5. Generate Recruiter Outreach Email
 */
export async function generateRecruiterEmailWithAI(
  profile: any,
  job: any,
  category: string,
  recruiterName: string = 'Hiring Manager'
) {
  if (!aiClient) return null;
  try {
    const prompt = `
Write a personalized recruiter outreach email.
Category: ${category} (e.g. application_email, recruiter_intro, followup, networking)
Recruiter: ${recruiterName}
Company: ${job.company}
Target Role: ${job.title}

Candidate:
- Name: ${profile.personal?.fullName}
- Title: ${profile.currentDesignation} (${profile.totalExperienceYears} yrs exp)
- Portfolio: ${profile.personal?.portfolioUrl || profile.personal?.behanceUrl}
- Core strengths: ${(profile.skills || []).slice(0, 5).join(', ')}

Return JSON with "subject" and "body". Keep the email concise, persuasive, and authentic.
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    recordTokenUsage(350);
    return JSON.parse(cleanJsonOutput(response.text || '{}'));
  } catch (err) {
    console.error('Error generating recruiter email:', err);
    return null;
  }
}

/**
 * 6. Natural Language Command Center
 */
export async function executeCommandWithAI(profile: any, command: string, jobsSummary: any[]) {
  if (!aiClient) return null;
  try {
    const prompt = `
You are the AI Command Center for NOMAN AI JOB HUNTER.
The user typed this natural language instruction:
"${command}"

Available actions you can trigger:
1. "filter_jobs": filter job list by query, country, role, remote, minSalary
2. "auto_apply_high_match": apply to all jobs with match >= specified score (default 90)
3. "generate_followups": prepare follow-up emails for applications older than X days
4. "pause_automation": pause all agents
5. "resume_automation": resume all agents
6. "emergency_stop": emergency stop all running tasks
7. "create_tailored_resume": customize resume for a target region/role (e.g. UAE / Fintech)
8. "show_company_insights": summarize hiring trends for relevant companies

Return JSON strictly:
{
  "action": "filter_jobs" | "auto_apply_high_match" | "generate_followups" | "pause_automation" | "resume_automation" | "emergency_stop" | "create_tailored_resume" | "general_response",
  "parameters": {
    "minMatch": number,
    "role": string,
    "location": string,
    "minSalary": number,
    "days": number
  },
  "explanation": "Human friendly explanation of what the AI understood and executed",
  "resultMessage": "Success confirmation text to show in the UI"
}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    recordTokenUsage(400);
    return JSON.parse(cleanJsonOutput(response.text || '{}'));
  } catch (err) {
    console.error('Error parsing command with AI:', err);
    return null;
  }
}

/**
 * 7. Parse Resume Text into Structured Profile Data
 */
export async function parseResumeWithAI(resumeText: string) {
  if (!aiClient) return null;
  try {
    const prompt = `
Extract structured professional data from this resume text:
"${resumeText.slice(0, 4000)}"

Return JSON strictly:
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "currentDesignation": "string",
  "totalExperienceYears": number,
  "skills": ["string"],
  "tools": ["string"],
  "education": [{"institution": "string", "degree": "string", "field": "string", "endYear": "string"}],
  "experiences": [{"company": "string", "role": "string", "startDate": "string", "endDate": "string", "current": boolean, "description": "string", "skillsUsed": ["string"]}]
}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    recordTokenUsage(650);
    return JSON.parse(cleanJsonOutput(response.text || '{}'));
  } catch (err) {
    console.error('Error parsing resume with AI:', err);
    return null;
  }
}

/**
 * 8. Daily AI Briefing
 */
export async function generateDailyBriefingWithAI(profile: any, stats: any) {
  if (!aiClient) return null;
  try {
    const prompt = `
Generate a personalized Daily AI Morning Briefing for:
User: ${profile.personal?.fullName} (${profile.currentDesignation})

Current Platform Stats:
- New Jobs Discovered Today: ${stats.newJobsToday || 0}
- High Matches (>85%): ${stats.highMatches || 0}
- Pending Approvals: ${stats.pendingApprovals || 0}
- Follow-ups Due: ${stats.followUpsDue || 0}
- Active Interviews: ${stats.interviews || 0}

Generate an inspiring, executive summary:
Return JSON:
{
  "greeting": "string (e.g. Good morning Noman, your job hunting engine is running smoothly)",
  "summary": "string (2-3 sentences overview of today's priority actions)",
  "highPriorityRecommendations": ["string", "string", "string"]
}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    recordTokenUsage(350);
    return JSON.parse(cleanJsonOutput(response.text || '{}'));
  } catch (err) {
    console.error('Error generating daily briefing:', err);
    return null;
  }
}
