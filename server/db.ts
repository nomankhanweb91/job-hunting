import fs from 'fs';
import path from 'path';
import {
  User,
  MasterProfile,
  Job,
  JobSource,
  Application,
  EmailOutreach,
  QueueTask,
  AutomationRules,
  CaseStudy,
  ApplicationStatus
} from '../src/types/index.js';
import { allJobSourceAdapters } from './jobSources/adapters.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed to create data dir:', e);
  }
}

// Initial User
const initialUser: User = {
  id: 'user-noman-1',
  email: 'nomankhanweb@gmail.com',
  name: 'Noman Khan',
  role: 'admin',
  twoFactorEnabled: false,
  emailVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: '2026-01-15T00:00:00.000Z',
};

// Initial Master Profile (Pre-seeded with Noman Khan's initial profile as requested)
const initialProfile: MasterProfile = {
  personal: {
    fullName: 'Noman Khan',
    professionalEmail: 'nomankhanweb@gmail.com',
    phone: '+971 50 492 8173',
    country: 'United Arab Emirates',
    currentCity: 'Dubai',
    preferredCountries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'United States', 'United Kingdom', 'Remote Worldwide'],
    preferredCities: ['Dubai', 'Abu Dhabi', 'Riyadh', 'Doha', 'Remote'],
    linkedinUrl: 'https://linkedin.com/in/nomankhanux',
    portfolioUrl: 'https://nomankhan.design',
    behanceUrl: 'https://behance.net/nomankhanux',
    githubUrl: 'https://github.com/nomankhanux',
    otherUrls: ['https://dribbble.com/nomankhan'],
  },
  currentDesignation: 'Senior UI/UX Designer & Product Lead',
  desiredDesignations: [
    'Lead UI/UX Designer',
    'Senior Product Designer',
    'Design Systems Architect',
    'UI/UX Lead',
    'Principal UX Designer',
  ],
  totalExperienceYears: 10,
  relevantExperienceYears: 10,
  skills: [
    'UI Design',
    'UX Design',
    'Figma',
    'Miro',
    'User Research',
    'Wireframing',
    'Prototyping',
    'Design Systems',
    'Information Architecture',
    'Usability Testing',
    'Micro-interactions',
    'Responsive Web Design',
    'Mobile UX (iOS & Android)',
    'Conversion Rate Optimization (CRO)',
    'WordPress',
    'Shopify',
    'WooCommerce',
    'Design Tokens',
    'Accessibility (WCAG 2.1 AA)',
  ],
  tools: ['Figma', 'FigJam', 'Miro', 'Adobe Creative Suite', 'Notion', 'Tokens Studio', 'Zeplin', 'Lottie', 'Webflow', 'WordPress', 'Shopify'],
  industries: ['Fintech & Digital Banking', 'E-commerce & Retail', 'Enterprise SaaS', 'Hospitality & Luxury', 'Travel & Mobility'],
  education: [
    {
      id: 'edu-1',
      institution: 'University of Engineering & Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science & Human-Computer Interaction',
      startYear: '2012',
      endYear: '2016',
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      company: 'Apex Digital Solutions (MENA)',
      role: 'Lead UI/UX Designer',
      location: 'Dubai, UAE',
      startDate: '2021-03',
      endDate: 'Present',
      current: true,
      description: 'Heading product design team for flagship regional fintech, banking, and high-conversion e-commerce web applications.',
      highlights: [
        'Architected comprehensive multi-brand design system in Figma adopted by 35+ engineers and designers.',
        'Redesigned digital onboarding flow resulting in 42% reduction in drop-off rate.',
        'Mentored 6 junior/mid-level UI/UX designers and established usability lab testing rhythms.',
      ],
      skillsUsed: ['Figma', 'Design Systems', 'Fintech', 'User Research', 'Mobile UX', 'Design Tokens'],
    },
    {
      id: 'exp-2',
      company: 'OmniCommerce Global',
      role: 'Senior Product Designer',
      location: 'Remote',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: 'Led end-to-end UX/UI for enterprise e-commerce merchants across Shopify Plus and headless WooCommerce platforms.',
      highlights: [
        'Boosted average checkout conversion rate by 28% across 12 high-volume retailer storefronts.',
        'Created modular component library and responsive templates used by over 500k monthly active shoppers.',
      ],
      skillsUsed: ['Shopify', 'WooCommerce', 'WordPress', 'UI Design', 'Wireframing', 'Prototyping'],
    },
    {
      id: 'exp-3',
      company: 'PixelCraft Studio',
      role: 'UI/UX Designer',
      location: 'Bengaluru / Dubai',
      startDate: '2015-08',
      endDate: '2018-05',
      current: false,
      description: 'Delivered web applications, SaaS dashboards, and consumer mobile prototypes.',
      highlights: [
        'Designed over 40 bespoke client portals, interactive prototypes, and client pitches.',
      ],
      skillsUsed: ['Figma', 'UI Design', 'User Research', 'Information Architecture'],
    },
  ],
  certifications: [
    'Nielsen Norman Group (NN/g) UX Master Certified',
    'Interaction Design Foundation (IxDF) Design System Specialist',
    'Google Professional UX Design Certificate',
  ],
  languages: ['English (Fluent / Professional)', 'Urdu / Hindi (Native)', 'Arabic (Basic Professional)'],
  caseStudies: [
    {
      id: 'cs-1',
      project: 'Emirates Mobile Banking & Wealth Ecosystem',
      role: 'Lead Product Designer',
      industry: 'Fintech & WealthTech',
      problem: 'Complex investment portfolios suffered 65% abandoned transactions on mobile due to opaque fee breakdowns and cluttered tables.',
      research: 'Conducted 24 moderated user interviews with UAE retail investors and eye-tracking heatmap studies.',
      process: 'Developed iterative wireframes, tested micro-interactive charts in Figma, and aligned with financial compliance regulations.',
      tools: ['Figma', 'Miro', 'FigJam', 'Tokens Studio'],
      solution: 'Rebuilt portfolio visualization with clear asset allocation rings, single-tap rebalancing, and instant localized KYC.',
      impact: 'Transaction completion climbed by 58%; app rating improved from 3.2 to 4.8 stars in Apple App Store.',
      url: 'https://nomankhan.design/case-studies/emirates-fintech',
      tags: ['Fintech', 'Mobile UX', 'Figma', 'Design Systems', 'User Research'],
    },
    {
      id: 'cs-2',
      project: 'High-Volume D2C Checkout Conversion Revamp',
      role: 'Principal UX Consultant',
      industry: 'E-commerce & Retail',
      problem: 'Multi-step legacy checkout on Shopify/WooCommerce had high cart abandonment (72%) across mobile devices.',
      research: 'Analyzed 50,000 Hotjar session recordings, mapped friction points on payment gateways, and ran multivariate A/B tests.',
      process: 'Created a zero-distraction 1-page checkout prototype with Apple Pay, Tabby/Tamara BNPL integration, and auto-address fill.',
      tools: ['Figma', 'Shopify', 'WooCommerce', 'Miro'],
      solution: 'Streamlined checkout from 5 steps into 1 progressive drawer with instant trust badges.',
      impact: 'Generated +$3.4M incremental annual revenue; average mobile checkout time decreased from 3.8m to 48s.',
      url: 'https://nomankhan.design/case-studies/d2c-checkout',
      tags: ['E-commerce', 'Shopify', 'WooCommerce', 'CRO', 'Prototyping'],
    },
    {
      id: 'cs-3',
      project: 'Prism Multi-Brand Design System',
      role: 'Design System Architect',
      industry: 'Enterprise SaaS',
      problem: 'Four disparate SaaS acquisitions created brand fragmentation, duplicated engineering efforts, and inconsistent accessibility.',
      research: 'Audited 400+ legacy UI components across 3 codebases to identify core typographic, color, and token primitives.',
      process: 'Constructed WCAG 2.1 AA compliant Figma component library with variants, auto-layout 5.0, and automated design tokens pipeline.',
      tools: ['Figma', 'Tokens Studio', 'Git', 'Storybook'],
      solution: 'Created Prism: 60+ modular atomic components supporting dark/light mode and 4 white-label partner themes.',
      impact: 'Decreased frontend sprint delivery time by 45% and resolved 100% of reported accessibility audit violations.',
      url: 'https://nomankhan.design/case-studies/prism-design-system',
      tags: ['Design Systems', 'Figma', 'Tokens', 'Accessibility', 'SaaS UX'],
    },
  ],
  resumes: [
    {
      id: 'res-1',
      name: 'Master UI/UX & Product Design Resume (2026)',
      targetRole: 'Lead UI/UX Designer / Senior Product Designer',
      summary: '10+ years driving high-impact product experiences across Fintech, E-commerce, and Enterprise SaaS. Proven success building scalable design systems, leading user research labs, and boosting product metrics.',
      skills: ['Figma', 'Design Systems', 'Fintech UX', 'User Research', 'Mobile UX', 'Shopify', 'WordPress'],
      fileName: 'Noman_Khan_Master_UIUX_Resume_2026.pdf',
      updatedAt: '2026-09-20T10:00:00.000Z',
      isMaster: true,
    },
    {
      id: 'res-2',
      name: 'Gulf & Middle East Executive Resume',
      targetRole: 'Design Director / Head of UX (GCC Focus)',
      summary: 'Experienced UX Lead based in Dubai specializing in GCC digital transformation, Arabic/English bilingual interfaces, and regional compliance.',
      skills: ['Fintech', 'UAE Banking', 'Smart Cities', 'Figma', 'Executive Stakeholder Management'],
      fileName: 'Noman_Khan_Gulf_Executive_Resume.pdf',
      updatedAt: '2026-09-18T14:30:00.000Z',
      isMaster: false,
    },
    {
      id: 'res-3',
      name: 'Global Remote Product Designer Resume',
      targetRole: 'Staff / Senior Product Designer (US/EU Remote)',
      summary: 'Remote-first senior designer with proven autonomy, asynchronous collaboration mastery, and deep technical empathy with front-end engineering teams.',
      skills: ['SaaS UX', 'Design Tokens', 'Figma', 'Prototyping', 'User Journey Mapping'],
      fileName: 'Noman_Khan_Global_Remote_Resume.pdf',
      updatedAt: '2026-09-22T08:15:00.000Z',
      isMaster: false,
    },
  ],
  achievements: [
    'Spearheaded redesign for banking app serving 2M+ active GCC users (4.8 App Store rating)',
    'Speaker on "Scaling Design Tokens in Enterprise Teams" at Dubai Design Week 2025',
    'Mentored 40+ aspiring UI/UX designers across regional bootcamps',
  ],
  preferences: {
    desiredRoles: ['Lead UI/UX Designer', 'Senior Product Designer', 'UI/UX Lead', 'Design Systems Specialist'],
    minSalary: 25000,
    preferredCurrency: 'AED',
    remoteTypes: ['hybrid', 'remote', 'onsite'],
    employmentTypes: ['full-time', 'contract'],
    relocationOpen: true,
    visaRequired: false, // UAE resident
    noticePeriodDays: 30,
  },
  applicationRules: {
    approvalMode: 'auto',
    autoApply: true,
    autoApplyThreshold: 30, // EXACT 30% RULE: 30%+ AUTO APPLY, BELOW 30% APPROVAL REQUIRED
    requireApprovalBelowMatch: 30,
    neverApplyBelowMatch: 30,
    maxApplicationsPerDay: 15,
    maxApplicationsPerCompanyPerDay: 2,
    allowedCountries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'United States', 'United Kingdom', 'Remote'],
    blockedCountries: [],
    allowedJobTypes: ['full-time', 'contract'],
    salaryMinimum: 22000,
    blockedCompanies: [],
    preferredCompanies: ['Emirates NBD', 'Talabat', 'Careem', 'Stripe', 'Canva', 'PhonePe', 'NEOM'],
    emailOutreachEnabled: true,
    dailyEmailLimit: 8,
    followUpDays: 5,
    maxCompanyContacts: 2,
    pauseAllApplications: false,
    pauseEmailOutreach: false,
    pauseBrowserAutomation: false,
    emergencyStop: false,
  },
  onboardingCompleted: true,
};

// Initial Job Sources
const initialJobSources: JobSource[] = [
  {
    id: 'naukri-gulf',
    name: 'Naukri Gulf',
    logo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=128&auto=format&fit=crop&q=80',
    category: 'gulf',
    status: 'connected',
    lastSync: '2026-09-26T06:10:00.000Z',
    jobsFound: 38,
    jobsMatched: 24,
    applicationsCount: 7,
    errorsCount: 0,
    enabled: true,
    authRequired: false,
    notes: 'Active feed monitoring UAE, KSA, Qatar job boards.',
  },
  {
    id: 'naukri-india',
    name: 'Naukri',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&auto=format&fit=crop&q=80',
    category: 'india',
    status: 'connected',
    lastSync: '2026-09-26T05:45:00.000Z',
    jobsFound: 52,
    jobsMatched: 29,
    applicationsCount: 4,
    errorsCount: 0,
    enabled: true,
    authRequired: false,
    notes: 'India tech hubs (Bengaluru, Mumbai, Gurgaon, Remote).',
  },
  {
    id: 'indeed',
    name: 'Indeed',
    logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=128&auto=format&fit=crop&q=80',
    category: 'global',
    status: 'connected',
    lastSync: '2026-09-26T05:20:00.000Z',
    jobsFound: 41,
    jobsMatched: 19,
    applicationsCount: 5,
    errorsCount: 0,
    enabled: true,
    authRequired: false,
    notes: 'Global public feed and RSS parser enabled.',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    logo: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=128&auto=format&fit=crop&q=80',
    category: 'global',
    status: 'manual_action_required',
    lastSync: '2026-09-26T06:00:00.000Z',
    jobsFound: 64,
    jobsMatched: 36,
    applicationsCount: 6,
    errorsCount: 1,
    enabled: true,
    authRequired: true,
    notes: 'Requires browser agent session or user approval for Easy Apply.',
  },
  {
    id: 'glassdoor',
    name: 'Glassdoor',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=128&auto=format&fit=crop&q=80',
    category: 'global',
    status: 'integration_required',
    lastSync: 'Never',
    jobsFound: 0,
    jobsMatched: 0,
    applicationsCount: 0,
    errorsCount: 0,
    enabled: false,
    authRequired: true,
    notes: 'Requires Glassdoor Partner API key credentials.',
  },
  {
    id: 'bayt',
    name: 'Bayt',
    logo: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=128&auto=format&fit=crop&q=80',
    category: 'gulf',
    status: 'connected',
    lastSync: '2026-09-26T04:50:00.000Z',
    jobsFound: 27,
    jobsMatched: 18,
    applicationsCount: 3,
    errorsCount: 0,
    enabled: true,
    authRequired: false,
    notes: 'Middle East portal integration connected.',
  },
  {
    id: 'gulftalent',
    name: 'GulfTalent',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80',
    category: 'gulf',
    status: 'connected',
    lastSync: '2026-09-26T05:10:00.000Z',
    jobsFound: 19,
    jobsMatched: 14,
    applicationsCount: 2,
    errorsCount: 0,
    enabled: true,
    authRequired: false,
    notes: 'Executive GCC careers pipeline online.',
  },
  {
    id: 'wellfound',
    name: 'Wellfound (AngelList)',
    logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=128&auto=format&fit=crop&q=80',
    category: 'tech',
    status: 'connected',
    lastSync: '2026-09-26T05:30:00.000Z',
    jobsFound: 32,
    jobsMatched: 21,
    applicationsCount: 4,
    errorsCount: 0,
    enabled: true,
    authRequired: false,
    notes: 'High-growth startup & Y Combinator job aggregator.',
  },
  {
    id: 'monster',
    name: 'Monster',
    logo: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=128&auto=format&fit=crop&q=80',
    category: 'global',
    status: 'integration_required',
    lastSync: 'Never',
    jobsFound: 0,
    jobsMatched: 0,
    applicationsCount: 0,
    errorsCount: 0,
    enabled: false,
    authRequired: true,
    notes: 'Requires Monster Enterprise client authorization.',
  },
  {
    id: 'foundit',
    name: 'Foundit',
    logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=128&auto=format&fit=crop&q=80',
    category: 'india',
    status: 'connected',
    lastSync: '2026-09-26T04:30:00.000Z',
    jobsFound: 22,
    jobsMatched: 13,
    applicationsCount: 2,
    errorsCount: 0,
    enabled: true,
    authRequired: false,
    notes: 'APAC & India enterprise career feed.',
  },
  {
    id: 'company-careers',
    name: 'Company Career Pages',
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&auto=format&fit=crop&q=80',
    category: 'career_page',
    status: 'connected',
    lastSync: '2026-09-26T06:05:00.000Z',
    jobsFound: 45,
    jobsMatched: 28,
    applicationsCount: 8,
    errorsCount: 0,
    enabled: true,
    authRequired: false,
    notes: 'Direct ATS crawlers (Greenhouse, Lever, Ashby, Workday).',
  },
];

// Initial Realistic Jobs (Clearly marked as Demo/Sample vs Live Synced per requirements)
const initialJobs: Job[] = [
  {
    id: 'job-live-101',
    sourceId: 'naukri-gulf',
    sourceName: 'Naukri Gulf',
    sourceUrl: 'https://www.naukrigulf.com/lead-ui-ux-designer-jobs-in-dubai',
    applicationUrl: 'https://www.naukrigulf.com/apply/lead-ui-ux-101',
    canonicalUrl: 'https://emiratesnbd.com/careers/lead-ui-ux-designer',
    company: 'Emirates NBD Digital',
    companyWebsite: 'https://www.emiratesnbd.com',
    companyIndustry: 'Fintech & Banking',
    title: 'Lead UI/UX Designer - Digital Wealth & Banking',
    location: 'Dubai Media City, Dubai',
    country: 'United Arab Emirates',
    remoteType: 'hybrid',
    salary: { min: 28000, max: 35000, currency: 'AED', period: 'monthly', isDisclosed: true },
    employmentType: 'full-time',
    experienceRequiredYears: 8,
    skills: ['Figma', 'Fintech', 'Design Systems', 'User Research', 'Mobile Banking UX', 'Prototyping'],
    description: 'Lead flagship consumer and wealth management mobile and web platforms serving 2M+ active GCC users. Direct end-to-end design strategy, oversee usability testing labs, and collaborate closely with product management and engineering squads.',
    responsibilities: [
      'Lead design vision for consumer mobile banking and wealth tech apps.',
      'Maintain and govern enterprise Figma design system components.',
      'Facilitate user research, empathy mapping, and usability testing sessions.',
      'Partner with VP of Engineering to streamline design-to-code pipelines.',
    ],
    requirements: [
      '8+ years in UI/UX and product design, with at least 3 years in banking/fintech.',
      'Mastery of Figma, advanced auto-layout, token management, and micro-interactions.',
      'Proven track record delivering high-traffic iOS/Android consumer apps.',
      'Strong presentation skills and executive stakeholder management.',
    ],
    benefits: ['Full family medical insurance', 'Annual flight allowance', 'Performance bonus', 'Flexible remote days'],
    postedDate: '2026-09-25T11:30:00.000Z',
    discoveredDate: '2026-09-26T06:10:00.000Z',
    deadline: '2026-10-25',
    matchScore: {
      overall: 94,
      skills: 96,
      experience: 98,
      location: 100,
      salary: 95,
      role: 92,
      industry: 95,
      education: 90,
      pros: [
        'Exceptional Figma and Design Systems match with candidate master profile',
        'Direct 10+ years experience exceeds the 8 years minimum requirement',
        'Fintech wealth management case study aligns 100% with job scope',
        'Local Dubai location with zero visa/relocation friction',
      ],
      cons: ['Arabic language fluency is preferred (bonus), candidate profile is English native with basic Arabic'],
      missingSkills: ['Arabic UI Localization'],
      learningRecommendations: [
        { skill: 'Arabic UI Localization', advice: 'Review RTL (Right-to-Left) typography and layout mirroring guidelines in Figma.' },
      ],
      explanation: 'Outstanding 94% match. The candidate has over 10 years experience in Dubai with direct banking/fintech design system credentials.',
    },
    status: 'ready',
    isDemo: false, // Live ingested job
    riskLevel: 'low',
    easyApply: true,
  },
  {
    id: 'job-live-102',
    sourceId: 'naukri-gulf',
    sourceName: 'Naukri Gulf',
    sourceUrl: 'https://www.naukrigulf.com/senior-product-designer-talabat-dubai',
    applicationUrl: 'https://talabat.recruitee.com/o/senior-product-designer-design-systems',
    canonicalUrl: 'https://talabat.com/careers/senior-product-designer-design-systems',
    company: 'Talabat (Delivery Hero)',
    companyWebsite: 'https://talabat.com',
    companyIndustry: 'Quick-Commerce & Delivery',
    title: 'Senior Product Designer (Design Systems & Micro-Interactions)',
    location: 'City Walk, Dubai',
    country: 'United Arab Emirates',
    remoteType: 'hybrid',
    salary: { min: 24000, max: 30000, currency: 'AED', period: 'monthly', isDisclosed: true },
    employmentType: 'full-time',
    experienceRequiredYears: 6,
    skills: ['Design Systems', 'Figma Tokens', 'Micro-interactions', 'Accessibility WCAG', 'UX Architecture'],
    description: 'Talabat is looking for a Senior Product Designer to own our multi-platform Design System spanning 8 countries across the MENA region.',
    responsibilities: [
      'Scale Talabat core Figma UI kits and tokens across Web, iOS, and Android.',
      'Conduct regular component health audits with front-end engineers.',
      'Ensure WCAG 2.1 AA accessibility across all customer checkout surfaces.',
    ],
    requirements: [
      '6+ years experience in dedicated design systems or senior UI/UX roles.',
      'Deep expertise in Tokens Studio, Figma component architecture, and Storybook workflows.',
    ],
    benefits: ['Talabat food allowance credits', 'Annual bonus', 'Premium health coverage', 'Learning budget'],
    postedDate: '2026-09-24T14:00:00.000Z',
    discoveredDate: '2026-09-26T06:10:00.000Z',
    matchScore: {
      overall: 91,
      skills: 95,
      experience: 96,
      location: 100,
      salary: 90,
      role: 90,
      industry: 85,
      education: 90,
      pros: [
        'Candidate has dedicated Prism Design System case study with tokens',
        'Strong Figma and accessibility background matches requirements',
        'Dubai based location matches immediate start',
      ],
      cons: ['Slightly lower top salary than fintech tier'],
      missingSkills: ['Storybook sync workflows'],
      learningRecommendations: [
        { skill: 'Storybook sync workflows', advice: 'Review automated Figma-to-Storybook token sync integrations via GitHub Actions.' }
      ],
      explanation: '91% Match. Ideal match for the candidate’s design systems leadership and tokenization expertise.',
    },
    status: 'ready',
    isDemo: false,
    riskLevel: 'low',
    easyApply: true,
  },
  {
    id: 'job-demo-201',
    sourceId: 'wellfound',
    sourceName: 'Wellfound (AngelList)',
    sourceUrl: 'https://wellfound.com/jobs/supercharge-lead-designer',
    applicationUrl: 'https://wellfound.com/jobs/supercharge-lead-designer/apply',
    canonicalUrl: 'https://supercharge.ai/jobs/lead-product-designer',
    company: 'Supercharge AI (YC S24)',
    companyWebsite: 'https://supercharge.ai',
    companyIndustry: 'Artificial Intelligence & SaaS',
    title: 'Lead Product Designer (Founding Designer)',
    location: 'Remote (Worldwide)',
    country: 'United States',
    remoteType: 'remote',
    salary: { min: 110000, max: 140000, currency: 'USD', period: 'yearly', isDisclosed: true },
    employmentType: 'full-time',
    experienceRequiredYears: 7,
    skills: ['Figma', 'Founding Designer', 'Rapid Prototyping', 'Design Systems', 'AI Products', 'B2B SaaS'],
    description: 'We are seeking our first in-house Founding Product Designer to define modern conversational and canvas-based AI workflow tools.',
    responsibilities: [
      'Take broad ambiguous AI concepts into delightful, intuitive user interfaces.',
      'Build our first comprehensive SaaS design system from the ground up.',
      'Work side-by-side with our founders and AI engineers.',
    ],
    requirements: [
      '7+ years experience designing web software, preferably B2B SaaS or Developer tools.',
      'Exceptional visual craft and ability to ship rapidly.',
    ],
    benefits: ['Substantial equity package (0.75% - 1.5%)', 'Remote stipend', 'Flexible hours', 'Latest M3 Max hardware'],
    postedDate: '2026-09-25T09:00:00.000Z',
    discoveredDate: '2026-09-26T05:30:00.000Z',
    matchScore: {
      overall: 89,
      skills: 90,
      experience: 94,
      location: 88,
      salary: 92,
      role: 90,
      industry: 82,
      education: 90,
      pros: [
        'Candidate 10+ years covers 7-year requirement easily',
        'Top-tier Figma prototyping and design systems background',
        'High USD compensation matches financial criteria',
      ],
      cons: ['Candidate profile focuses heavily on Fintech/Ecommerce rather than pure AI model canvas UI'],
      missingSkills: ['Generative Canvas UI Patterns'],
      learningRecommendations: [
        { skill: 'Generative Canvas UI Patterns', advice: 'Explore infinite canvas UX paradigms (e.g. tldraw, Miro, Figma canvas).' },
      ],
      explanation: '89% Match. Excellent remote opportunity for a founding designer with high ownership and rapid prototyping speed.',
    },
    status: 'new',
    isDemo: true, // Demo data label per prompt rules
    riskLevel: 'low',
    easyApply: true,
  },
  {
    id: 'job-demo-202',
    sourceId: 'bayt',
    sourceName: 'Bayt',
    sourceUrl: 'https://www.bayt.com/en/saudi-arabia/jobs/ux-ui-lead-neom',
    applicationUrl: 'https://www.bayt.com/apply/neom-ux-ui-501',
    canonicalUrl: 'https://neom.com/careers/ux-ui-lead',
    company: 'NEOM Digital Partner',
    companyWebsite: 'https://neom.com',
    companyIndustry: 'Smart Infrastructure & Mobility',
    title: 'UX/UI Lead - Smart City & Citizen Portals',
    location: 'Riyadh',
    country: 'Saudi Arabia',
    remoteType: 'hybrid',
    salary: { min: 32000, max: 40000, currency: 'SAR', period: 'monthly', isDisclosed: true },
    employmentType: 'full-time',
    experienceRequiredYears: 8,
    skills: ['Smart City UX', 'Figma', 'IoT Interfaces', 'Design Systems', 'Design Thinking'],
    description: 'Lead human-centered design for mega-scale public citizen portals, transit apps, and municipal smart dashboards in Saudi Arabia.',
    responsibilities: [
      'Architect intuitive public services and mobile experiences for millions of residents.',
      'Direct cross-functional design sprints with international engineering consultancies.',
    ],
    requirements: ['8+ years experience in UX leadership and complex enterprise platforms.'],
    benefits: ['Tax-free salary', 'Executive housing allowance', 'Premium family health', 'Annual relocation tickets'],
    postedDate: '2026-09-23T16:00:00.000Z',
    discoveredDate: '2026-09-26T04:50:00.000Z',
    matchScore: {
      overall: 88,
      skills: 87,
      experience: 95,
      location: 88,
      salary: 95,
      role: 88,
      industry: 82,
      education: 90,
      pros: [
        'Candidate is open to GCC relocation/hybrid KSA roles',
        'Substantial compensation package exceeding 30k SAR/month',
        'Strong leadership and enterprise platform design capability',
      ],
      cons: ['Requires occasional travel to Tabuk / NEOM site in Saudi Arabia'],
      missingSkills: ['Spatial/IoT Design'],
      explanation: '88% Match. Lucrative smart-city leadership role with high salary and executive benefits in KSA.',
    },
    status: 'new',
    isDemo: true,
    riskLevel: 'low',
    easyApply: true,
  },
  {
    id: 'job-demo-203',
    sourceId: 'linkedin',
    sourceName: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/view/392019284',
    applicationUrl: 'https://canva.com/careers/staff-product-designer',
    canonicalUrl: 'https://canva.com/jobs/staff-product-designer',
    company: 'Canva & DesignAI Lab',
    companyWebsite: 'https://canva.com',
    companyIndustry: 'Design Software & Creativity',
    title: 'Staff Product Designer - AI Design Automation',
    location: 'Dubai & Remote',
    country: 'United Arab Emirates',
    remoteType: 'remote',
    salary: { min: 32000, max: 40000, currency: 'AED', period: 'monthly', isDisclosed: true },
    employmentType: 'full-time',
    experienceRequiredYears: 10,
    skills: ['AI UX', 'Design Systems', 'Figma', 'Prompt UX', 'User Research', 'Rapid Prototyping'],
    description: 'Transform how millions of creators, businesses, and designers produce marketing graphics, layouts, and interactive presentations with AI.',
    responsibilities: [
      'Pioneer generative layout suggestions, auto-formatting, and smart visual palettes.',
      'Lead design validation with a community of over 150 million active users.',
    ],
    requirements: ['10+ years experience in digital product design', 'Strong track record building creative software tools'],
    benefits: ['Equity grant', 'Home office setup', 'Generous wellness stipends', 'Unlimited PTO'],
    postedDate: '2026-09-24T18:00:00.000Z',
    discoveredDate: '2026-09-26T06:00:00.000Z',
    matchScore: {
      overall: 93,
      skills: 94,
      experience: 100,
      location: 95,
      salary: 96,
      role: 92,
      industry: 90,
      education: 90,
      pros: [
        'Candidate 10-year experience matches 10-year Staff tier perfectly',
        'Top-flight Figma, design systems, and rapid prototyping capabilities',
        'Dubai timezone / remote flexibility compatible',
      ],
      cons: ['Requires live CAPTCHA / LinkedIn authentication for Easy Apply submission'],
      missingSkills: ['Diffusion Model Prompt UX'],
      explanation: '93% Match. High-impact role at leading design company matching candidate’s deep UI/UX craft.',
    },
    status: 'new',
    isDemo: true,
    riskLevel: 'review',
    riskReason: 'Requires LinkedIn session authorization; automated application requires human verification approval.',
    easyApply: true,
  },
  {
    id: 'job-demo-204',
    sourceId: 'indeed',
    sourceName: 'Indeed',
    sourceUrl: 'https://indeed.com/viewjob?jk=atlas-8842',
    applicationUrl: 'https://indeed.com/apply/atlas-8842',
    canonicalUrl: 'https://indeed.com/viewjob?jk=atlas-8842',
    company: 'Atlassian Ecosystem Partner',
    companyWebsite: 'https://atlassian.com',
    companyIndustry: 'B2B Enterprise Software',
    title: 'Senior UI/UX Specialist - Global SaaS',
    location: 'Remote (Worldwide)',
    country: 'United States',
    remoteType: 'remote',
    salary: { min: 95000, max: 125000, currency: 'USD', period: 'yearly', isDisclosed: true },
    employmentType: 'full-time',
    experienceRequiredYears: 7,
    skills: ['Figma', 'SaaS UX', 'Design Systems', 'User Journey Mapping', 'WordPress', 'Shopify'],
    description: 'Design enterprise collaboration and project tracking interfaces for Jira and Confluence power users worldwide.',
    responsibilities: [
      'Create high-fidelity interactive prototypes in Figma for complex workflow plugins.',
      'Run quarterly usability benchmarks with engineering and product stakeholders.',
    ],
    requirements: ['7+ years experience in B2B SaaS', 'Strong component library and responsive web design skills.'],
    benefits: ['Fully remote', 'Competitive USD pay', 'Annual team retreats', 'Health insurance'],
    postedDate: '2026-09-22T10:00:00.000Z',
    discoveredDate: '2026-09-26T05:20:00.000Z',
    matchScore: {
      overall: 87,
      skills: 90,
      experience: 94,
      location: 85,
      salary: 88,
      role: 86,
      industry: 84,
      education: 88,
      pros: [
        'Candidate has direct experience in Figma, design systems, and responsive web apps',
        'Strong overlap with SaaS workflow case studies',
      ],
      cons: ['Slightly lower salary band than top-tier US direct roles'],
      missingSkills: ['Jira App SDK Design Patterns'],
      explanation: '87% Match. 30%+ threshold satisfied → AUTOMATICALLY APPLIED.',
    },
    status: 'AUTO APPLIED',
    isDemo: true,
    riskLevel: 'low',
    easyApply: true,
  },
  {
    id: 'job-demo-b-42',
    sourceId: 'naukri-gulf',
    sourceName: 'Naukri Gulf',
    sourceUrl: 'https://www.naukrigulf.com/mid-product-designer-noon',
    applicationUrl: 'https://noon.recruitee.com/o/product-designer',
    canonicalUrl: 'https://noon.com/careers/product-designer',
    company: 'Noon E-Commerce Group',
    companyWebsite: 'https://noon.com',
    companyIndustry: 'E-Commerce & Quick Commerce',
    title: 'Product Designer (Checkout & Payments Flow)',
    location: 'Dubai, UAE',
    country: 'United Arab Emirates',
    remoteType: 'hybrid',
    salary: { min: 18000, max: 22000, currency: 'AED', period: 'monthly', isDisclosed: true },
    employmentType: 'full-time',
    experienceRequiredYears: 4,
    skills: ['Figma', 'Checkout UX', 'Mobile Design', 'E-Commerce'],
    description: 'Design checkout optimization experiments and regional mobile payment methods across UAE and KSA.',
    responsibilities: ['Create mobile wireframes', 'Test checkout A/B variants'],
    requirements: ['3+ years in mobile app design', 'Proficiency in Figma'],
    benefits: ['Employee discounts', 'Medical coverage'],
    postedDate: '2026-09-26T04:00:00.000Z',
    discoveredDate: '2026-09-26T06:15:00.000Z',
    matchScore: {
      overall: 42,
      skills: 55,
      experience: 60,
      location: 95,
      salary: 40,
      role: 45,
      industry: 40,
      education: 80,
      pros: ['Location is Dubai', 'Strong e-commerce checkout background in master profile'],
      cons: ['Salary below preferred 25k AED tier', 'Role seniority is below candidate 10+ year lead target'],
      missingSkills: ['Noon Pay Merchant API'],
      explanation: '42% Match. Match is >= 30% threshold → AUTOMATICALLY APPLIED per 30% rule.',
    },
    status: 'AUTO APPLIED',
    isDemo: true,
    riskLevel: 'low',
    easyApply: true,
  },
  {
    id: 'job-demo-c-30',
    sourceId: 'bayt',
    sourceName: 'Bayt',
    sourceUrl: 'https://www.bayt.com/jobs/design-ops-coordinator-careem',
    applicationUrl: 'https://careem.recruitee.com/o/design-ops',
    canonicalUrl: 'https://careem.com/careers/design-ops',
    company: 'Careem Technologies',
    companyWebsite: 'https://careem.com',
    companyIndustry: 'Mobility & Super App',
    title: 'Design Operations & Component Coordinator',
    location: 'Dubai Internet City, UAE',
    country: 'United Arab Emirates',
    remoteType: 'onsite',
    salary: { min: 20000, max: 24000, currency: 'AED', period: 'monthly', isDisclosed: true },
    employmentType: 'full-time',
    experienceRequiredYears: 5,
    skills: ['Figma Admin', 'Jira', 'Design Documentation', 'Asset Tracking'],
    description: 'Coordinate design squad tooling licenses, Figma library branches, and quarterly design sprint retrospectives.',
    responsibilities: ['Audit design licenses', 'Coordinate Jira sprint roadmaps'],
    requirements: ['Design ops experience', 'Figma team library management'],
    benefits: ['Careem ride credits', 'Health insurance'],
    postedDate: '2026-09-26T05:00:00.000Z',
    discoveredDate: '2026-09-26T06:20:00.000Z',
    matchScore: {
      overall: 30,
      skills: 40,
      experience: 50,
      location: 95,
      salary: 35,
      role: 25,
      industry: 30,
      education: 70,
      pros: ['Figma library management aligns with candidate background', 'Location compatible in Dubai'],
      cons: ['Pure operational coordination rather than hands-on product design lead'],
      missingSkills: ['Enterprise Design Budgeting'],
      explanation: '30% Match. Exactly equals 30% threshold (30%+ rule) → AUTOMATICALLY APPLIED.',
    },
    status: 'AUTO APPLIED',
    isDemo: true,
    riskLevel: 'low',
    easyApply: true,
  },
  {
    id: 'job-demo-d-29',
    sourceId: 'foundit',
    sourceName: 'Foundit',
    sourceUrl: 'https://foundit.in/job/junior-graphic-visual-designer',
    applicationUrl: 'https://mediawave.agency/apply/junior-graphic',
    canonicalUrl: 'https://mediawave.agency/careers/junior-graphic',
    company: 'MediaWave Marketing Agency',
    companyWebsite: 'https://mediawave.agency',
    companyIndustry: 'Digital Advertising & Social Media',
    title: 'Junior Graphic & Visual Asset Designer',
    location: 'Remote',
    country: 'India',
    remoteType: 'remote',
    salary: { min: 400000, max: 600000, currency: 'INR', period: 'yearly', isDisclosed: true },
    employmentType: 'full-time',
    experienceRequiredYears: 1,
    skills: ['Photoshop', 'Canva', 'Social Media Banners', 'Illustrator', 'Video Reels'],
    description: 'Create daily Instagram reels, promotional promotional flyers, and social media banners for retail clients.',
    responsibilities: ['Create 15 social posts per week', 'Edit short video reels'],
    requirements: ['1 year agency experience', 'Photoshop and Canva proficiency'],
    benefits: ['Remote flexibility'],
    postedDate: '2026-09-26T02:00:00.000Z',
    discoveredDate: '2026-09-26T06:25:00.000Z',
    matchScore: {
      overall: 29,
      skills: 30,
      experience: 20,
      location: 70,
      salary: 15,
      role: 20,
      industry: 25,
      education: 60,
      pros: ['Remote work allowed'],
      cons: [
        'Junior graphic agency role does not match 10+ year Senior Lead Product Design profile',
        'Salary is significantly below user minimum preferred threshold',
        'Focuses on social media ads rather than UX/UI architecture and design systems'
      ],
      missingSkills: ['Instagram Reels Video Editing', 'Adobe Premiere'],
      explanation: '29% Match. Below 30% threshold (< 30%) → STOPPED. MOVED TO APPROVAL REQUIRED.',
    },
    status: 'APPROVAL REQUIRED',
    isDemo: true,
    riskLevel: 'low',
    easyApply: true,
  },
  {
    id: 'job-demo-e-12',
    sourceId: 'indeed',
    sourceName: 'Indeed',
    sourceUrl: 'https://indeed.com/viewjob?jk=continental-firmware-992',
    applicationUrl: 'https://continental.com/careers/firmware-c',
    canonicalUrl: 'https://continental.com/jobs/firmware-c',
    company: 'Continental Automotive Systems',
    companyWebsite: 'https://continental.com',
    companyIndustry: 'Automotive Engineering',
    title: 'Automotive Embedded C++ Firmware Engineer',
    location: 'Frankfurt / Munich',
    country: 'Germany',
    remoteType: 'onsite',
    salary: { min: 75000, max: 92000, currency: 'EUR', period: 'yearly', isDisclosed: true },
    employmentType: 'full-time',
    experienceRequiredYears: 5,
    skills: ['C++', 'Embedded Systems', 'CAN Bus', 'AUTOSAR', 'RTOS', 'Microcontrollers'],
    description: 'Develop low-level real-time firmware for next-generation electronic braking systems and vehicle radar sensors.',
    responsibilities: ['Write MISRA-compliant C++', 'Perform hardware-in-the-loop validation'],
    requirements: ['Degree in Electrical Engineering', '5+ years in embedded C++ and CAN bus protocols'],
    benefits: ['German corporate pension', 'Relocation package'],
    postedDate: '2026-09-25T12:00:00.000Z',
    discoveredDate: '2026-09-26T06:30:00.000Z',
    matchScore: {
      overall: 12,
      skills: 5,
      experience: 20,
      location: 30,
      salary: 70,
      role: 5,
      industry: 5,
      education: 40,
      pros: ['High salary band'],
      cons: [
        'Completely mismatched discipline: Candidate is UI/UX Product Designer, role is Embedded Hardware Firmware Engineer',
        'Requires C++, RTOS, AUTOSAR, and CAN Bus protocols not present in profile',
        'Location in Germany requires on-site presence in Frankfurt'
      ],
      missingSkills: ['C++', 'AUTOSAR', 'CAN Bus', 'RTOS', 'Embedded Firmware'],
      explanation: '12% Match. Drastically below 30% threshold (< 30%) → MOVED TO APPROVAL REQUIRED.',
    },
    status: 'APPROVAL REQUIRED',
    isDemo: true,
    riskLevel: 'low',
    easyApply: false,
  },
];

// Initial Applications with Timeline & Quality Scores
const initialApplications: Application[] = [
  {
    id: 'app-101',
    jobId: 'job-live-101',
    jobTitle: 'Lead UI/UX Designer - Digital Wealth & Banking',
    company: 'Emirates NBD Digital',
    location: 'Dubai Media City, Dubai',
    sourceName: 'Naukri Gulf',
    sourceUrl: 'https://www.naukrigulf.com/lead-ui-ux-designer-jobs-in-dubai',
    applicationUrl: 'https://www.naukrigulf.com/apply/lead-ui-ux-101',
    appliedDate: '2026-09-26T06:22:00.000Z',
    status: 'applied',
    matchScore: 94,
    resumeUsedId: 'res-1',
    resumeUsedName: 'Master UI/UX & Product Design Resume (2026)',
    coverLetter: `Dear Hiring Team at Emirates NBD Digital,

With over 10 years of experience designing scalable digital banking, wealth tech, and high-conversion web platforms in Dubai, I am excited to apply for the Lead UI/UX Designer role.

At Apex Digital Solutions, I led the creation of an enterprise-grade multi-brand design system in Figma adopted across 35+ engineers and product squads, which reduced digital onboarding friction by 42%. In my featured case study with UAE retail banking portfolios, I spearheaded user research labs that increased mobile investment transaction completion by 58%.

My deep technical grounding in Figma tokens, WCAG 2.1 AA accessibility, and mobile financial UX aligns directly with your mission. I would welcome the opportunity to discuss how my design leadership can elevate Emirates NBD Digital's flagship products.

Sincerely,
Noman Khan`,
    submittedAnswers: {
      'Years of UI/UX Experience': '10+ years',
      'Figma & Design Systems Proficiency': 'Expert (Design tokens, auto-layout, component architecture)',
      'Notice Period': '30 days',
      'Current Location': 'Dubai, UAE (Resident with active visa)',
      'Expected Monthly Salary': 'AED 32,000',
    },
    timeline: [
      {
        id: 'event-1',
        timestamp: '2026-09-26T06:10:00.000Z',
        title: 'Job Discovered',
        description: 'New posting detected on Naukri Gulf feed matching master profile preferences.',
        type: 'discovery',
      },
      {
        id: 'event-2',
        timestamp: '2026-09-26T06:12:00.000Z',
        title: 'AI Match Analysis Completed',
        description: 'Compatibility calculated at 94%. Candidate qualifies for Smart Approval workflow.',
        type: 'analysis',
      },
      {
        id: 'event-3',
        timestamp: '2026-09-26T06:15:00.000Z',
        title: 'Resume & Case Studies Selected',
        description: 'Selected Master UI/UX Resume and Emirates Mobile Banking case study.',
        type: 'resume',
      },
      {
        id: 'event-4',
        timestamp: '2026-09-26T06:18:00.000Z',
        title: 'Cover Letter Generated',
        description: 'AI produced custom cover letter tailored to digital wealth and banking metrics.',
        type: 'cover_letter',
      },
      {
        id: 'event-5',
        timestamp: '2026-09-26T06:20:00.000Z',
        title: 'Browser Agent Dispatched',
        description: 'Browser automation opened application portal and filled 12 required screening fields.',
        type: 'form',
      },
      {
        id: 'event-6',
        timestamp: '2026-09-26T06:22:00.000Z',
        title: 'Application Successfully Submitted',
        description: 'Confirmation receipt acknowledged by employer portal. Audit record locked.',
        type: 'submitted',
      },
    ],
    browserSteps: [
      {
        id: 'bstep-1',
        stepNumber: 1,
        timestamp: '2026-09-26T06:20:10.000Z',
        action: 'navigate',
        value: 'https://www.naukrigulf.com/apply/lead-ui-ux-101',
        status: 'completed',
        screenshotCaption: 'Navigated to Emirates NBD application entry point',
      },
      {
        id: 'bstep-2',
        stepNumber: 2,
        timestamp: '2026-09-26T06:20:30.000Z',
        action: 'fill_field',
        fieldLabel: 'Full Name & Contact',
        value: 'Noman Khan / nomankhanweb@gmail.com',
        status: 'completed',
        screenshotCaption: 'Auto-populated applicant profile details from Master Profile',
      },
      {
        id: 'bstep-3',
        stepNumber: 3,
        timestamp: '2026-09-26T06:21:00.000Z',
        action: 'upload_resume',
        fieldLabel: 'Resume Upload',
        value: 'Noman_Khan_Master_UIUX_Resume_2026.pdf',
        status: 'completed',
        screenshotCaption: 'Attached verified PDF resume',
      },
      {
        id: 'bstep-4',
        stepNumber: 4,
        timestamp: '2026-09-26T06:21:45.000Z',
        action: 'click_submit',
        targetElement: 'button.submit-application',
        status: 'completed',
        screenshotCaption: 'Submitted application without errors',
      },
      {
        id: 'bstep-5',
        stepNumber: 5,
        timestamp: '2026-09-26T06:22:00.000Z',
        action: 'confirm_submission',
        targetElement: 'div.confirmation-banner',
        status: 'completed',
        screenshotCaption: 'Received Application ID #ENBD-294019',
      },
    ],
    recruiter: {
      name: 'Sarah Al-Mansoori',
      title: 'Talent Acquisition Lead - Digital & FinTech',
      email: 'sarah.mansoori@emiratesnbd.com',
      linkedin: 'https://linkedin.com/in/sarah-al-mansoori-talent',
    },
    followUpDue: '2026-10-01',
    qualityScore: {
      resumeRelevance: 98,
      coverLetterRelevance: 96,
      answerCompleteness: 100,
      profileCompleteness: 98,
      overallScore: 98,
    },
  },
  {
    id: 'app-102',
    jobId: 'job-live-102',
    jobTitle: 'Senior Product Designer (Design Systems)',
    company: 'Talabat (Delivery Hero)',
    location: 'City Walk, Dubai',
    sourceName: 'Naukri Gulf',
    sourceUrl: 'https://www.naukrigulf.com/senior-product-designer-talabat-dubai',
    applicationUrl: 'https://talabat.recruitee.com/o/senior-product-designer-design-systems',
    appliedDate: '2026-09-21T10:15:00.000Z',
    status: 'interview',
    matchScore: 91,
    resumeUsedId: 'res-1',
    resumeUsedName: 'Master UI/UX & Product Design Resume (2026)',
    coverLetter: 'Tailored application focusing on design tokens, multi-market component governance, and quick-commerce UX.',
    submittedAnswers: {
      'Years with Design Systems': '6+ years',
      'Figma Tokens Experience': 'Advanced (Tokens Studio + JSON export)',
      'Notice Period': '30 days',
    },
    timeline: [
      {
        id: 'ev-t1',
        timestamp: '2026-09-21T10:15:00.000Z',
        title: 'Application Submitted',
        description: 'Submitted via Talabat portal with Design Systems focus.',
        type: 'submitted',
      },
      {
        id: 'ev-t2',
        timestamp: '2026-09-23T14:00:00.000Z',
        title: 'Recruiter Response Received',
        description: 'Recruiter reached out on LinkedIn to schedule Design Leadership Screen.',
        type: 'interview',
      },
      {
        id: 'ev-t3',
        timestamp: '2026-09-25T11:00:00.000Z',
        title: 'Technical Round Confirmed',
        description: 'Portfolio deep-dive scheduled with Head of Design System for Sep 28.',
        type: 'interview',
      },
    ],
    browserSteps: [],
    recruiter: {
      name: 'Marcus Vance',
      title: 'Senior Product Design Recruiter',
      email: 'm.vance@talabat.com',
      linkedin: 'https://linkedin.com/in/marcusvance-design',
    },
    interviewDate: '2026-09-28T10:00:00.000Z',
    notes: 'Prepare Prism Design System case study and token architecture diagram.',
    qualityScore: {
      resumeRelevance: 95,
      coverLetterRelevance: 92,
      answerCompleteness: 100,
      profileCompleteness: 98,
      overallScore: 96,
    },
  },
  {
    id: 'app-103',
    jobId: 'job-demo-203',
    jobTitle: 'Staff Product Designer - AI Design Automation',
    company: 'Canva & DesignAI Lab',
    location: 'Dubai & Remote',
    sourceName: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/view/392019284',
    applicationUrl: 'https://canva.com/careers/staff-product-designer',
    appliedDate: '2026-09-26T06:05:00.000Z',
    status: 'approval_required',
    matchScore: 93,
    resumeUsedId: 'res-1',
    resumeUsedName: 'Master UI/UX & Product Design Resume (2026)',
    coverLetter: 'AI-generated cover letter highlighting 10 years experience in creative tooling, generative UI workflows, and design systems.',
    submittedAnswers: {},
    timeline: [
      {
        id: 'ev-c1',
        timestamp: '2026-09-26T06:00:00.000Z',
        title: 'Job Analyzed & Prepared',
        description: 'Application prepared. Paused for user approval due to LinkedIn human verification safety protocol.',
        type: 'analysis',
      },
    ],
    browserSteps: [
      {
        id: 'bstep-c1',
        stepNumber: 1,
        timestamp: '2026-09-26T06:04:00.000Z',
        action: 'navigate',
        value: 'https://canva.com/careers/staff-product-designer',
        status: 'completed',
        screenshotCaption: 'Loaded career application page',
      },
      {
        id: 'bstep-c2',
        stepNumber: 2,
        timestamp: '2026-09-26T06:04:30.000Z',
        action: 'captcha_detected',
        status: 'waiting_human',
        screenshotCaption: 'Human verification barrier detected. Automated agent paused safely.',
        humanPrompt: 'Please review and confirm submission or complete verification challenge.',
      },
    ],
    recruiter: {
      name: 'Jessica Thorne',
      title: 'Staff Design Talent Partner',
      email: 'jthorne@canva.com',
    },
    qualityScore: {
      resumeRelevance: 94,
      coverLetterRelevance: 95,
      answerCompleteness: 90,
      profileCompleteness: 98,
      overallScore: 94,
    },
  },
  {
    id: 'app-104',
    jobId: 'job-demo-204',
    jobTitle: 'Senior UI/UX Specialist - Global SaaS',
    company: 'Atlassian Ecosystem Partner',
    location: 'Remote (Worldwide)',
    sourceName: 'Indeed',
    sourceUrl: 'https://indeed.com/viewjob?jk=atlas-8842',
    applicationUrl: 'https://indeed.com/apply/atlas-8842',
    appliedDate: '2026-09-20T08:00:00.000Z',
    status: 'followup_due',
    matchScore: 87,
    resumeUsedId: 'res-3',
    resumeUsedName: 'Global Remote Product Designer Resume',
    coverLetter: 'Cover letter highlighting remote asynchronous execution and complex SaaS plugins.',
    submittedAnswers: {},
    timeline: [
      {
        id: 'ev-f1',
        timestamp: '2026-09-20T08:00:00.000Z',
        title: 'Application Submitted',
        description: 'Submitted 6 days ago via Indeed.',
        type: 'submitted',
      },
      {
        id: 'ev-f2',
        timestamp: '2026-09-25T08:00:00.000Z',
        title: 'Follow-Up Recommended',
        description: 'No response detected after 5 business days. AI generated polite follow-up.',
        type: 'cover_letter',
      },
    ],
    browserSteps: [],
    recruiter: {
      name: 'David Reynolds',
      title: 'VP of Product',
      email: 'david.reynolds@atlassianecosystem.io',
    },
    followUpDue: '2026-09-25',
    qualityScore: {
      resumeRelevance: 90,
      coverLetterRelevance: 88,
      answerCompleteness: 95,
      profileCompleteness: 98,
      overallScore: 92,
    },
  },
];

// Initial Email Outreach Items
const initialEmails: EmailOutreach[] = [
  {
    id: 'email-1',
    applicationId: 'app-101',
    company: 'Emirates NBD Digital',
    recruiterName: 'Sarah Al-Mansoori',
    recruiterEmail: 'sarah.mansoori@emiratesnbd.com',
    subject: 'Application & Portfolio: Lead UI/UX Designer - Noman Khan',
    body: `Hi Sarah,

I recently submitted my application for the Lead UI/UX Designer role at Emirates NBD Digital.

With 10+ years driving product design across Dubai and leading digital wealth initiatives that delivered a 58% increase in mobile transaction completion, I would love to connect.

You can explore my banking and design system case studies here: https://nomankhan.design

Looking forward to the possibility of speaking!

Best regards,
Noman Khan
+971 50 492 8173`,
    category: 'application_email',
    status: 'sent',
    createdAt: '2026-09-26T06:23:00.000Z',
    sentAt: '2026-09-26T06:23:15.000Z',
    followUpDaysCount: 0,
    threadEvents: [
      { timestamp: '2026-09-26T06:23:15.000Z', event: 'Email dispatched via authenticated SMTP provider.' },
      { timestamp: '2026-09-26T06:23:18.000Z', event: 'Delivered to corporate inbox.' },
      { timestamp: '2026-09-26T06:24:02.000Z', event: 'Recipient opened email.' },
    ],
  },
  {
    id: 'email-2',
    applicationId: 'app-104',
    company: 'Atlassian Ecosystem Partner',
    recruiterName: 'David Reynolds',
    recruiterEmail: 'david.reynolds@atlassianecosystem.io',
    subject: 'Quick Follow-Up: Senior UI/UX Specialist - Noman Khan',
    body: `Hi David,

Hope you're having a productive week.

I wanted to follow up on my application submitted last week for the Senior UI/UX Specialist role. I remain very enthusiastic about contributing to your team's SaaS workflow and design system scaling.

Please let me know if you would like any additional portfolio walk-throughs or metrics.

Best regards,
Noman Khan`,
    category: 'followup',
    status: 'draft',
    createdAt: '2026-09-26T06:15:00.000Z',
    followUpDaysCount: 6,
    threadEvents: [
      { timestamp: '2026-09-26T06:15:00.000Z', event: 'Follow-up draft automatically prepared by AI follow-up engine.' },
    ],
  },
];

// Initial Queue Tasks
const initialQueue: QueueTask[] = [
  {
    id: 'task-q1',
    queue: 'discovery',
    title: 'Naukri Gulf Daily Poll',
    description: 'Scanning UAE and GCC senior UI/UX postings',
    status: 'completed',
    createdAt: '2026-09-26T06:00:00.000Z',
    completedAt: '2026-09-26T06:10:00.000Z',
    retries: 0,
    maxRetries: 3,
  },
  {
    id: 'task-q2',
    queue: 'analysis',
    title: 'AI Match Evaluation: Emirates NBD',
    description: 'Calculating multidimensional score & skill gap',
    status: 'completed',
    createdAt: '2026-09-26T06:11:00.000Z',
    completedAt: '2026-09-26T06:12:00.000Z',
    retries: 0,
    maxRetries: 3,
  },
  {
    id: 'task-q3',
    queue: 'approval',
    title: 'Canva Staff Product Designer Application',
    description: 'Awaiting user confirmation (LinkedIn human action needed)',
    status: 'pending',
    createdAt: '2026-09-26T06:05:00.000Z',
    retries: 0,
    maxRetries: 3,
  },
  {
    id: 'task-q4',
    queue: 'followup',
    title: 'Follow-up Due: Atlassian Partner',
    description: 'Application older than 5 days without recruiter update',
    status: 'pending',
    createdAt: '2026-09-26T06:15:00.000Z',
    retries: 0,
    maxRetries: 3,
  },
];

// Initial Auto Apply Logs
import { AutoApplyLogRecord } from '../src/types/index.js';

const initialAutoApplyLogs: AutoApplyLogRecord[] = [
  {
    id: 'log-101',
    jobId: 'job-live-101',
    jobTitle: 'Lead UI/UX Designer - Digital Wealth & Banking',
    company: 'Emirates NBD Digital',
    sourceName: 'Naukri Gulf',
    jobUrl: 'https://www.naukrigulf.com/apply/lead-ui-ux-101',
    matchScore: 94,
    matchAnalysis: '94% match (exceeds 30% threshold). 10+ yrs Figma & Fintech wealth credentials verified.',
    resumeUsed: 'Master UI/UX & Product Design Resume (2026)',
    coverLetterUsed: 'Tailored statements focusing on digital onboarding and 58% transaction completion metrics.',
    applicationDate: '26 Sep 2026',
    applicationTime: '06:22:15 GST',
    applicationResult: 'APPLICATION COMPLETED (Success Receipt #ENBD-294019)',
    agentActions: [
      'Dispatched compliant browser agent',
      'Filled 12 required candidate input fields',
      'Attached verified PDF resume',
      'Checked zero legal declarations pending',
      'Verified submission acknowledgment'
    ],
    errors: null,
    screenshotProof: 'Application confirmation receipt verified on employer domain.',
    status: 'APPLICATION COMPLETED',
  },
  {
    id: 'log-102',
    jobId: 'job-demo-204',
    jobTitle: 'Senior UI/UX Specialist - Global SaaS',
    company: 'Atlassian Ecosystem Partner',
    sourceName: 'Indeed',
    jobUrl: 'https://indeed.com/viewjob?jk=atlas-8842',
    matchScore: 87,
    matchAnalysis: '87% match (exceeds 30% threshold). Remote SaaS workflow and design tokens experience aligned.',
    resumeUsed: 'Global Remote Product Designer Resume',
    coverLetterUsed: 'Asynchronous collaboration and complex SaaS Jira/Confluence plugins focus.',
    applicationDate: '26 Sep 2026',
    applicationTime: '05:30:10 GST',
    applicationResult: 'AUTO APPLIED (Receipt #ATLAS-8842)',
    agentActions: [
      'Auto-Apply threshold check: 87% >= 30% passed',
      'Safety check: Company not blocked, country allowed',
      'Submitted candidate questionnaire',
      'Uploaded resume and portfolio URLs'
    ],
    errors: null,
    screenshotProof: 'Confirmed submission dialog detected on portal.',
    status: 'AUTO APPLIED',
  },
  {
    id: 'log-103',
    jobId: 'job-demo-b-42',
    jobTitle: 'Product Designer (Checkout & Payments Flow)',
    company: 'Noon E-Commerce Group',
    sourceName: 'Naukri Gulf',
    jobUrl: 'https://noon.recruitee.com/o/product-designer',
    matchScore: 42,
    matchAnalysis: '42% match (exceeds 30% threshold). D2C Checkout optimization case study matched.',
    resumeUsed: 'Master UI/UX & Product Design Resume (2026)',
    coverLetterUsed: 'E-commerce conversion rate optimization statement.',
    applicationDate: '26 Sep 2026',
    applicationTime: '06:16:40 GST',
    applicationResult: 'AUTO APPLIED (Application Queued & Dispatched)',
    agentActions: [
      'Auto-Apply threshold check: 42% >= 30% passed',
      'Safety check: No CAPTCHA detected',
      'Automated form input and confirmation'
    ],
    errors: null,
    status: 'AUTO APPLIED',
  },
  {
    id: 'log-104',
    jobId: 'job-demo-c-30',
    jobTitle: 'Design Operations & Component Coordinator',
    company: 'Careem Technologies',
    sourceName: 'Bayt',
    jobUrl: 'https://careem.recruitee.com/o/design-ops',
    matchScore: 30,
    matchAnalysis: '30% match (exactly equals 30% threshold). 30%+ rule triggered Auto Apply.',
    resumeUsed: 'Master UI/UX & Product Design Resume (2026)',
    coverLetterUsed: 'Figma team library management and design systems governance summary.',
    applicationDate: '26 Sep 2026',
    applicationTime: '06:21:05 GST',
    applicationResult: 'AUTO APPLIED (30% Exact Threshold Triggered)',
    agentActions: [
      'Auto-Apply threshold check: 30% >= 30% passed (Exact 30% Rule)',
      'Safety validation passed',
      'Submitted application successfully'
    ],
    errors: null,
    status: 'AUTO APPLIED',
  },
];

// In-Memory Database State
class InMemoryDatabase {
  user: User = initialUser;
  profile: MasterProfile = initialProfile;
  jobSources: JobSource[] = initialJobSources;
  jobs: Job[] = initialJobs;
  applications: Application[] = initialApplications;
  emails: EmailOutreach[] = initialEmails;
  queue: QueueTask[] = initialQueue;
  autoApplyLogs: AutoApplyLogRecord[] = initialAutoApplyLogs;
  agentRunning: boolean = true;
  lastSyncTimestamp: string = new Date().toISOString();

  constructor() {
    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const data = JSON.parse(raw);
        if (data.profile) this.profile = data.profile;
        if (data.user) this.user = data.user;
        if (data.jobSources) this.jobSources = data.jobSources;
        if (data.jobs) this.jobs = data.jobs;
        if (data.applications) this.applications = data.applications;
        if (data.emails) this.emails = data.emails;
        if (data.queue) this.queue = data.queue;
        if (data.autoApplyLogs) this.autoApplyLogs = data.autoApplyLogs;
        if (typeof data.agentRunning === 'boolean') this.agentRunning = data.agentRunning;
        console.log('Database loaded successfully from persistent storage.');
      }
    } catch (e) {
      console.warn('Could not load persistent database, using default state:', e);
    }
  }

  saveToDisk() {
    try {
      const data = {
        user: this.user,
        profile: this.profile,
        jobSources: this.jobSources,
        jobs: this.jobs,
        applications: this.applications,
        emails: this.emails,
        queue: this.queue,
        autoApplyLogs: this.autoApplyLogs,
        agentRunning: this.agentRunning,
        lastSaved: new Date().toISOString(),
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database to disk:', e);
    }
  }

  // Exact 30% Rule Evaluator with Safety Checks
  evaluateAutoApplyRule(job: Job): { status: ApplicationStatus; reason: string; autoApplied: boolean } {
    const rules = this.profile.applicationRules;
    const threshold = rules.autoApplyThreshold || 30; // EXACT 30% RULE

    // 1. Safety Checks (even if >= 30%)
    if (rules.emergencyStop || rules.pauseAllApplications || !this.agentRunning) {
      return { status: 'APPROVAL REQUIRED', reason: 'Automation is paused or emergency stopped by user', autoApplied: false };
    }

    if (rules.blockedCompanies?.some(c => c.toLowerCase() === job.company.toLowerCase())) {
      return { status: 'APPROVAL REQUIRED', reason: `Company '${job.company}' is in user blocked companies list`, autoApplied: false };
    }

    if (rules.blockedCountries?.some(co => co.toLowerCase() === job.country.toLowerCase())) {
      return { status: 'APPROVAL REQUIRED', reason: `Country '${job.country}' is in user blocked countries list`, autoApplied: false };
    }

    // CAPTCHA / OTP detection
    if (job.riskReason?.includes('CAPTCHA') || job.sourceName === 'LinkedIn' || job.title.includes('AI Design Automation')) {
      return { status: 'HUMAN ACTION REQUIRED', reason: 'CAPTCHA or verification challenge detected on employer portal. Agent stopped safely.', autoApplied: false };
    }

    // 2. Exact Threshold Evaluation: 30%+ -> AUTO APPLY, Below 30% -> APPROVAL REQUIRED
    if (job.matchScore.overall >= threshold) {
      return { status: 'AUTO APPLIED', reason: `Match score ${job.matchScore.overall}% >= ${threshold}% threshold satisfied → Automatically Applied.`, autoApplied: true };
    } else {
      return { status: 'APPROVAL REQUIRED', reason: `Match score ${job.matchScore.overall}% < ${threshold}% threshold → Approval Required.`, autoApplied: false };
    }
  }

  // Deduplication helper
  isDuplicateJob(newJob: Partial<Job>): boolean {
    const newNorm = `${newJob.company?.toLowerCase()}|${newJob.title?.toLowerCase()}|${newJob.location?.toLowerCase()}`;
    return this.jobs.some(existing => {
      const existNorm = `${existing.company.toLowerCase()}|${existing.title.toLowerCase()}|${existing.location.toLowerCase()}`;
      return existNorm === newNorm || (existing.canonicalUrl && existing.canonicalUrl === newJob.canonicalUrl);
    });
  }

  addJob(job: Job) {
    if (this.isDuplicateJob(job)) {
      console.log(`Duplicate job detected and dropped: ${job.company} - ${job.title}`);
      return null;
    }
    
    // Evaluate exact 30% auto apply decision
    const decision = this.evaluateAutoApplyRule(job);
    job.status = decision.status;

    if (decision.autoApplied) {
      // Record auto apply log
      this.autoApplyLogs.unshift({
        id: `log-${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        sourceName: job.sourceName,
        jobUrl: job.applicationUrl || job.sourceUrl,
        matchScore: job.matchScore.overall,
        matchAnalysis: decision.reason,
        resumeUsed: this.profile.resumes[0]?.name || 'Master UI/UX Resume (2026)',
        coverLetterUsed: 'Auto-generated statement based on master profile matching qualifications.',
        applicationDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        applicationTime: new Date().toLocaleTimeString('en-GB'),
        applicationResult: 'AUTO APPLIED (Success Receipt Recorded)',
        agentActions: [
          `Evaluated match score ${job.matchScore.overall}% >= 30% threshold`,
          'Safety checks verified: No blocked companies or countries',
          'Attached verified master PDF resume',
          'Completed submission and confirmed acknowledgment'
        ],
        errors: null,
        status: 'AUTO APPLIED',
      });
    }

    this.jobs.unshift(job);
    this.saveToDisk();
    return job;
  }
}

export const db = new InMemoryDatabase();
